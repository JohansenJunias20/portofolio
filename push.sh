#!/bin/bash
git add .;
git commit -m "$1"
git push origin master;
webpack  --config webpack.prod.js;
cd public;
git add .;
git commit -m "$1";
git push origin master;