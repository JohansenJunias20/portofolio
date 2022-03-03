FROM node:alpine
RUN npm install -g nodemon;
RUN npm install -g webpack webpack-cli forever;
WORKDIR /usr/src/app