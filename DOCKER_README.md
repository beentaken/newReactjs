# Docker & Database Setup - COMPLETE ✅

## What's Included

Your project now has complete Docker configuration to instantly spin up **MongoDB** and **MSSQL** databases!

### 🎯 Quick Start (1 minute)

```powershell
# Start all services
./docker-helper.ps1 -Command start

# View logs
./docker-helper.ps1 -Command logs

# Stop services
./docker-helper.ps1 -Command stop
```

### 📊 Services Status

| Service | Port | Status | Access |
|---------|------|--------|--------|
| MongoDB | 27017 | ✅ Running | `mongodb://admin:password@localhost:27017/` |
| Mongo Express | 8081 | ✅ Running | http://localhost:8081 (admin/admin) |
| MSSQL Server | 1433 | ✅ Running | `localhost,1433` (sa/YourStrong!Passw0rd) |

## 📁 New Files Created

### Configuration Files
- **`docker-compose.yml`** - Main Docker Compose configuration
- **`.env.example`** - Environment variables template

### Documentation
- **`DOCKER_QUICK_START.md`** - ⚡ 2-minute quick start guide
- **`DOCKER_SETUP.md`** - 📖 Comprehensive setup & troubleshooting
- **`DOCKER_ARCHITECTURE.md`** - 🏗️ Visual diagrams & architecture
- **`DOCKER_SETUP_COMPLETE.md`** - ✅ Setup completion summary

### Helper Scripts
- **`docker-helper.ps1`** - PowerShell helper (Windows)
- **`docker-helper.bat`** - Batch helper (Windows)

## 🚀 Getting Started

### Option 1: PowerShell (Recommended)
```powershell
./docker-helper.ps1 -Command start
```

### Option 2: Direct Docker
```bash
docker-compose up -d
```

### Option 3: Batch (Windows)
```cmd
docker-helper.bat start
```

## 🔗 Connection Details

### MongoDB
```
Connection String: mongodb://admin:password@localhost:27017/?authSource=admin
Database: ReactJsDb
Username: admin
Password: password
Web UI: http://localhost:8081 (admin/admin)
```

Already configured in: `Program.cs`

### MSSQL Server  
```
Server: localhost,1433
User ID: sa
Password: YourStrong!Passw0rd
Connection String: Server=localhost,1433;User Id=sa;Password=YourStrong!Passw0rd;TrustServerCertificate=true;
```

Configure in: `appsettings.json`

## 📋 All Docker Helper Commands

```powershell
./docker-helper.ps1 -Command start        # Start services
./docker-helper.ps1 -Command stop         # Stop services (keeps data)
./docker-helper.ps1 -Command restart      # Restart all
./docker-helper.ps1 -Command logs         # View live logs
./docker-helper.ps1 -Command status       # Show running containers
./docker-helper.ps1 -Command clean        # Delete everything
./docker-helper.ps1 -Command rebuild      # Fresh start
./docker-helper.ps1 -Command help         # Show help
```

## 📚 Documentation Guide

Choose based on your needs:

- **🟢 Just want to run?**  
  → Read: `DOCKER_QUICK_START.md` (2 minutes)

- **🟡 Need detailed setup?**  
  → Read: `DOCKER_SETUP.md` (15 minutes)

- **🔵 Want to understand the architecture?**  
  → Read: `DOCKER_ARCHITECTURE.md` + diagrams

- **🟠 Something not working?**  
  → Check: `DOCKER_SETUP.md` → Troubleshooting

## ✨ Features

✅ **Instant Setup** - One command to start both databases  
✅ **MongoDB** - NoSQL database for Location tracking  
✅ **MSSQL** - SQL Server for Entity Framework  
✅ **Mongo Express** - Visual MongoDB browser  
✅ **Health Checks** - Automatic service health monitoring  
✅ **Persistent Data** - Data survives container restarts  
✅ **Auto Initialization** - Sample data loaded on startup  
✅ **Network Isolation** - Services communicate safely  
✅ **Helper Scripts** - Easy management commands  
✅ **Full Documentation** - Comprehensive guides included  

## ⚠️ Important Notes

- **Development Only** - These containers are for local development
- **Default Passwords** - Change before pushing to production!
- **First Startup** - MSSQL takes 30+ seconds to initialize
- **Data Persistence** - Volumes store data between restarts
- **Requires Docker Desktop** - Must be installed and running

## 🐛 Troubleshooting Quick Links

| Issue | Solution |
|-------|----------|
| Port already in use | Edit `docker-compose.yml` change ports |
| Services won't start | Check Docker Desktop is running |
| MSSQL connection fails | Wait 30+ seconds and check logs |
| Can't access Mongo Express | Verify port 8081 is available |
| Data not persisting | Check Docker volumes aren't deleted |

For detailed troubleshooting: See `DOCKER_SETUP.md`

## 🎯 Next Steps

1. **Start Docker:**
   ```powershell
   ./docker-helper.ps1 -Command start
   ```

2. **Verify Services:**
   ```bash
   docker ps  # You should see 3 containers
   ```

3. **Test Connection:**
   - MongoDB: http://localhost:8081 → admin/admin
   - MSSQL: Use SQL Server Management Studio or Azure Data Studio

4. **Run Application:**
   ```bash
   dotnet run
   ```

5. **View API:**
   - Swagger: http://localhost:7048/swagger

## 📞 Quick Reference

```bash
# Start
./docker-helper.ps1 -Command start

# Stop
./docker-helper.ps1 -Command stop

# View Logs
./docker-helper.ps1 -Command logs

# Restart
./docker-helper.ps1 -Command restart

# Reset (delete everything)
./docker-helper.ps1 -Command clean
```

---

**You're all set! 🎉**

Start with: `./docker-helper.ps1 -Command start`

Questions? Read any of the `DOCKER_*.md` files for complete documentation.
