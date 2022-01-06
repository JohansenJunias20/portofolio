#!/bin/bash
# 49160-64000:49160-64000/udp
docker run -d -p 3478:3478 -p 3478:3478/udp -p 5349:5349 -p 5349:5349/udp -P coturn/coturn -v ./turnserver.conf:/etc/coturn/turnserver.conf
