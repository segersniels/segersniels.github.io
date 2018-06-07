---
layout: post
title: Multi-stage Dockerfiles and NPM
---
As GDPR drew near we took a look at how we could improve our general security. One of those securit enhancements was converting from an old legacy Sinopia to a new Verdaccio registry.

Our old system had an authentication token directly in the local `.npmrc`, eventhough being in a private repository and being locked away in ECR it wasn't exactly the most secure way to handle the situation. The `.npmrc` was still lingering in the history of the docker layers if somehow an image was compromised by someone, exposing our entire private NPM registry. Not even that, just simply having access to our private github repository in some way gave the possibility to just go read the `.npmrc` file directly from there.

This is how we handled it. 

First we generated an `authToken` by logging into the npm registry using `npm login --registry https://foo.bar`. This generated token, saved in `$HOME/.npmrc`, was then exported as an environment variable named `NPM_TOKEN`.

This allowed us to change our `.npmrc` file to something like this:

{% highlight bash %}
registry = https://foo.bar
//foo.bar/:_authToken=${NPM_TOKEN}
{% endhighlight %}

Allowing NPM to read directly from the local environment to determine the authentication token. 

To prevent an `.npmrc` or `NPM_TOKEN` variable lingering in our docker layers we make use of docker multi-stage builds. This basically means that we split our docker actions into multiple stages and having only the latest stage visible in our docker history. Underneath is an example of a basic multistage build that applies this technique.

{% highlight bash %}
FROM node:8-alpine as intermediate

WORKDIR /app

ARG NPM_TOKEN

RUN apk add --no-cache ... && \
  npm install && \
  rm .npmrc

FROM node:8-alpine

WORKDIR /app

COPY --from=intermediate /app/node_modules node_modules
COPY package.json package.json
COPY docker/entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh

ENTRYPOINT ["/app/entrypoint.sh"]
{% endhighlight %}

We simply execute an npm install in the first stage and copy the node_modules from the first stage into the final stage. Next up is to get the environment variable `NPM_TOKEN` exposed in our docker build. This can easily be done by doing `docker build --build-arg NPM_TOKEN -f Dockerfile -t foo .`. For even more security measures you can throw in a `--squash` to your docker build command to remove any lingering files that were deleted in the history of your docker layers.
