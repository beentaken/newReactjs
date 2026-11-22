# Docker Setup Guide

This guide explains how to set up and run MongoDB and MSSQL databases using Docker for local development.

## Prerequisites

- **Docker Desktop** installed and running
  - Download from: https://www.docker.com/products/docker-desktop
  - Requires Windows 10/11 Pro or Enterprise with Hyper-V OR Windows 11 with WSL2

## Quick Start

### 1. Start Services

Run this command from the project root directory:

```bash
docker-compose up -d
```

This will:
- ✅ Start MongoDB on `localhost:27017`
- ✅ Start Mongo Express (MongoDB UI) on `http://localhost:8081`
- ✅ Start MSSQL Server on `localhost:1433`

### 2. Verify Services Are Running

```bash
docker ps
```

You should see three containers:
- `mongodb`
- `mongo-express`
- `mssql`

### 3. Stop Services

```bash
docker-compose down
```

To also remove volumes (database data):

```bash
docker-compose down -v
```

## Connection Strings

### MongoDB
- **Host:** `localhost:27017`
- **Username:** `admin`
- **Password:** `password`
- **Database:** `ReactJsDb`
- **Connection String:** `mongodb://admin:password@localhost:27017/?authSource=admin`

Use this in your .NET application (already configured in `Program.cs`).

### MSSQL Server
- **Server:** `localhost,1433` or `localhost:1433`
- **Username:** `sa`
- **Password:** `YourStrong!Passw0rd`
- **Default Database:** `master`
- **Connection String:** `Server=localhost,1433;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=true;`

## Web UIs

### Mongo Express (MongoDB Browser)
- **URL:** http://localhost:8081
- **Username:** `admin`
- **Password:** `admin`
- Perfect for viewing, browsing, and managing MongoDB collections

### MSSQL Management
- Use **SQL Server Management Studio** (SSMS)
  - Download from: https://aka.ms/ssmsfullsetup
  - Server: `localhost,1433`
  - Authentication: SQL Server Authentication
  - Login: `sa`
  - Password: `YourStrong!Passw0rd`

OR use **Azure Data Studio**:
  - Download from: https://github.com/microsoft/azuredatastudio
  - Connection type: Microsoft SQL Server
  - Server: `localhost,1433`
  - Authentication: SQL Login
  - User name: `sa`
  - Password: `YourStrong!Passw0rd`

## Database Configuration

### MongoDB Setup

When Docker starts MongoDB, it automatically:
1. Creates the `ReactJsDb` database
2. Creates the `Locations` collection with schema validation
3. Adds indexes on `country`, `continent`, and `timestamp`
4. Populates sample location data

### MSSQL Setup

To create databases for Entity Framework:

1. Connect to MSSQL using SSMS or Azure Data Studio
2. Run the following SQL to create databases:

```sql
-- Create main application database
CREATE DATABASE [ReactJsDb];

-- Create test database (optional)
CREATE DATABASE [ReactJsDb_Test];
```

Then update your connection string in `appsettings.json`:

```json
{
  "ConnectionStrings": {
	"DefaultConnection": "Server=localhost,1433;User Id=sa;Password=YourStrong!Passw0rd;Database=ReactJsDb;TrustServerCertificate=true;"
  }
}
```

## Common Docker Commands

```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f mongodb
docker-compose logs -f mssql

# Stop services without removing
docker-compose stop

# Start stopped services
docker-compose start

# Remove containers (keeps volumes/data)
docker-compose down

# Remove everything including volumes
docker-compose down -v

# Rebuild images
docker-compose build --no-cache

# Run specific service
docker-compose up -d mongodb

# Execute command in container
docker exec -it mongodb mongosh -u admin -p password
docker exec -it mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P YourStrong!Passw0rd
```

## Troubleshooting

### MongoDB Connection Issues
- **Port already in use:** Change `27017:27017` to `27017:27018` in docker-compose.yml
- **Authentication failed:** Check username/password match in code and docker-compose.yml
- **Can't connect from app:** Ensure connection string uses `mongodb://admin:password@mongodb:27017/` (without localhost)

### MSSQL Connection Issues
- **Port already in use:** Change `1433:1433` to `1433:1434` in docker-compose.yml
- **SA password too simple:** MSSQL requires strong passwords (uppercase, lowercase, numbers, symbols)
- **Connection timeout:** Wait 30+ seconds for MSSQL to start (first startup is slow)
- **Login failed:** Verify SA password is exactly `YourStrong!Passw0rd`

### Container Won't Start
```bash
# Check logs
docker-compose logs mssql
docker-compose logs mongodb

# Remove and recreate
docker-compose down -v
docker-compose up -d
```

### Performance Issues on Windows
- Increase Docker Desktop memory allocation (Settings → Resources → Memory)
- Recommended: 4GB+ for both MongoDB and MSSQL

## Production Considerations

⚠️ **These containers are for development only!**

For production, you should:
- Use managed database services (Azure SQL Database, MongoDB Atlas)
- Use strong, unique passwords
- Enable proper backup strategies
- Use proper networking and security groups
- Monitor resource usage and scaling

## Integration with .NET Application

Your application is already configured to work with these Docker services:

- **MongoDB:** See `Program.cs` for IMongoClient registration
  ```csharp
  builder.Services.AddSingleton<IMongoClient>(sp =>
	new MongoClient("mongodb://admin:password@mongodb:27017/?authSource=admin"));
  ```

- **Entity Framework:** Configure DbContext connection string in `appsettings.json`
  ```json
  {
	"ConnectionStrings": {
	  "DefaultConnection": "Server=localhost,1433;User Id=sa;Password=YourStrong!Passw0rd;Database=ReactJsDb;TrustServerCertificate=true;"
	}
  }
  ```

## Environment Variables

You can override settings by creating a `.env` file in the project root:

```env
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=mypassword
MSSQL_SA_PASSWORD=MyStrong!Pass123
```

Then update your `docker-compose.yml` to reference these variables.

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [MSSQL Docker Image](https://hub.docker.com/_/microsoft-mssql-server)
- [Mongo Express](https://github.com/mongo-express/mongo-express)
