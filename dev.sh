#!/bin/bash

webpack --watch --config webpack.dev.js & nodemon ws-server/index.js;
echo "Done, please use Open Live Server Extension to open public/index.html";