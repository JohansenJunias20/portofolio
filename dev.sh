#!/bin/bash

cp -f .env ws-server/.env;
echo "" >> ws-server/.env;
echo "" >> ws-server/.env;
bash ./build.sh -m DEV & docker-compose -f docker-compose.dev.yml up;

