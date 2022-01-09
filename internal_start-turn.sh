#!/bin/bash
# please run in with sudo command
echo "running internal_start_turn script";
echo "only called by other bash script, please do not run manually";
echo "please make sure turn server turned off and port 3478, 5379, 49152-65535/udp open and not used by other process";
# -p 49152-65535:49152-65535/udp \
# if [ "$1" == "" ]
echo $(pwd)/turnserver.conf:/etc/coturn/turnserver.conf 
docker run -p 3478:3478 -p 3478:3478/udp -p 5349:5349 -p 5349:5349/udp  -v "./turnserver.conf:/etc/coturn/turnserver.conf"  coturn/coturn;
docker run --help coturn/coturn;