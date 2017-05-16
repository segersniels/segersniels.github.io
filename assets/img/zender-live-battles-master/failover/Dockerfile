FROM mhart/alpine-node:6

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Bundle app source
ADD . /usr/src/app
RUN npm i 

EXPOSE 8000
CMD npm run start