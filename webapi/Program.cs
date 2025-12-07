using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerUI;

// Create builder
var builder = WebApplication.CreateBuilder(args);

// Load custom appsettings.json
var configPath = Path.Combine(Directory.GetCurrentDirectory(), "appsettings.json");
builder.Configuration.AddJsonFile(configPath, optional: false, reloadOnChange: true);

// Add services
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.OperationFilter<AddCustomHeaderOperationFilter>();

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

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
            new string[] {}
        }
    });
});

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("https://localhost:3000", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// --- Middleware order is important ---

app.UseDeveloperExceptionPage();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.DefaultModelRendering(ModelRendering.Example);
    c.DefaultModelsExpandDepth(-1);
    c.DisplayRequestDuration();
    c.EnableDeepLinking();
    c.EnableFilter();
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
});

// Enable WebSockets BEFORE routing
app.UseWebSockets(new WebSocketOptions
{
    KeepAliveInterval = TimeSpan.FromSeconds(20)
});

app.UseRouting();

app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

//app.UseHttpsRedirection(); // if got https
app.MapControllers();

app.Run();
