cd /usr/src/app;
echo "installing dependencies for websocket server";
npm install;
echo "running websocker server, please make sure port 2000 not used by other process";
node index.js; # tidak bisa pake forever, pas dicek open port tdk open port 2000;
