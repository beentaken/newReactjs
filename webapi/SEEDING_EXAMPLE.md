# Seeding Example: SQL Server + MongoDB

This document explains how the example seeding data works for your polyglot persistence setup.

## Overview

### SQL Server (via Entity Framework Core)
Stores structured, relational data:
- **Menu** — Navigation menus by role (Admin, User, Manager)
- **Staff** — Employee records with personal info
- **WeatherForecast** — Daily weather predictions
- **Minimap** — Floor plan/location markers

### MongoDB
Stores flexible, time-series location tracking data:
- **Locations** — Country/city/continent data with geospatial coordinates
- Optimized for fast writes and flexible schema

---

## Database Seeding Flow

### 1. **Startup Seeding** (`Program.cs`)
When the application starts:
```csharp
using (var scope = app.Services.CreateScope())
{
	var sqlSeeder = scope.ServiceProvider.GetRequiredService<DatabaseSeederService>();
	await sqlSeeder.SeedAsync();

	var mongoSeeder = scope.ServiceProvider.GetRequiredService<MongoDbSeederService>();
	await mongoSeeder.SeedAsync();
}
```

**What happens:**
- If SQL Server tables are empty → inserts sample Menus, Staff, WeatherForecasts, Minimaps
- If MongoDB collection is empty → inserts sample location tracking data
- Logs indicate success or skips if data already exists

### 2. **SQL Server Seeded Data**

#### Menus (3 records)
```json
{
  "id": 1,
  "title": ["Dashboard", "Overview", "Analytics"],
  "role": "Admin"
}
```

#### Staff (3 records)
```json
{
  "id": 1,
  "staffName": "John Doe",
  "email": "john.doe@company.com",
  "mobileNumber": "+1234567890",
  "employeeID": "EMP001",
  "designation": "Senior Manager",
  "startDate": "2022-01-01",
  "staffStatus": 1,
  "...": "..."
}
```

#### WeatherForecasts (4 records)
```json
{
  "id": 1,
  "date": "2024-12-19",
  "temperatureC": 25,
  "summary": "Sunny"
}
```

#### Minimaps (4 records)
```json
{
  "id": 1,
  "x": 50,
  "y": 75,
  "status": 1,
  "summary": "Entrance"
}
```

### 3. **MongoDB Seeded Data**

#### Locations (5 records)
```json
{
  "_id": ObjectId(...),
  "country": "United States",
  "continent": "North America",
  "city": "New York",
  "coordinates": {
	"latitude": 40.7128,
	"longitude": -74.0060
  },
  "population": 8335897,
  "timestamp": "2024-12-19T10:00:00Z",
  "summary": "Major city in USA",
  "accuracy": "High"
}
```

Other seeded locations:
- London (UK, Europe)
- Paris (France, Europe)
- Tokyo (Japan, Asia)
- Sydney (Australia, Oceania)

---

## API Endpoints to Test Seeded Data

### SQL Server Endpoints

**1. Get all Menus**
```
GET /api/menu
```
Response: 3 menu objects

**2. Get Menu by Role**
```
GET /api/menu/by-role/Admin
```
Response: Menu for Admin role

**3. Create new Menu**
```
POST /api/menu
Content-Type: application/json

{
  "title": ["Users", "Reports"],
  "role": "Viewer"
}
```

---

### MongoDB Endpoints

**1. Get all Locations**
```
GET /api/locationmongo
```
Response: 5 location documents

**2. Get Locations by Country**
```
GET /api/locationmongo/by-country/Japan
```
Response: Locations in Japan

**3. Get Locations by Continent**
```
GET /api/locationmongo/by-continent/Europe
```
Response: UK and France locations

**4. Add new Location (track a location)**
```
POST /api/locationmongo
Content-Type: application/json

{
  "country": "Canada",
  "continent": "North America",
  "city": "Toronto",
  "coordinates": {
	"latitude": 43.6532,
	"longitude": -79.3832
  },
  "population": 2930000,
  "summary": "Largest city in Canada",
  "accuracy": "High"
}
```

**5. Get Location Statistics**
```
GET /api/locationmongo/stats/by-continent
```
Response:
```json
[
  {"_id": "North America", "count": 1, "totalPopulation": 8335897},
  {"_id": "Europe", "count": 2, "totalPopulation": 17338488},
  {"_id": "Asia", "count": 1, "totalPopulation": 37400068},
  {"_id": "Oceania", "count": 1, "totalPopulation": 5312163}
]
```

---

## Prerequisites Before Running

### SQL Server
```powershell
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=MyStrongPassword123!" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:latest
```

### MongoDB
```powershell
docker run -e "MONGO_INITDB_ROOT_USERNAME=admin" -e "MONGO_INITDB_ROOT_PASSWORD=password" -p 27017:27017 --name mongodb -d mongo
```

### Verify Connections
- SQL Server: `localhost:1433` (user: sa, password: MyStrongPassword123!)
- MongoDB: `localhost:27017` (user: admin, password: password)

---

## Running the Application

1. **Ensure both databases are running** (see Prerequisites)
2. **Restore NuGet packages**
   ```powershell
   dotnet restore
   ```
3. **Apply EF Core migrations** (SQL Server)
   ```powershell
   dotnet ef database update
   ```
4. **Start the application**
   ```powershell
   dotnet run
   ```
5. **Check logs** — You should see:
   ```
   Database migrated successfully.
   Seeded X menus.
   Seeded X weather forecasts.
   Seeded X minimap locations.
   Seeded X staff members.
   Seeded X locations into MongoDB.
   ```

---

## Benefits of This Setup

| Aspect | SQL Server | MongoDB |
|--------|-----------|---------|
| **Best For** | Relational, structured data | Time-series, flexible schema |
| **Examples** | Menu, Staff, Forecast | Location tracking, sensor data |
| **Scalability** | Vertical | Horizontal (sharding) |
| **Transactions** | ACID | Eventually consistent |
| **Schema** | Fixed | Flexible |

---

## Next Steps

1. **Customize seeded data** — Edit `DatabaseSeederService.cs` and `MongoDbSeederService.cs`
2. **Add more entities** — Follow the same pattern for new data types
3. **Add validation** — Implement DbContext/MongoDB validation rules
4. **Add repositories** — Wrap database access in repository pattern
5. **Add caching** — Cache frequently accessed data (Redis)

---

## Troubleshooting

### Seeds not running?
- Check that both databases are accessible (Docker containers running)
- Check logs in Visual Studio Output window
- Ensure connection strings match database credentials

### "Database already has data"?
- Seeds only run if tables/collections are empty
- To reseed, clear the database manually or delete containers and recreate them

### MongoDB connection timeout?
- Verify MongoDB container is running: `docker ps`
- Check MongoDB connection string in `Program.cs`
- Default: `mongodb://admin:password@localhost:27017/?authSource=admin`
