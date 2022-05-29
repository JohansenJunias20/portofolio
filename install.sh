#!/bin/bash
# please make sure docker installed from apt-get docker.io not from snapd
# installing so can start on boot linux
systemctl stop porto;
sudo cp porto.service /etc/systemd/system/porto.service
sed -i "s,__dir__,$PWD," /etc/systemd/system/porto.service
chmod 777 prod.sh
systemctl enable porto