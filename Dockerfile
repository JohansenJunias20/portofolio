FROM node:alpine
RUN npm install -g nodemon;
RUN npm install -g webpack webpack-cli@4.9.2 forever;
WORKDIR /usr/src/app