using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using webapi.Model;

namespace webapi.Controllers;

[ApiController]
[Route("api/[controller]")] // Explicitly set API prefix
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

    [HttpGet("GetCoordinates")]
    public IEnumerable<Minimap> GetCoordinates()
    {
        return Enumerable.Range(1, 5).Select(index => new Minimap
        {
            Id = index
        });
    }

    [HttpGet("GetCoordinate/{id}")]
    public ActionResult<Minimap> GetCoordinate(int id)
    {
        var item = new Minimap { Id = id };
        if (item == null)
        {
            return NotFound("Coordinate not found");
        }
        return item;
    }

}

// Move this class to a separate file if needed
public class ResponseModel
{
    public object Response { get; set; }
    public string Message { get; set; }
}
