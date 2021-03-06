---
layout: post
title: Auto deploying Go binaries to Github
---

When I write tools in Javascript it's easy for people to download them through `npm`.
But as I recently started developing in Go, I encountered some issues. As far as Go goes, there isn't exactly an `npm` alternative besides `glide` for people to quickly install binaries. And having them install directly through a curl just takes away the versioning control of a tool.

Until I found [goreleaser](https://goreleaser.com). Goreleaser is a tool that allows you to easily build and release your Go binaries to github without a hassle. Ofcouse I needed a way to automate this and came up with the following implementation for one of my latest tools on CircleCI 2.0:

{% highlight bash %}
#gorelease.sh
#!/usr/bin/env bash
version=v$(./bin/promote -v |awk '{print $3}')
message=$(git log --format="%s" -n 1 $CIRCLE_SHA1)
if [[ `git tag -l $version` == $version ]]; then
    echo "Tag $version already exists"
else
    go get github.com/goreleaser/goreleaser
    echo "Tagging new version $version"
    git config --global user.email "segers.n@hotmail.com"
    git config --global user.name "Niels Segers"
    git tag -a "$version" -m "$message"
    git push origin "$version"
    goreleaser
fi
{% endhighlight %}

During the CircleCI build process I build a linux binary, using `GOOS=linux go build -o bin/promote`, just to test if it actually builds the tool. Later on in the CI build I run the release script that you see above. I check if the output of `promote -v` has changed in comparison with my Github tags. So untill I actually manually change the version of my tool no new releases will be made. So the only thing I have to do now, whenever I want to create new release, is change the version number from eg. `0.1.1` to `0.1.2` and CircleCI will automatically create the tag on Github for me and push a release using Goreleaser. This requires you to set a `GITHUB_TOKEN` environment variable.

{% highlight yaml %}
#.goreleaser.yml
builds:
  - binary: promote
    goos:
      - darwin
      - linux
    goarch:
      - amd64  
archive:
  format: binary
{% endhighlight %}
