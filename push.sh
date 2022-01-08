#!/bin/bash
git add .;
git commit -m "$1"
git push;
cd public;
git add .;
git commit -m "$1";
git push;