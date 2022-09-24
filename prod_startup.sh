#!/bin/bash
sleep 60; # avoid conflic renew ssl with rpok.service(reverse-proxy-orbits-komputer) when system boot up.
bash prod.sh
# while true loop
while true; do
    sleep 10;
    # heart beat to check if the server is running
    echo "heart beat";
done
