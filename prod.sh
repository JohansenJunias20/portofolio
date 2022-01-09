#!/bin/bash

docker build -t customnode:latest $(pwd) -f /$(pwd)/.dockerfile; # build customnode image 
# load dotenv file to variables
export $(cat .env | xargs)
# installing dependencies
docker run -v "/$(pwd)/:/usr/src/app" customnode:latest npm install;
docker run -v "/$(pwd)/:/usr/src/app" customnode:latest npm install -D webpack-cli;
docker run -v "/$(pwd)/ws-server:/usr/src/app" customnode:latest npm install;

# give access so docker can write files to public.
chmod 777 public
chmod 777 public/*
# build dist js
docker run -v "/$(pwd)/:/usr/src/app" customnode:latest \
    npx webpack --config webpack.prod.js \
    --env=PROD_TURN_DOMAIN=$PROD_TURN_DOMAIN --env=PROD_WEBSOCKET_DOMAIN=$PROD_WEBSOCKET_DOMAIN;

# generate ssh if expired & start socketio server 
docker-compose -d -f docker-compose.prod.yml up;

sudo bash internal_start-turn.sh PROD;
