#!/bin/bash
git add .;
git commit -m "$1"
git push origin master;
cd public;
git add .;
git commit -m "$1";
git push origin master;