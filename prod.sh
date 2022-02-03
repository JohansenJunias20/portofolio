#!/bin/bash
export $(cat .env | xargs)
chmod 777 ./private/main.exe
sudo bash ./private/main.exe $PROD_WS_PORT

# compile typescript to dist file
bash ./build.sh -m PROD -d
# installing dependencies
docker run -v "/$(pwd)/ws-server:/usr/src/app" customnode:latest npm install

# copy .env file to ws-server/
cp .env ws-server/.env

echo "RUNNING WEBSOCKET SERVER..."
echo "" >>ws-server/.env
echo "PRODUCTION=TRUE" >>ws-server/.env
# start socketio server
docker-compose -f docker-compose.prod.yml up -d

# bash internal_start-turn.sh;
