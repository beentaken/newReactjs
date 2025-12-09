using System.IO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Extensions;
using webapi.Model;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ArchiveController  : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly ILogger<ArchiveController> _logger;
        private readonly string fileName = "logo512.png";
        public ArchiveController(ILogger<ArchiveController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
        }
        
        [HttpGet("GetArchive64")]
        public IActionResult GetArchivePath64()
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
            var filePath = Path.Combine(fullPath, fileName);

            // Check file exists
            if (!System.IO.File.Exists(filePath))
                return NotFound("logo512.png not found in archive directory.");



            string mimeType = "application/octet-stream";
            string ext = Path.GetExtension(fileName).ToLower();

            if (ext == ".pdf") mimeType = "application/pdf";
            if (ext == ".jpg" || ext == ".jpeg") mimeType = "image/jpeg";
            if (ext == ".png") mimeType = "image/png";

            byte[] binaryData = System.IO.File.ReadAllBytes(filePath);
            // Convert file -> Base64
            var bytes = System.IO.File.ReadAllBytes(filePath);
            var base64 = Convert.ToBase64String(bytes);

            return Ok(new { FileName = "logo512.png", Base64 = base64 });

        }

        [HttpGet("GetArchiveBlob")]
        public IActionResult GetArchiveBlob()
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
            var filePath = Path.Combine(fullPath, fileName);

            var bytes = System.IO.File.ReadAllBytes(filePath);

            // detect content type
            string mimeType = "application/octet-stream";
            var ext = Path.GetExtension(fileName).ToLower();
            if (ext == ".pdf") mimeType = "application/pdf";
            if (ext == ".jpg" || ext == ".jpeg") mimeType = "image/jpeg";
            if (ext == ".png") mimeType = "image/png";

            return File(bytes, mimeType, fileName);

        }
    }
}
