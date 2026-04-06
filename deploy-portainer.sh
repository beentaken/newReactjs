#!/bin/bash

# Set your password
PASSWORD="YourSecurePassword123"

# Generate the hash
HASH=$(docker run --rm httpd:2.4-alpine htpasswd -nbB admin "$PASSWORD" | cut -d ":" -f 2)

# Stop and remove existing container if any
docker stop portainer 2>/dev/null
docker rm portainer 2>/dev/null

# Run Portainer with Windows paths
docker run -d \
  --name portainer \
  --restart always \
  -p 8000:8000 \
  -p 9443:9443 \
  -p 9001:9000 \
  -v //var/run/docker.sock:/var/run/docker.sock \
  -v portainer_data:/data \
  portainer/portainer-ce:latest \
  --admin-password="$HASH"

echo "Portainer started with admin password: $PASSWORD"
echo "Access at: https://localhost:9443"