using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using webapi.Model;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArchiveController  : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<ArchiveController> _logger;

        public ArchiveController(ILogger<ArchiveController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
        }

        [HttpGet(Name = "GetArchive")]
        public IActionResult GetArchivePath()
        {
            var relativePath = _config["ArchiveSettings:ArchivePath"];

            // Validate
            if (string.IsNullOrWhiteSpace(relativePath))
                return BadRequest("Archive path is not configured.");

            // Convert relative path -> absolute full path
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), relativePath);

            // Check the folder exists
            if (!Directory.Exists(fullPath))
                return BadRequest($"Archive directory does not exist: {fullPath}");

            // File you want to load
            var filePath = Path.Combine(fullPath, "logo512.png");

            // Check file exists
            if (!System.IO.File.Exists(filePath))
                return NotFound("logo512.png not found in archive directory.");

            // Convert file -> Base64
            var bytes = System.IO.File.ReadAllBytes(filePath);
            var base64 = Convert.ToBase64String(bytes);

            return Ok(new { FileName = "logo512.png", Base64 = base64 });
        }

        // Use POST to accept data from the client
        [HttpPost("PostExcel")]
        public IActionResult PostExcel([FromBody] Staff excelData) // Expecting a list of dictionaries
        {
            //if (excelData == null || excelData.Count == 0)
            //{
            //    return BadRequest("No data received.");
            //}

            // Process data (for example, log it, save to DB, etc.)
            _logger.LogInformation("Received Excel data: {@excelData}", excelData);

            // Return the received data as a response
            return Ok(new { ReceivedData = excelData });
        }
    }
}
