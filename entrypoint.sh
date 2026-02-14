#!/bin/bash
# Start SQL Server in the background
/opt/mssql/bin/sqlservr &

# Wait for SQL Server to start
echo "Waiting for SQL Server to start..."
sleep 20

# Run initialization script
echo "Running init.sql..."
sqlcmd -S localhost -U sa -P YourStrong!Passw0rd -i /docker-entrypoint-initdb.d/init.sql

# Keep container running
wait
