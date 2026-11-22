# 🐳 Docker Quick Start Guide

This project includes Docker configuration for MongoDB and MSSQL databases.

## ⚡ Quick Start (2 minutes)

### 1️⃣ Start Databases
```powershell
# PowerShell (Windows)
./docker-helper.ps1 -Command start

# OR Bash (Mac/Linux)
./docker-helper.sh start

# OR Direct Docker
docker-compose up -d
```

### 2️⃣ Verify Running
```bash
docker ps
```

You should see:
- ✅ `mongodb` on port 27017
- ✅ `mongo-express` on port 8081
- ✅ `mssql` on port 1433

### 3️⃣ Access Services

- **MongoDB Web UI:** http://localhost:8081 (admin/admin)
- **MongoDB:** localhost:27017 (admin/password)
- **MSSQL:** localhost:1433 (sa/YourStrong!Passw0rd)

## 🛠️ Docker Helper Commands

```bash
./docker-helper.ps1 -Command start      # Start services
./docker-helper.ps1 -Command stop       # Stop services (keeps data)
./docker-helper.ps1 -Command restart    # Restart
./docker-helper.ps1 -Command logs       # View logs
./docker-helper.ps1 -Command status     # Show status
./docker-helper.ps1 -Command clean      # Delete everything
./docker-helper.ps1 -Command rebuild    # Fresh start
```

## 📋 Connection Details

### MongoDB
```
Host: localhost
Port: 27017
Username: admin
Password: password
Database: ReactJsDb
Connection String: mongodb://admin:password@localhost:27017/?authSource=admin
```

### MSSQL
```
Server: localhost,1433
Username: sa
Password: YourStrong!Passw0rd
Connection String: Server=localhost,1433;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=true;
```

## 📖 Detailed Guide

See [DOCKER_SETUP.md](./DOCKER_SETUP.md) for comprehensive documentation including:
- ✅ Prerequisites and installation
- ✅ Database setup and initialization
- ✅ Web UI access (Mongo Express, SSMS, Azure Data Studio)
- ✅ Common Docker commands
- ✅ Troubleshooting
- ✅ Production considerations

## ⚠️ Important Notes

- **These containers are for development only**
- Passwords are configured in `docker-compose.yml`
- Data persists in Docker volumes (`mongodb_data`, `mssql_data`)
- First MSSQL startup may take 30+ seconds
- Requires Docker Desktop installed and running

## 🚀 Next Steps

1. ✅ Start Docker: `./docker-helper.ps1 -Command start`
2. ✅ Run the application: `dotnet run`
3. ✅ Browse Swagger: http://localhost:7048/swagger
4. ✅ View MongoDB data: http://localhost:8081

## 🐛 Troubleshooting

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f mongodb
docker-compose logs -f mssql

# Reset everything
docker-compose down -v
docker-compose up -d
```

## Questions?

Refer to [DOCKER_SETUP.md](./DOCKER_SETUP.md) for detailed troubleshooting and configuration options.
