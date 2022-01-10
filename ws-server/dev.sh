cd /usr/src/app;
echo "installing dependencies for websocket server";
npm install;
echo "running websocker server, please make sure port 2000 not used by other process";
nodemon index.js --legacy-watch;