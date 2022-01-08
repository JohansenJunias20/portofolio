#!/bin/bash

sudo webpack --config webpack.prod.js;
sudo npm i -g forever;
sudo bash ./internal_generate-ssl.sh;
sudo forever start ws-server/index.js;