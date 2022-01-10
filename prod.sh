#!/bin/bash

docker build -t customnode:latest $(pwd) -f /$(pwd)/.dockerfile; # build customnode image 
# installing dependencies
docker run -v "/$(pwd)/ws-server:/usr/src/app" customnode:latest npm install;

bash ./build.sh PROD;


# generate ssh if expired & start socketio server 
docker-compose -d -f docker-compose.prod.yml up;

sudo bash internal_start-turn.sh PROD;
