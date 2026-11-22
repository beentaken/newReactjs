using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerUI;
using System.Runtime.ConstrainedExecution;
using Microsoft.EntityFrameworkCore;
using webapi.Data;
using webapi.Services;
using MongoDB.Driver;

var builder = WebApplication.CreateBuilder(args);
var configPath = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
builder.Configuration.AddJsonFile(configPath, optional: false, reloadOnChange: true);
// Add services to the container.

// Add DbContext with SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register MongoDB Client
builder.Services.AddSingleton<IMongoClient>(sp =>
    new MongoClient("mongodb://admin:password@localhost:27017/?authSource=admin"));

// Register seeding services
builder.Services.AddScoped<DatabaseSeederService>();
builder.Services.AddScoped<MongoDbSeederService>();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.OperationFilter<AddCustomHeaderOperationFilter>();
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    // Require JWT bearer authentication for all API endpoints
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer"
                    }
                },
                new string[] { }
            }
        });


});

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("https://localhost:3000", "http://localhost:3000") // Allow React App
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
//////


var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment()) // if only for dev
//{
app.UseDeveloperExceptionPage();
app.UseSwagger();
app.UseSwaggerUI(c => {
    c.DefaultModelRendering(ModelRendering.Example);
    c.DefaultModelsExpandDepth(-1);
    c.DisplayRequestDuration();
    c.EnableDeepLinking();
    c.EnableFilter();
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
});
//}
//else
//{
//    app.UseExceptionHandler("/Home/Error");
//    // Disable HTTPS redirection
//    // app.UseHttpsRedirection();
//}


app.UseAuthentication();


//app.UseHttpsRedirection(); // if got https



app.UseAuthorization();
// Use CORS policy
app.UseCors("AllowReactApp");
app.MapControllers();

app.UseRouting();

var webSocketOptions = new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromSeconds(20)
};

app.UseWebSockets(webSocketOptions);
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
});

// Seed databases on startup
using (var scope = app.Services.CreateScope())
{
    try
    {
        var sqlSeeder = scope.ServiceProvider.GetRequiredService<DatabaseSeederService>();
        await sqlSeeder.SeedAsync();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error seeding SQL database. Make sure MSSQL is running: docker-compose up -d");
    }

    try
    {
        var mongoSeeder = scope.ServiceProvider.GetRequiredService<MongoDbSeederService>();
        await mongoSeeder.SeedAsync();
    }
    catch (Exception ex)
    {
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "Error seeding MongoDB. Make sure MongoDB is running: docker-compose up -d");
    }
}

app.Run();