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
        // Remove this line from the field declaration:
        // private readonly string relativePath = _config["ArchiveSettings:ArchivePath"].ToString();

        // Instead, declare the field without initialization:
        private readonly string cfileName = "50mb.txt";
        private readonly string _relativePath;
        // Then, initialize 'relativePath' in the constructor:
        public ArchiveController(ILogger<ArchiveController> logger, IConfiguration config)
        {
            _logger = logger;
            _config = config;
            _relativePath = _config["ArchiveSettings:ArchivePath"]?.ToString();
        }
        
        [HttpGet("GetArchive64")]
        public IActionResult GetArchivePath64()
        {
 

            // Validate
            if (string.IsNullOrWhiteSpace(_relativePath))
                return BadRequest("Archive path is not configured.");

            // Convert relative path -> absolute full path
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), _relativePath);

            // Check the folder exists
            if (!Directory.Exists(fullPath))
                return BadRequest($"Archive directory does not exist: {fullPath}");

            // File you want to load
            var filePath = Path.Combine(fullPath, cfileName);

            // Check file exists
            if (!System.IO.File.Exists(filePath))
                return NotFound("logo512.png not found in archive directory.");



            string mimeType = "application/octet-stream";
            string ext = Path.GetExtension(cfileName).ToLower();

            if (ext == ".pdf") mimeType = "application/pdf";
            if (ext == ".jpg" || ext == ".jpeg") mimeType = "image/jpeg";
            if (ext == ".png") mimeType = "image/png";

            byte[] binaryData = System.IO.File.ReadAllBytes(filePath);
            // Convert file -> Base64
            var bytes = System.IO.File.ReadAllBytes(filePath);
            var base64 = Convert.ToBase64String(bytes);

            return Ok(new { FileName = cfileName, Base64 = base64 });

        }

        [HttpGet("GetArchiveBlob")]
        public IActionResult GetArchiveBlob()
        {
           

            // Validate
            if (string.IsNullOrWhiteSpace(_relativePath))
                return BadRequest("Archive path is not configured.");

            // Convert relative path -> absolute full path
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), _relativePath);
            // Check the folder exists
            if (!Directory.Exists(fullPath))
                return BadRequest($"Archive directory does not exist: {fullPath}");

            // File you want to load
            var filePath = Path.Combine(fullPath, cfileName);

            var bytes = System.IO.File.ReadAllBytes(filePath);

            // detect content type
            string mimeType = "application/octet-stream";
            var ext = Path.GetExtension(cfileName).ToLower();
            if (ext == ".pdf") mimeType = "application/pdf";
            if (ext == ".jpg" || ext == ".jpeg") mimeType = "image/jpeg";
            if (ext == ".png") mimeType = "image/png";

            return File(bytes, mimeType, cfileName);

        }

        [HttpGet("GetArchiveOptions")]
        public IActionResult GetArchiveOptions()
        {
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), _relativePath);

            string[] featureOptions = { "50mb.txt", "logo192.png", "logo512.png" };
            // Validate folder path
            // Get all files in the specified directory (no subdirectories)
            string[] files = Directory.GetFiles(folderPath);

            // Get only the filenames (without full path)
            List<string> fileNames = new List<string>();
            foreach (string file in files)
            {
                fileNames.Add(Path.GetFileName(file));
            }

            // Or using LINQ
            var fileNamesLinq = Directory.GetFiles(folderPath).Select(Path.GetFileName).ToList();


            return Ok(fileNamesLinq); // Wrap in Ok() to return HTTP 200 with JSON body
        }

        [HttpGet("GetArchiveFile")]
        public IActionResult GetArchiveFile(string filename )
        {
            // Validate
            if (string.IsNullOrWhiteSpace(_relativePath))
                return BadRequest("Archive path is not configured.");

            // Convert relative path -> absolute full path
            var fullPath = Path.Combine(Directory.GetCurrentDirectory(), _relativePath);
            // Check the folder exists
            if (!Directory.Exists(fullPath))
                return BadRequest($"Archive directory does not exist: {fullPath}");

            // File you want to load
            var filePath = Path.Combine(fullPath, filename);

            var bytes = System.IO.File.ReadAllBytes(filePath);

            // detect content type
            string mimeType = "application/octet-stream";
            var ext = Path.GetExtension(cfileName).ToLower();
            if (ext == ".pdf") mimeType = "application/pdf";
            if (ext == ".jpg" || ext == ".jpeg") mimeType = "image/jpeg";
            if (ext == ".png") mimeType = "image/png";

            return File(bytes, mimeType, filename);

        }
    }
}
 