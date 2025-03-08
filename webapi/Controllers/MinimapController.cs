using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using webapi.Model;

namespace webapi.Controllers;

[ApiController]
[Route("[controller]")]
public class MinimapController : ControllerBase
{
    private static readonly string[] Icons = new[]
    {
        "Dooor", "Location", "WeatherForecast"
    };

    private readonly ILogger<MinimapController> _logger;

    public MinimapController(ILogger<MinimapController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "GetCoordinates")]
    public IEnumerable<Minimap> GetCoordinates()
    {

        var minimapItems = Enumerable.Range(1, 5).Select(index => new Minimap
        {
            Id = index + 1, // Assuming Minimap has an Id property
        }).ToArray();

        return minimapItems;
    }
}

// Move this class to a separate file if needed
public class ResponseModel
{
    public object Response { get; set; }
    public string Message { get; set; }
}
