#!/bin/bash

# Function to check internet connectivity
check_internet() {
    ## Ping a commonly reliable host
    ping -c 4 google.com > /dev/null 2>&1
    return $?
}

# Wait for internet connection
while ! check_internet
do
    echo "Waiting for internet connection..."
    sleep 10  # check every 10 seconds
done


# Define the project directory
PROJECT_DIR="/home/warths/Apps/raspberry-lightmix"

# Navigate to the project directory
cd $PROJECT_DIR

# Fetch the latest changes from the remote repository without merging them
git fetch origin main

# Get the latest commit hash from the remote branch 'main'
REMOTE_COMMIT=$(git rev-parse origin/main)

# Get the current commit hash from the local branch 'main'
LOCAL_COMMIT=$(git rev-parse HEAD)

# Compare the remote and local commit hashes
if [ "$REMOTE_COMMIT" != "$LOCAL_COMMIT" ]; then
  echo "Changes detected, updating..."

  # Merge the changes
  git merge origin/main

  # Install/update dependencies
  npm install

  # Compile the TypeScript project
  npm run build

  # Restart the application with PM2
  pm2 restart index

  echo "Deployment completed."
else
  echo "No changes detected, skipping deployment."
fi

