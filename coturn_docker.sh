docker run -d -p 3478:3478 -p 49160-49200:49160-49200/udp \
    -v "/$(pwd)/turnserver.conf:/etc/coturn/turnserver.conf" \
    -v "/$(pwd)/ssl/main/:/etc/letsencrypt/" \
    instrumentisto/coturn -n --log-file=stdout \
    --min-port=49160 --max-port=49200
