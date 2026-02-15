#!/bin/bash
# Start SQL Server in the background
/opt/mssql/bin/sqlservr &

# Wait for SQL Server to start
echo "Waiting for SQL Server to start..."
sleep 20

# Set password as variable (using single quotes)
PASSWORD='YourStrong!Passw0rd'


# Run initialization script
echo "Running init.sql..."
# Then use the variable
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P "$PASSWORD" -C -i /docker-entrypoint-initdb.d/init.sql
echo "Running init.sql... complete"
# Keep container running
# wait
