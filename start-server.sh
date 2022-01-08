#!/bin/bash
# 49160-64000:49160-64000/udp
sudo npm i forever -g;
sudo bash internal_generate-ssl.sh;
sudo forever start ws-server/index.js;

# nodemon ws-server/index.js;
# docker run -d -p 3478:3478 -p 3478:3478/udp -p 5349:5349 -p 5349:5349/udp -P coturn/coturn -v ./turnserver.conf:/etc/coturn/turnserver.conf
