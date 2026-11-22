# Entity Framework Core + SQL Server Setup Guide

## Prerequisites
- SQL Server running in Docker (as you mentioned)
- .NET 8 SDK installed

## Connection String
The default connection string in `appsettings.json`:
```
Server=localhost,1433;Database=ReactJsDb;User Id=sa;Password=MyStrongPassword123!;TrustServerCertificate=true;
```

**Important**: Change the password `MyStrongPassword123!` to match your Docker SQL Server password.

## Docker SQL Server Setup

If you haven't set up SQL Server in Docker yet, run:
```powershell
docker run -e "ACCEPT_EULA=Y" -e "MSSQL_SA_PASSWORD=MyStrongPassword123!" -p 1433:1433 --name sqlserver -d mcr.microsoft.com/mssql/server:latest
```

Replace `MyStrongPassword123!` with your desired password, and update the connection string in `appsettings.json` to match.

## Apply Migrations

1. Open Package Manager Console (Tools > NuGet Package Manager > Package Manager Console)
2. Set default project to `webapi`
3. Run:
```powershell
Update-Database
```

Or via CLI (from webapi folder):
```powershell
dotnet ef database update
```

## What Was Added

### 1. NuGet Packages (webapi.csproj)
- `Microsoft.EntityFrameworkCore` (8.0.0)
- `Microsoft.EntityFrameworkCore.SqlServer` (8.0.0)
- `Microsoft.EntityFrameworkCore.Tools` (8.0.0)

### 2. DbContext (webapi/Data/AppDbContext.cs)
- Manages database connections
- Maps models to database tables
- Contains DbSet properties for: Menu, Location, Minimap, Staff, WeatherForecast

### 3. Models Updated
Added `Id` primary key to:
- Menu
- Location
- WeatherForecast

### 4. Program.cs
Registered AppDbContext with SQL Server:
```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
	options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
```

### 5. Migrations
Created initial migration that defines tables for all entities.

## Using the Entities in Controllers

Example in a controller:
```csharp
using webapi.Data;
using webapi.Model;

[ApiController]
[Route("api/[controller]")]
public class MenuController : ControllerBase
{
	private readonly AppDbContext _dbContext;

	public MenuController(AppDbContext dbContext)
	{
		_dbContext = dbContext;
	}

	[HttpGet]
	public async Task<ActionResult<List<Menu>>> GetMenus()
	{
		var menus = await _dbContext.Menus.ToListAsync();
		return Ok(menus);
	}

	[HttpPost]
	public async Task<ActionResult<Menu>> CreateMenu([FromBody] Menu menu)
	{
		_dbContext.Menus.Add(menu);
		await _dbContext.SaveChangesAsync();
		return CreatedAtAction(nameof(GetMenus), new { id = menu.Id }, menu);
	}
}
```

## Next Steps

1. Update controllers to use `_dbContext` instead of in-memory/static data
2. Run `Update-Database` to create tables in SQL Server
3. Test API endpoints against the database
4. For more migrations: `Add-Migration MigrationName` (or `dotnet ef migrations add MigrationName`)

## Troubleshooting

- **Connection refused**: Verify SQL Server is running in Docker (`docker ps`)
- **Password mismatch**: Update both Docker run command and `appsettings.json`
- **Database doesn't exist**: Run `Update-Database` from Package Manager Console
- **Missing packages**: Run `dotnet restore` in the webapi folder
