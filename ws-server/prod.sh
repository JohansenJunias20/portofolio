sleep 2000; # waiting requesting certificate...
cd /usr/src/app;
echo "installing dependencies for websocket server";
npm install;
npm i -g forever;
echo "running websocker server, please make sure port 2000 not used by other process";
forever stop index.js;
forever start index.js;