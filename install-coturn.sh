#!/bin/bash

# start the script with ./install-coturn.sh 
sudo apt-get -y update;
sudo apt-get -y install coturn;
sudo systemctl stop coturn;
sudo echo "TURNSERVER=1" > /etc/default/coturn;
sudo cp ./turnserver.conf /etc/turnserver.conf;

IN=$(grep -n "^listening-port" ./turnserver.conf)
arrIN=(${IN//=/ })
port=${arrIN[1]}

IN=$(grep -n "^tls-listening-port" ./turnserver.conf)
arrIN=(${IN//=/ })
port_tls=${arrIN[1]}


sudo ufw allow $port;
sudo ufw allow $port_tls;
sudo ufw allow 49152:65535/udp;

IN=$(grep -n "^user=" ./turnserver.conf)
arrIN=(${IN//=/ })
IN=${arrIN[1]} # guest:somepassword
arrIN=(${IN//:/ })
username=${arrIN[0]}
password=${arrIN[1]}

IN=$(grep -n "^realm=" ./turnserver.conf)
arrIN=(${IN//=/ })
realm=${arrIN[1]} # domain

sudo turnadmin -a -u $username -r $realm -p $password
sudo systemctl start coturn;

