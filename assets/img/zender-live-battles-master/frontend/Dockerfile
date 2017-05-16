FROM mhart/alpine-node:6

WORKDIR /usr/src/app
ARG REACT_APP_API_URL=http://35.163.12.16:3000
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ARG REACT_APP_CHANNEL_ROOT=https://api.staging.zender.tv/v1/channels
ENV REACT_APP_CHANNEL_ROOT=$REACT_APP_CHANNEL_ROOT
ADD . /usr/src/app
RUN rm -rf ./node_modules && npm i && npm rebuild node-sass && npm run build

EXPOSE 8080
CMD npm run server
