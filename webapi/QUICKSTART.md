# Quick Start Guide - Seeding & Testing

Run these commands in order to get sample data into your databases.

## 1️⃣ Start Databases (Docker)

```powershell
# SQL Server (if not already running)
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=MyStrongPassword123!" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:latest

# MongoDB (if not already running)
docker run -e "MONGO_INITDB_ROOT_USERNAME=admin" -e "MONGO_INITDB_ROOT_PASSWORD=password" -p 27017:27017 --name mongodb -d mongo
```

**Verify containers are running:**
```powershell
docker ps
```

---

## 2️⃣ Apply Database Migrations

From the webapi folder:
```powershell
cd C:\Users\hanwu\source\repos\newReactjs\webapi

dotnet ef database update
```

You should see:
```
Applying migration '20240101000000_InitialCreate'
Done.
```

---

## 3️⃣ Run the Application

```powershell
dotnet run
```

**Expected output in console:**
```
info: webapi.Services.DatabaseSeederService[0]
	  Database migrated successfully.
info: webapi.Services.DatabaseSeederService[0]
	  Seeded 3 menus.
info: webapi.Services.DatabaseSeederService[0]
	  Seeded 4 weather forecasts.
info: webapi.Services.DatabaseSeederService[0]
	  Seeded 4 minimap locations.
info: webapi.Services.DatabaseSeederService[0]
	  Seeded 3 staff members.
info: webapi.Services.MongoDbSeederService[0]
	  Seeded 5 locations into MongoDB.
```

App runs on: `http://localhost:7048`

---

## 4️⃣ Test Endpoints with Swagger

1. Open browser: `http://localhost:7048/swagger`
2. Expand the endpoints and click "Try it out"
3. Execute requests

Or use curl:

### SQL Server Endpoints

**Get all menus:**
```bash
curl http://localhost:7048/api/menu
```

**Get menu by role:**
```bash
curl http://localhost:7048/api/menu/1
```

**Create new menu:**
```bash
curl -X POST http://localhost:7048/api/menu \
  -H "Content-Type: application/json" \
  -d '{"title": ["Custom1", "Custom2"], "role": "Guest"}'
```

### MongoDB Endpoints

**Get all locations:**
```bash
curl http://localhost:7048/api/locationmongo
```

**Get locations by country:**
```bash
curl "http://localhost:7048/api/locationmongo/by-country/Japan"
```

**Get locations by continent:**
```bash
curl "http://localhost:7048/api/locationmongo/by-continent/Europe"
```

**Get statistics:**
```bash
curl http://localhost:7048/api/locationmongo/stats/by-continent
```

**Add new location:**
```bash
curl -X POST http://localhost:7048/api/locationmongo \
  -H "Content-Type: application/json" \
  -d '{
	"country": "Canada",
	"continent": "North America",
	"city": "Toronto",
	"coordinates": {"latitude": 43.6532, "longitude": -79.3832},
	"population": 2930000,
	"summary": "Largest city in Canada",
	"accuracy": "High"
  }'
```

---

## 5️⃣ Verify Data in Databases

### SQL Server (via Visual Studio)
1. View → SQL Server Object Explorer
2. Navigate to: `(local)\MSSQL15.MSSQLSERVER → Databases → ReactJsDb`
3. Expand Tables to see: dbo.Menus, dbo.Staffs, dbo.WeatherForecasts, dbo.Minimaps

### MongoDB (via MongoDB Compass or CLI)
```powershell
# Connect with mongo CLI
docker exec -it mongodb mongosh -u admin -p password --authenticationDatabase admin

# Inside mongo shell
use ReactJsDb
db.Locations.find().pretty()
```

Or use MongoDB Compass GUI:
- Connect to: `mongodb://admin:password@localhost:27017`
- Database: ReactJsDb
- Collection: Locations

---

## 🧹 Reset / Reseed

To clear everything and start fresh:

```powershell
# Stop and remove containers
docker stop sqlserver mongodb
docker rm sqlserver mongodb

# Or via Visual Studio:
# - Tools > SQL Server > Delete Database
# - Drop from MongoDB Compass

# Then re-run steps 1-3 above
```

---

## 📋 Seeded Data Summary

### SQL Server (5 tables)
| Table | Records | Details |
|-------|---------|---------|
| Menus | 3 | Admin, User, Manager roles |
| Staff | 3 | John Doe, Jane Smith, Robert Johnson |
| WeatherForecasts | 4 | 4 daily forecasts |
| Minimaps | 4 | Floor plan locations |
| Locations | - | Tracked in MongoDB (see below) |

### MongoDB (1 collection)
| Collection | Records | Details |
|-----------|---------|---------|
| Locations | 5 | NYC, London, Paris, Tokyo, Sydney |

---

## ✅ Success Checklist

- [ ] Both Docker containers running
- [ ] Migrations applied (`dotnet ef database update`)
- [ ] App started with seeding logs visible
- [ ] Swagger UI accessible at `http://localhost:7048/swagger`
- [ ] GET /api/menu returns 3 menus
- [ ] GET /api/locationmongo returns 5 locations
- [ ] POST endpoints accept new data
- [ ] Data visible in SQL Server Object Explorer + MongoDB Compass

---

## Common Issues

**Q: "Connection refused" when starting app?**  
A: Check Docker containers are running: `docker ps`

**Q: "Database doesn't exist"?**  
A: Run `dotnet ef database update` from webapi folder

**Q: "Already has data" message?**  
A: Seeds only run once; data exists. Use reset commands above to clear.

**Q: Can't connect to MongoDB?**  
A: Check MongoDB container is running: `docker exec mongodb mongosh --version`

---

For detailed documentation, see:
- `SEEDING_COMPLETE.md` — Full setup details
- `SEEDING_EXAMPLE.md` — Complete API reference
- `EF_SETUP_GUIDE.md` — Entity Framework info
