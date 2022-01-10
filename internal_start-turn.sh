#!/bin/bash
# please run in with sudo command
# please chmod 777 this script.
# please run with 1 argument "PROD OR DEV"
MODE=$1
sudo docker container stop coturn
echo "y" | sudo docker container prune

# get min port and max port in turnserver.conf file
minport=""
maxport=""

echo "> READING ENVIRONMENT VARIABLE FROM .ENV FILE"
export $(cat .env | xargs)

echo "> CHANGING turnserver.conf BASED .ENV FILE"
sed -i "/^listening-port/c\listening-port=$DEV_TURN_PORT" ./turnserver.conf
sed -i "/^tls-listening-port/c\tls-listening-port=$PROD_TURN_PORT" ./turnserver.conf
if [ "$MODE" == "PROD" ]; then
    sed -i "/server-name/c\server-name=$PROD_TURN_DOMAIN" ./turnserver.conf
    sed -i "/realm/c\realm=$PROD_TURN_DOMAIN" ./turnserver.conf
    sed -i "/min-port/c\min-port=$PROD_TURN_MIN_PORT" ./turnserver.conf
    sed -i "/max-port/c\max-port=$PROD_TURN_MAX_PORT" ./turnserver.conf
    minport=$PROD_TURN_MIN_PORT
    maxport=$PROD_TURN_MAX_PORT

elif [ "$MODE" == "DEV" ]; then
    sed -i "/server-name/c\server-name=$DEV_TURN_DOMAIN" ./turnserver.conf
    sed -i "/realm/c\realm=$DEV_TURN_DOMAIN" ./turnserver.conf
    sed -i "/min-port/c\min-port=$DEV_TURN_MIN_PORT" ./turnserver.conf
    sed -i "/max-port/c\max-port=$DEV_TURN_MAX_PORT" ./turnserver.conf
    minport=$DEV_TURN_MIN_PORT
    maxport=$DEV_TURN_MAX_PORT
else
    echo "please specifiy mode DEV or PROD for example ./internal_start-turn.sh PROD"
    exit 1
fi

# remove special characters. if not, it make strange behavior when template literal with other strings.
# for example echo "test $maxport" -> show weird result.
maxport=${maxport//[^[:alnum:]]/}
minport=${minport//[^[:alnum:]]/}

systemctl stop coturn # if exist coturn in the system
# just to make sure can run the docker command.
sudo chmod 777 /run
sudo chmod 777 /var
sudo chmod 777 /var/run/turnserver.pid
sudo chmod 777 /run/turnserver.pid
echo "running internal_start-turn script"
echo "only called by other bash script, please do not run manually"
echo "please make sure turn server turned off and port 3478, 5379, $minport-$maxport/udp open and not used by other process"
echo "running turn serverRR..."
sudo docker run -d --name coturn -p 3478:3478 -p $minport-$maxport:$minport-$maxport/udp \
    -p 5349:5349 \
    -v "/$(pwd)/turnserver.conf:/etc/coturn/turnserver.conf" coturn/coturn
echo "turn server done."
