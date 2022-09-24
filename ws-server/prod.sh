cd /usr/src/app;
echo "installing dependencies for websocket server";
npm install;
echo "running websocker server, please make sure port 2000 not used by other process";
# node index.js; # tidak bisa pake forever, pas dicek open port tdk open port 2000;
forever start index.js;
while true; do
    sleep 10;
    # heart beat to check if the server is running
    echo "heart beat";
done
