#!/bin/bash

# Update system packages
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
else
    echo "Docker is already installed"
fi

# Pull the latest image
echo "Pulling the latest image..."
sudo docker pull imtarunk/supax:latest

# Stop and remove existing container if it exists
if [ "$(sudo docker ps -aq -f name=superfi-app)" ]; then
    echo "Stopping and removing existing container..."
    sudo docker stop superfi-app
    sudo docker rm superfi-app
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file..."
    echo "Please update the .env file with your environment variables"
    touch .env
fi

# Run the new container
echo "Starting the container..."
sudo docker run -d \
    --name superfi-app \
    -p 80:3000 \
    --env-file .env \
    --restart unless-stopped \
    imtarunk/supax:latest

# Check if container is running
if [ "$(sudo docker ps -q -f name=superfi-app)" ]; then
    echo "Container is running successfully!"
    echo "You can access your application at http://$(curl -s ifconfig.me)"
else
    echo "Container failed to start. Checking logs..."
    sudo docker logs superfi-app
fi 