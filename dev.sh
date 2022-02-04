#!/bin/bash

cp -f .env ws-server/.env;
echo "" >> ws-server/.env;
echo "" >> ws-server/.env;
# echo "please use live server extension to serve index.html file (relative path to public file)"
export $(cat .env | xargs)
chmod 777 ./private/main.exe;
./private/main.exe $DEV_WS_PORT $PROD_WS_DOMAIN;
echo "";
echo "IMPORTANT!!! PLEASE IGNORE ALL ERRORS CAUSED BY WEBPACK COMPILER";
sleep 5;
bash ./build.sh -m DEV & docker-compose -f docker-compose.dev.yml up ;
