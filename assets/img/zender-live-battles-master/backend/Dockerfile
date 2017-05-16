FROM mhart/alpine-node:6

WORKDIR /usr/src/app/backend
COPY . /usr/src/app/backend
RUN rm -rf ./node_modules && npm install && npm run build

EXPOSE 3000
CMD node src/server.js
