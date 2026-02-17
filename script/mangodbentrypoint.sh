#!/bin/bash
set -e

echo "Starting MongoDB..."

# Start original Mongo entrypoint in background
/docker-entrypoint.sh mongod &

echo "Waiting for MongoDB to be ready..."
sleep 10

echo "Running custom init script..."

mongosh -u admin -p password --authenticationDatabase admin /docker-entrypoint-initdb.d/mongodbinit.js

echo "Initialization complete."

wait
