export $(cat .env | xargs)

docker run -p 3478:3478 -p 5349:5349 -p 49120-49200:49120-49200/udp \
    -v "$(pwd)/turnserver.conf:/etc/coturn/turnserver.conf" \
    -v "$(pwd)/ssl/main/:/etc/letsencrypt/" \
    instrumentisto/coturn 
