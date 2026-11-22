using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Model;

namespace webapi.Services
{
    /// <summary>
    /// Seeds initial data into SQL Server for Menu, Staff, WeatherForecast, Minimap, etc.
    /// </summary>
    public class DatabaseSeederService
    {
        private readonly AppDbContext _dbContext;
        private readonly ILogger<DatabaseSeederService> _logger;

        public DatabaseSeederService(AppDbContext dbContext, ILogger<DatabaseSeederService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            try
            {
                // Ensure database is created
                await _dbContext.Database.MigrateAsync();
                _logger.LogInformation("Database migrated successfully.");

                // Seed Menus
                if (!await _dbContext.Menus.AnyAsync())
                {
                    var menus = new List<Menu>
                    {
                        new Menu
                        {
                            Title = new[] { "Dashboard", "Overview", "Analytics" },
                            Role = "Admin"
                        },
                        new Menu
                        {
                            Title = new[] { "My Profile", "Settings", "Help" },
                            Role = "User"
                        },
                        new Menu
                        {
                            Title = new[] { "Locations", "Staff", "Reports" },
                            Role = "Manager"
                        }
                    };
                    await _dbContext.Menus.AddRangeAsync(menus);
                    await _dbContext.SaveChangesAsync();
                    _logger.LogInformation($"Seeded {menus.Count} menus.");
                }

                // Seed WeatherForecasts
                if (!await _dbContext.WeatherForecasts.AnyAsync())
                {
                    var forecasts = new List<WeatherForecast>
                    {
                        new WeatherForecast
                        {
                            Date = DateOnly.FromDateTime(DateTime.Now),
                            TemperatureC = 25,
                            Summary = "Sunny"
                        },
                        new WeatherForecast
                        {
                            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(1)),
                            TemperatureC = 22,
                            Summary = "Cloudy"
                        },
                        new WeatherForecast
                        {
                            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(2)),
                            TemperatureC = 18,
                            Summary = "Rainy"
                        },
                        new WeatherForecast
                        {
                            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(3)),
                            TemperatureC = 28,
                            Summary = "Very Sunny"
                        }
                    };
                    await _dbContext.WeatherForecasts.AddRangeAsync(forecasts);
                    await _dbContext.SaveChangesAsync();
                    _logger.LogInformation($"Seeded {forecasts.Count} weather forecasts.");
                }

                // Seed Minimaps
                if (!await _dbContext.Minimaps.AnyAsync())
                {
                    var minimaps = new List<Minimap>
                    {
                        new Minimap { X = 50, Y = 75, Status = 1, Summary = "Entrance" },
                        new Minimap { X = 100, Y = 150, Status = 2, Summary = "Main Hall" },
                        new Minimap { X = 200, Y = 120, Status = 1, Summary = "Reception" },
                        new Minimap { X = 250, Y = 200, Status = 3, Summary = "Emergency Exit" }
                    };
                    await _dbContext.Minimaps.AddRangeAsync(minimaps);
                    await _dbContext.SaveChangesAsync();
                    _logger.LogInformation($"Seeded {minimaps.Count} minimap locations.");
                }

                // Seed Staff
                if (!await _dbContext.Staffs.AnyAsync())
                {
                    var staffList = new List<Staff>
                    {
                        new Staff
                        {
                            StaffName = "John Doe",
                            Email = "john.doe@company.com",
                            MobileNumber = "+1234567890",
                            IdNumber = "ID123456",
                            IdType = 1,
                            EmployeeID = "EMP001",
                            StaffTypeId = 1,
                            StaffStatus = 1,
                            ResidencyType = 1,
                            HomeOffice = 1,
                            Sex = 1,
                            StartDate = DateTime.Now.AddYears(-2),
                            Photo = System.Array.Empty<byte>(),
                            MimeType = "image/jpeg",
                            CreatedOn = DateTime.Now,
                            CreatedBy = Guid.NewGuid(),
                            Designation = "Senior Manager",
                            Address = "123 Main Street, New York, NY 10001"
                        },
                        new Staff
                        {
                            StaffName = "Jane Smith",
                            Email = "jane.smith@company.com",
                            MobileNumber = "+0987654321",
                            IdNumber = "ID654321",
                            IdType = 1,
                            EmployeeID = "EMP002",
                            StaffTypeId = 2,
                            StaffStatus = 1,
                            ResidencyType = 1,
                            HomeOffice = 2,
                            Sex = 2,
                            StartDate = DateTime.Now.AddYears(-1),
                            Photo = System.Array.Empty<byte>(),
                            MimeType = "image/jpeg",
                            CreatedOn = DateTime.Now,
                            CreatedBy = Guid.NewGuid(),
                            Designation = "Staff Officer",
                            Address = "456 Oak Avenue, Los Angeles, CA 90001"
                        },
                        new Staff
                        {
                            StaffName = "Robert Johnson",
                            Email = "robert.johnson@company.com",
                            MobileNumber = "+1122334455",
                            IdNumber = "ID789012",
                            IdType = 2,
                            EmployeeID = "EMP003",
                            StaffTypeId = 1,
                            StaffStatus = 1,
                            ResidencyType = 2,
                            HomeOffice = 3,
                            Sex = 1,
                            StartDate = DateTime.Now.AddMonths(-6),
                            Photo = System.Array.Empty<byte>(),
                            MimeType = "image/jpeg",
                            CreatedOn = DateTime.Now,
                            CreatedBy = Guid.NewGuid(),
                            Designation = "Administrator",
                            Address = "789 Pine Road, Chicago, IL 60601"
                        }
                    };
                    await _dbContext.Staffs.AddRangeAsync(staffList);
                    await _dbContext.SaveChangesAsync();
                    _logger.LogInformation($"Seeded {staffList.Count} staff members.");
                }

                _logger.LogInformation("Database seeding completed successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error seeding database: {ex.Message}");
                throw;
            }
        }
    }
}
