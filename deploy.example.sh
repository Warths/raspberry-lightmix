#!/bin/bash

PROJECT_DIR="/home/warths/Apps/raspberry-lightmix"
cd $PROJECT_DIR

git fetch origin main

REMOTE_COMMIT=$(git rev-parse origin/main)
LOCAL_COMMIT=$(git rev-parse HEAD)

if [ "$REMOTE_COMMIT" != "$LOCAL_COMMIT" ]; then
  echo "Changes detected, updating..."
  git merge origin/main

  npm install
  npm run build
  pm2 restart Lightmix

  echo "Deployment completed."
else
  echo "No changes detected, skipping deployment."
fi