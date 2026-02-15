#!/bin/bash
# Start MySQL in the background
# (Though in Docker, it's better to let the entrypoint handle this)
docker-entrypoint.sh mysqld &

# Wait for MySQL to start
echo "Waiting for MySQL to start..."
# MySQL is faster, but we usually check for the socket
until mysqladmin ping -h"localhost" -P3306 --silent; do
    echo "MySQL is unavailable - sleeping"
    sleep 2
done

# Set password as variable
PASSWORD='YourStrong!Passw0rd'

# Run initialization script
echo "Running init.sql..."
# -h: host, -u: user, -p: password
mysql -h localhost -u root -p"$PASSWORD" < /docker-entrypoint-initdb.d/mysqlinit.sql

echo "Running init.sql... complete"
# Keep container running
wait