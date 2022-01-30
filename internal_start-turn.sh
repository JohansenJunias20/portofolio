#!/bin/bash
# please run in with sudo command
# please chmod 777 this script.
sudo docker container stop coturn
echo "y" | sudo docker container prune

# get min port and max port in turnserver.conf file
minport=""
maxport=""

echo "> READING ENVIRONMENT VARIABLE FROM .ENV FILE"
export $(cat .env | xargs)

echo "> CHANGING turnserver.conf BASED .ENV FILE"
sed -i "/^listening-port/c\listening-port=$TURN_PORT" ./turnserver.conf
sed -i "/^tls-listening-port/c\tls-listening-port=$TURN_PORT_TLS" ./turnserver.conf

sed -i "/server-name/c\server-name=$TURN_DOMAIN" ./turnserver.conf
sed -i "/realm/c\realm=$TURN_DOMAIN" ./turnserver.conf
sed -i "/min-port/c\min-port=$TURN_MIN_PORT" ./turnserver.conf
sed -i "/max-port/c\max-port=$TURN_MAX_PORT" ./turnserver.conf
minport=$TURN_MIN_PORT
maxport=$TURN_MAX_PORT

# remove special characters. if not, it make strange behavior when template literal with other strings.
# for example echo "test $maxport" -> show weird result.
maxport=${maxport//[^[:alnum:]]/}
minport=${minport//[^[:alnum:]]/}
TURN_PORT=${TURN_PORT//[^[:alnum:]]/}
TURN_PORT_TLS=${minport//[^[:alnum:]]/}

systemctl stop coturn # if exist coturn in the system
# just to make sure can run the docker command.
sudo chmod 777 /run
sudo chmod 777 /var
sudo chmod 777 /var/run/turnserver.pid
sudo chmod 777 /run/turnserver.pid
echo "running internal_start-turn script"
echo "only called by other bash script, please do not run manually"
echo "please make sure turn server turned off and port 3478, 5379, $minport-$maxport/udp open and not used by other process"
echo "running turn server..."
docker run -d --name coturn -p $TURN_PORT:$TURN_PORT -p $minport-$maxport:$minport-$maxport/udp \
-p $TURN_PORT_TLS:$TURN_PORT_TLS \
-v "/$(pwd)/turnserver.conf:/etc/coturn/turnserver.conf" coturn/coturn
echo "turn server done."