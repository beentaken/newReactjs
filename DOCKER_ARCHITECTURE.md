# Docker Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Your Development Machine                         │
│                                                                           │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────┐  │
│  │   .NET 8 Web API        │  │    Docker Network (app-network)      │  │
│  │   (dotnet run)          │  │                                      │  │
│  │   - localhost:7048      │  │  ┌─────────────────────────────────┐ │  │
│  │                         │  │  │                                 │ │  │
│  │ ✅ AppDbContext         │  │  │  🍃 MongoDB Container           │ │  │
│  │ ✅ IMongoClient         │  │  │  - Port: 27017                  │ │  │
│  │ ✅ Controllers          │◄─┼──┼─ Database: ReactJsDb            │ │  │
│  │                         │  │  │ - Username: admin              │ │  │
│  └─────────────────────────┘  │  │ - Password: password            │ │  │
│                               │  │ - Collections: Locations        │ │  │
│  ┌─────────────────────────┐  │  │ - Volume: mongodb_data         │ │  │
│  │  Swagger UI             │  │  └─────────────────────────────────┘ │  │
│  │  - localhost:7048/swagger  │  │                                 │ │  │
│  └─────────────────────────┘  │  ├─────────────────────────────────┤ │  │
│                               │  │                                 │ │  │
│  ┌─────────────────────────┐  │  │  🐘 Mongo Express (MongoDB UI)  │ │  │
│  │  Mongo Express (Web UI) │  │  │  - Port: 8081                   │ │  │
│  │  - localhost:8081       │◄─┼──┼─ http://localhost:8081          │ │  │
│  │  - admin/admin          │  │  │ - Username: admin              │ │  │
│  └─────────────────────────┘  │  │ - Password: admin              │ │  │
│                               │  │                                 │ │  │
│  ┌─────────────────────────┐  │  ├─────────────────────────────────┤ │  │
│  │  SQL Server Management  │  │  │                                 │ │  │
│  │  Studio                 │  │  │  🔷 MSSQL Server Container      │ │  │
│  │  - localhost:1433       │◄─┼──┼─ Port: 1433                     │ │  │
│  │  - sa/YourStrong!...    │  │  │ - SA Password: YourStrong!...   │ │  │
│  └─────────────────────────┘  │  │ - Edition: Developer (Free)     │ │  │
│                               │  │ - Volume: mssql_data           │ │  │
│                               │  │                                 │ │  │
│                               │  └─────────────────────────────────┘ │  │
│                               │                                      │  │
│                               └──────────────────────────────────────┘  │
│                                                                           │
└─────────────────────────────────────────────────────────────────────────┘
		 ▲                                                     ▲
		 │                                                     │
	docker-compose up -d                             docker-compose logs -f
```

## Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│ Your Application (Program.cs)                                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ LocationMongoController                                 │   │
│  │ - GET /api/locationmongo                               │   │
│  │ - POST /api/locationmongo                              │   │
│  │ - PUT /api/locationmongo/{id}                          │   │
│  │ - DELETE /api/locationmongo/{id}                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                       │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ IMongoClient (Singleton)                                │   │
│  │ - connection://admin:password@localhost:27017           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                       │
│                          ▼                                       │
│                     MongoDB Container                           │
│                    (ReactJsDb database)                         │
│                   (Locations collection)                        │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ Menu/Staff/WeatherForecast Controllers                  │   │
│  │ (Entity Framework based)                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                       │
│                          ▼                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ AppDbContext                                            │   │
│  │ - connection: Server=localhost,1433;...                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                          │                                       │
│                          ▼                                       │
│                    MSSQL Container                              │
│                  (Multiple Databases)                           │
│                   (DbSet collections)                           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Port Mapping Reference

```
┌─────────────────────────────────────────────────────────────────┐
│                      Port Mapping                               │
├───────────────┬──────────────────┬──────────────────────────────┤
│ Service       │ Port             │ Connection String            │
├───────────────┼──────────────────┼──────────────────────────────┤
│ Web API       │ 7048             │ http://localhost:7048        │
│               │                  │ http://localhost:7048/swagger│
├───────────────┼──────────────────┼──────────────────────────────┤
│ MongoDB       │ 27017            │ mongodb://admin:password@    │
│               │                  │ localhost:27017/?authSource= │
│               │                  │ admin                        │
├───────────────┼──────────────────┼──────────────────────────────┤
│ Mongo Express │ 8081             │ http://localhost:8081        │
│ (Web UI)      │                  │ Username: admin              │
│               │                  │ Password: admin              │
├───────────────┼──────────────────┼──────────────────────────────┤
│ MSSQL         │ 1433             │ Server=localhost,1433;       │
│ Server        │                  │ User Id=sa;                  │
│               │                  │ Password=YourStrong!Passw0rd │
└───────────────┴──────────────────┴──────────────────────────────┘
```

## Docker Network Topology

```
┌─────────────────────────────────────────────────────────────────┐
│ Docker Bridge Network: app-network                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐  ┌──────────────┐ │
│  │                 │    │                 │  │              │ │
│  │ mongodb         │◄──►│ mongo-express   │  │ mssql        │ │
│  │ (27017)         │    │ (8081)          │  │ (1433)       │ │
│  │                 │    │                 │  │              │ │
│  └─────────────────┘    └─────────────────┘  └──────────────┘ │
│         ▲                        ▲                    ▲         │
│         └────────────────────────┼────────────────────┘         │
│                                  │                              │
│                          Host Access Routes                     │
│                          (localhost:port)                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Volume Persistence

```
Docker Volumes (Data Persistence)
│
├─ mongodb_data
│  ├─ /data/db
│  │  ├─ ReactJsDb/
│  │  │  └─ Locations collection
│  │  └─ journal files
│  └─ Persists: MongoDB documents, indexes
│
└─ mssql_data
   ├─ /var/opt/mssql
   │  ├─ MSSQL_DATA
   │  ├─ MSSQL_LOG
   │  └─ MSSQL_BACKUP
   └─ Persists: Database files, transaction logs

Note: Volume data persists between container restarts
	  unless explicitly deleted with 'docker-compose down -v'
```

## Container Dependencies

```
docker-compose up -d

	↓ (Sequential startup)

1. mongodb ──────────────────► Running on 27017
   - Initializes ReactJsDb
   - Loads mongodbinit.js
   - Loads sample data

2. mongo-express ─────────────► Running on 8081
   (depends_on: mongodb)
   - Ready when mongodb is ready

3. mssql ──────────────────────► Running on 1433
   - Initializes system databases
   - Ready for connections

All three services operational
```

## Environment Variable Mapping

```
.env (or docker-compose.yml default values)
│
├─ MONGO_INITDB_ROOT_USERNAME → MongoDB admin user
├─ MONGO_INITDB_ROOT_PASSWORD → MongoDB admin password
├─ MONGO_INITDB_DATABASE → Initial database name
├─ MSSQL_SA_PASSWORD → SQL Server SA password
└─ MSSQL_PID → SQL Server Edition

These are used to initialize containers on first run
```

---

**Key Points:**
- 🔒 Services communicate via Docker network (isolated)
- 🔌 Exposed ports allow host machine access
- 💾 Data persists in Docker volumes
- 🚀 All services start automatically with `docker-compose up -d`
- ⏹️ All services stop together with `docker-compose down`
