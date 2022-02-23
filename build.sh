#!/bin/bash
# please run in with sudo command
# please chmod 777 this script.
# please run with 1 argument "PROD OR DEV"
DOCKER="false"
MODE=""
while [[ $# -gt 0 ]]; do
    case $1 in
    -m | --mode)
        MODE="$2"
        shift # past argument
        shift # past value
        ;;
    -d | --use-docker)
        DOCKER="true"
        shift # past argument
        ;;
    -h | --help)
        echo "-m | --mode       ) value must be DEV or PROD"
        echo "-d | --use-docker ) using virtualization or not. If you currently under development mode (--mode DEV) on Windows we recommend DO NOT use this option \
because windows not singalling file changes to docker mounted volumes, so webpack on container cannot trace file changes. But make sure \
npm and node js version of computer supported on current modules in package.json"
        exit 0
        shift
        ;;
    --default)
        DEFAULT=YES
        shift # past argument
        ;;

    -* | --*)
        echo "Unknown option $1"
        echo "-m | --mode       ) value must be DEV or PROD"
        echo "-d | --use-docker ) using virtualization or not. If you currently under development mode (--mode DEV) on Windows we recommend DO NOT use this option \
because windows not singalling file changes to docker mounted volumes, so webpack on container cannot trace file changes. Make sure \
npm and node js version of computer supported on current modules in package.json"
        exit 1
        ;;

    *)
        echo "test"
        shift # past argument
        ;;
    esac
done

# load .env file to bash script variables.
export $(cat .env | xargs)
if [ "$MODE" == "" ]; then
    echo "please specify mode by -m"
    echo "-m | --mode       ) value must be DEV or PROD"
    echo "-d | --use-docker ) using virtualization or not. If you currently under development mode (--mode DEV) on Windows we recommend DO NOT use this option \
because windows not singalling file changes to docker mounted volumes, so webpack on container cannot trace file changes. But make sure \
npm and node js version of computer supported on current modules in package.json"
    exit
fi
# remove special characters. if not, it make strange behavior when template literal with other strings.
# for example > echo "test $TURN_PORT" -> show weird result. karena newline windows & linux berbeda (windows ada tambahan \r, .env file dibuat diwindows)
TURN_PORT=${TURN_PORT//[^[:alnum:]]/}
TURN_PORT_TLS=${TURN_PORT_TLS//[^[:alnum:]]/}
TURN_MIN_PORT=${TURN_MIN_PORT//[^[:alnum:]]/}
TURN_MAX_PORT=${TURN_MAX_PORT//[^[:alnum:]]/}
TURN_MIN_PORT=${TURN_MIN_PORT//[^[:alnum:]]/}
TURN_MAX_PORT=${TURN_MAX_PORT//[^[:alnum:]]/}
TURN_USERNAME=${TURN_USERNAME//[^[:alnum:]]/}
TURN_PASSWORD=${TURN_PASSWORD//[^[:alnum:]]/}

PROD_WS_PORT=${PROD_WS_PORT//[^[:alnum:]]/}
DEV_WS_PORT=${DEV_WS_PORT//[^[:alnum:]]/}

# use virtualization or not.
if [ "$DOCKER" == "true" ]; then

    docker build -t customnode:latest $(pwd) -f $(pwd)/Dockerfile # build customnode image
    # load dotenv file to variables
    echo "> INSTALLING DEPENDENCIES..."
    # installing dependencies
    docker run -v "/$(pwd)/:/usr/src/app" customnode:latest npm ci
    docker run -v "/$(pwd)/:/usr/src/app" customnode:latest npm install -D webpack-cli

    # give access so docker can write files to public.
    chmod 777 public
    chmod 777 public/*

    echo "> COMPILING TYPESCRIPT..."
    if [ "$MODE" == "PROD" ]; then
        # build dist js
        docker run  -v "/$(pwd)/:/usr/src/app" customnode:latest \
        npx webpack --config webpack.prod.js \
        --env=TURN_DOMAIN=$TURN_DOMAIN --env=WEBSOCKET_DOMAIN=$PROD_WS_DOMAIN \
        --env=TURN_USERNAME=$TURN_USERNAME --env=TURN_PASSWORD=$TURN_PASSWORD --env=WEBSOCKET_PORT=$PROD_WS_PORT \
        --env=TURN_PORT=$TURN_PORT --env=TURN_PORT_TLS=$TURN_PORT_TLS --env=TURN_MIN_PORT=$TURN_MIN_PORT --env=TURN_MAX_PORT=$TURN_MAX_PORT
    elif [ "$MODE" == "DEV" ]; then
        # build dist js
        docker run -p 8080:8080 -v "/$(pwd)/:/usr/src/app" customnode:latest \
        npx webpack-dev-server --config webpack.dev.js \
        --env=TURN_DOMAIN=$TURN_DOMAIN --env=WEBSOCKET_DOMAIN=$DEV_WS_DOMAIN \
        --env=TURN_USERNAME=$TURN_USERNAME --env=TURN_PASSWORD=$TURN_PASSWORD \
        --env=TURN_PORT=$TURN_PORT --env=TURN_PORT_TLS=$TURN_PORT_TLS --env=TURN_MIN_PORT=$TURN_MIN_PORT --env=TURN_MAX_PORT=$TURN_MAX_PORT
    else
        echo "please specifiy mode DEV or PROD for example ./internal_start-turn.sh -m (PROD/DEV)"
        exit 1
    fi
else
    echo "you are not build files using docker, please make sure your computer installed the supported npm and node js version for modules"
    sleep 2
    npm install
    npm install -D webpack-cli
    if [ "$MODE" == "PROD" ]; then
        # build dist js
        npx webpack-dev-server --config webpack.prod.js  \
        --env=TURN_DOMAIN=$TURN_DOMAIN --env=WEBSOCKET_DOMAIN=$PROD_WS_DOMAIN \
        --env=TURN_USERNAME=$TURN_USERNAME --env=TURN_PASSWORD=$TURN_PASSWORD --env=WEBSOCKET_PORT=$PROD_WS_PORT \
        --env=TURN_PORT=$TURN_PORT --env=TURN_PORT_TLS=$TURN_PORT_TLS --env=TURN_MIN_PORT=$TURN_MIN_PORT --env=TURN_MAX_PORT=$TURN_MAX_PORT
    elif [ "$MODE" == "DEV" ]; then
        # build dist js
        webpack --watch --config webpack.dev.js \
        --env=TURN_DOMAIN=$TURN_DOMAIN --env=WEBSOCKET_DOMAIN=$DEV_WS_DOMAIN \
        --env=TURN_USERNAME=$TURN_USERNAME --env=TURN_PASSWORD=$TURN_PASSWORD --env=WEBSOCKET_PORT=$DEV_WS_PORT \
        --env=TURN_PORT=$TURN_PORT --env=TURN_PORT_TLS=$TURN_PORT_TLS --env=TURN_MIN_PORT=$TURN_MIN_PORT --env=TURN_MAX_PORT=$TURN_MAX_PORT
    else
        echo "please specifiy mode DEV or PROD for example ./internal_start-turn.sh -m (PROD/DEV)"
        exit 1
    fi
fi
