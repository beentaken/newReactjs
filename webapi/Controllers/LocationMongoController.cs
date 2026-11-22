using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;

namespace webapi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationMongoController : ControllerBase
    {
        private readonly IMongoClient _mongoClient;
        private readonly ILogger<LocationMongoController> _logger;
        private const string DatabaseName = "ReactJsDb";
        private const string CollectionName = "Locations";

        public LocationMongoController(IMongoClient mongoClient, ILogger<LocationMongoController> logger)
        {
            _mongoClient = mongoClient;
            _logger = logger;
        }

        private IMongoCollection<BsonDocument> GetLocationCollection()
        {
            var database = _mongoClient.GetDatabase(DatabaseName);
            return database.GetCollection<BsonDocument>(CollectionName);
        }

        /// <summary>
        /// Get all locations from MongoDB
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<List<BsonDocument>>> GetLocations()
        {
            try
            {
                var collection = GetLocationCollection();
                var locations = await collection.Find(new BsonDocument())
                    .ToListAsync();

                _logger.LogInformation($"Retrieved {locations.Count} locations from MongoDB.");
                return Ok(locations);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting locations: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get locations by country
        /// </summary>
        [HttpGet("by-country/{country}")]
        public async Task<ActionResult<List<BsonDocument>>> GetLocationsByCountry(string country)
        {
            try
            {
                var collection = GetLocationCollection();
                var filter = Builders<BsonDocument>.Filter.Eq("country", country);
                var locations = await collection.Find(filter).ToListAsync();

                if (locations.Count == 0)
                    return NotFound($"No locations found for country: {country}");

                return Ok(locations);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting locations by country: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get locations by continent
        /// </summary>
        [HttpGet("by-continent/{continent}")]
        public async Task<ActionResult<List<BsonDocument>>> GetLocationsByContinent(string continent)
        {
            try
            {
                var collection = GetLocationCollection();
                var filter = Builders<BsonDocument>.Filter.Eq("continent", continent);
                var locations = await collection.Find(filter).ToListAsync();

                if (locations.Count == 0)
                    return NotFound($"No locations found for continent: {continent}");

                return Ok(locations);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting locations by continent: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Add a new location (track a location)
        /// </summary>
        [HttpPost]
        public async Task<ActionResult<BsonDocument>> AddLocation([FromBody] BsonDocument location)
        {
            try
            {
                if (!location.Contains("country") || !location.Contains("continent"))
                    return BadRequest("Country and continent are required fields.");

                if (!location.Contains("_id"))
                    location["_id"] = ObjectId.GenerateNewId();

                if (!location.Contains("timestamp"))
                    location["timestamp"] = DateTime.UtcNow;

                var collection = GetLocationCollection();
                await collection.InsertOneAsync(location);

                _logger.LogInformation($"Added new location: {location["country"]}");
                return CreatedAtAction(nameof(GetLocations), new { id = location["_id"] }, location);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error adding location: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Update an existing location
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLocation(string id, [FromBody] BsonDocument location)
        {
            try
            {
                var collection = GetLocationCollection();
                var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));

                location["timestamp"] = DateTime.UtcNow; // Update timestamp

                var result = await collection.ReplaceOneAsync(filter, location);

                if (result.MatchedCount == 0)
                    return NotFound("Location not found.");

                _logger.LogInformation($"Updated location {id}");
                return Ok(location);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating location: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Delete a location
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLocation(string id)
        {
            try
            {
                var collection = GetLocationCollection();
                var filter = Builders<BsonDocument>.Filter.Eq("_id", ObjectId.Parse(id));
                var result = await collection.DeleteOneAsync(filter);

                if (result.DeletedCount == 0)
                    return NotFound("Location not found.");

                _logger.LogInformation($"Deleted location {id}");
                return NoContent();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting location: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }

        /// <summary>
        /// Get location statistics (count by continent)
        /// </summary>
        [HttpGet("stats/by-continent")]
        public async Task<ActionResult<object>> GetStatsByContinent()
        {
            try
            {
                var collection = GetLocationCollection();

                var pipeline = new[]
                {
                    new BsonDocument("$group", new BsonDocument
                    {
                        { "_id", "$continent" },
                        { "count", new BsonDocument("$sum", 1) },
                        { "totalPopulation", new BsonDocument("$sum", "$population") }
                    })
                };

                var result = await collection.Aggregate<BsonDocument>(pipeline).ToListAsync();

                _logger.LogInformation("Retrieved location statistics by continent.");
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting statistics: {ex.Message}");
                return StatusCode(500, "Internal server error");
            }
        }
    }
}
