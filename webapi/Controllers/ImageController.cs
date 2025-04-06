using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace webapi.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ImageController : ControllerBase
    {
        private readonly ILogger<ImageController> _logger;

        public ImageController(ILogger<ImageController> logger)
        {
            _logger = logger;
        }

        [HttpPost("PostImagecaption")]
        public async Task<IActionResult> Post([FromBody] SearchRequest request)
        {
            if (request == null || string.IsNullOrEmpty(request.SearchText))
            {
                return BadRequest("Invalid request.");
            }

            string filePath = "camera_1/summary.txt";

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File not found.");
            }

            List<string> matchingLines = new List<string>();

            using (StreamReader reader = new StreamReader(filePath))
            {
                string line;
                while ((line = await reader.ReadLineAsync()) != null)
                {
                    if (line.Contains(request.SearchText))
                    {
                        matchingLines.Add(line);
                    }
                }
            }

            return Ok(matchingLines);
        }

        [HttpGet("PostAnomaly")]
        public async Task<IActionResult> Get()
        {
            string filePath = "camera_1/anomaly.txt";

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File not found.");
            }

            List<string> matchingLines = new List<string>();

            using (StreamReader reader = new StreamReader(filePath))
            {
                string line;
                while ((line = await reader.ReadLineAsync()) != null)
                {
                    matchingLines.Add(line);
                }
            }

            return Ok(matchingLines);
        }

        public class SearchRequest
        {
            public string SearchText { get; set; }
        }


        [HttpGet("get-image")]
        public IActionResult GetImage()
        {
            var currentDirectory = Directory.GetCurrentDirectory();
            var imagePath = Path.Combine(currentDirectory, "Images", "floor.png");

            if (!System.IO.File.Exists(imagePath))
            {
                return NotFound("Image not found.");
            }

            var imageBytes = System.IO.File.ReadAllBytes(imagePath);
            return File(imageBytes, "image/jpeg");
        }

        [HttpGet("get-image-base64")]
        public IActionResult GetImageBase64()
        {
            var currentDirectory = Directory.GetCurrentDirectory();
            var imagePath = Path.Combine(currentDirectory, "Images", "floor.png");

            if (!System.IO.File.Exists(imagePath))
            {
                return NotFound("Image not found.");
            }

            var imageBytes = System.IO.File.ReadAllBytes(imagePath);
            var base64String = Convert.ToBase64String(imageBytes);

            return Ok(new { imageBase64 = base64String });
        }
    }
}
