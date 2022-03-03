FROM node:latest
RUN npm install -g nodemon;
RUN npm install -g webpack webpack-cli forever;
RUN apt-get -y update
RUN apt-get install coturn -y
RUN echo "TURNSERVER_ENABLED=1" > /etc/default/coturn
RUN service coturn stop
WORKDIR /usr/src/app