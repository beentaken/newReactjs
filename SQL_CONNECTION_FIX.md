# SQL Server Connection Error - Fix Guide

## ❌ Error You're Getting
```
Microsoft.Data.SqlClient.SqlException: 'A network-related or instance-specific 
error occurred while establishing a connection to SQL Server. The server was not 
found or was not accessible. Verify that the instance name is correct and that 
SQL Server is configured to allow remote connections. (provider: TCP Provider, 
error: 0 - No connection could be made because the target machine actively 
refused it.)'
```

## ✅ Solution

### Problem 1: Docker MSSQL Not Running
**Fix:** Start Docker containers
```powershell
./docker-helper.ps1 -Command start
```

⏳ **Important:** Wait 30-45 seconds for MSSQL to initialize (first startup is slow)

### Problem 2: Wrong Connection String Password
**Was:** `MyStrongPassword123!`  
**Should be:** `YourStrong!Passw0rd`

**Status:** ✅ Already fixed in `appsettings.json`

### Problem 3: DatabaseSeederService Error Handling
**Status:** ✅ Added error handling in `Program.cs` to show helpful error messages

---

## 🔍 Verify It's Fixed

### Step 1: Check Docker is Running
```powershell
docker ps
```

You should see:
```
CONTAINER ID   IMAGE                                 NAMES
xxxxx          mongo:latest                         mongodb
xxxxx          mongo-express:latest                 mongo-express
xxxxx          mcr.microsoft.com/mssql/server:...   mssql
```

### Step 2: Check Logs
```powershell
# View MSSQL logs
docker-compose logs mssql

# Wait to see "Server is ready to accept connections"
```

### Step 3: Test Connection
```powershell
# Using sqlcmd in the container
docker exec -it mssql /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -Q "SELECT 1"

# If you see "1" returned, connection works!
```

### Step 4: Run Your App
```powershell
# In Visual Studio - press F5 or run without debugging
dotnet run
```

---

## 🚨 Still Getting the Error?

### MSSQL Still Starting?
```powershell
# Wait longer (30-60 seconds on first run)
docker-compose logs -f mssql
# Look for: "Server is ready to accept connections"
```

### Wrong Password?
```powershell
# Verify in appsettings.json:
password=YourStrong!Passw0rd
```

### Connection String Format Wrong?
**Correct format:**
```
Server=localhost,1433;User Id=sa;Password=YourStrong!Passw0rd;Database=ReactJsDb;TrustServerCertificate=true;
```

### Port Already in Use?
```powershell
# Stop Docker
docker-compose down

# Edit docker-compose.yml - change port 1433 to 1434:
# ports:
#   - "1434:1433"

# Restart
docker-compose up -d

# Update connection string to use 1434
```

---

## 📋 Complete Checklist

- [ ] Docker Desktop is running
- [ ] Ran `./docker-helper.ps1 -Command start`
- [ ] Waited 30+ seconds for MSSQL to start
- [ ] Verified `appsettings.json` has `YourStrong!Passw0rd`
- [ ] Can see "Server is ready" in `docker-compose logs mssql`
- [ ] `docker ps` shows mssql container running
- [ ] Test with: `docker exec -it mssql sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -Q "SELECT 1"`

---

## 🆘 Still Not Working?

### Check These Files
1. **appsettings.json** - Verify connection string password is `YourStrong!Passw0rd`
2. **Program.cs** - Should have error handling code (already added)
3. **docker-compose.yml** - Should have `MSSQL_SA_PASSWORD: "YourStrong!Passw0rd"`

### Get Help
```powershell
# View all Docker logs
docker-compose logs

# View just MSSQL logs
docker-compose logs mssql

# Restart everything fresh
docker-compose down -v
docker-compose up -d
# Wait 60 seconds...
```

---

## 💡 Quick Reference

| Command | Purpose |
|---------|---------|
| `./docker-helper.ps1 -Command start` | Start all services |
| `docker ps` | Show running containers |
| `docker-compose logs mssql` | View MSSQL logs |
| `docker-compose down` | Stop all services |
| `dotnet run` | Run your app |

---

## ✨ After Fixing

Once you see "Server is ready to accept connections" in the logs:

1. Run your app: `dotnet run` (or F5 in VS)
2. The seeding should work automatically
3. Check logs for any remaining errors
4. Access API: http://localhost:7048/swagger

**You're ready to go!** 🎉
