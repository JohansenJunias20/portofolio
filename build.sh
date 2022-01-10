#!/bin/bash
# please run in with sudo command
# please chmod 777 this script.
# please run with 1 argument "PROD OR DEV"
MODE=$1

docker build -t customnode:latest $(pwd) -f /$(pwd)/.dockerfile # build customnode image
# load dotenv file to variables
export $(cat .env | xargs)
echo "> INSTALLING DEPENDENCIES..."
# installing dependencies
docker run -v "/$(pwd)/:/usr/src/app" customnode:latest npm install
docker run -v "/$(pwd)/:/usr/src/app" customnode:latest npm install -D webpack-cli

# give access so docker can write files to public.
chmod 777 public
chmod 777 public/*

echo "> COMPILING TYPESCRIPT..."
if [ "$MODE" == "PROD" ]; then
    # build dist js
    docker run -v "/$(pwd)/:/usr/src/app" customnode:latest \
        npx webpack --config webpack.prod.js \
        --env=TURN_DOMAIN=$PROD_TURN_DOMAIN --env=WEBSOCKET_DOMAIN=$PROD_WEBSOCKET_DOMAIN \
        --env=TURN_USERNAME=$PROD_TURN_USERNAME --env=TURN_PASSWORD=$PROD_TURN_PASSWORD \
        --env=TURN_PORT=$PROD_TURN_PORT --env=TURN_MIN_PORT=$PROD_TURN_MIN_PORT --env=TURN_MAX_PORT=$PROD_TURN_MAX_PORT
elif [ "$MODE" == "DEV" ]; then
    # build dist js
    docker run -v "/$(pwd)/:/usr/src/app" customnode:latest \
        npx webpack  --watch --config webpack.dev.js \
        --env=TURN_DOMAIN=$DEV_TURN_DOMAIN --env=WEBSOCKET_DOMAIN=$DEV_WEBSOCKET_DOMAIN \
        --env=TURN_USERNAME=$DEV_TURN_USERNAME --env=TURN_PASSWORD=$DEV_TURN_PASSWORD \
        --env=TURN_PORT=$DEV_TURN_PORT --env=TURN_MIN_PORT=$DEV_TURN_MIN_PORT --env=TURN_MAX_PORT=$DEV_TURN_MAX_PORT
else
    echo "please specifiy mode DEV or PROD for example ./internal_start-turn.sh PROD"
    exit 1
fi
