using MongoDB.Bson;
using MongoDB.Driver;

namespace webapi.Services
{
    /// <summary>
    /// Seeds initial location tracking data into MongoDB.
    /// Use MongoDB for Location because it's optimized for:
    /// - Time-series data (location updates over time)
    /// - Fast writes
    /// - Flexible schema (add new fields without migrations)
    /// - Geospatial queries
    /// </summary>
    public class MongoDbSeederService
    {
        private readonly IMongoClient _mongoClient;
        private readonly ILogger<MongoDbSeederService> _logger;
        private const string DatabaseName = "ReactJsDb";
        private const string LocationCollectionName = "Locations";

        public MongoDbSeederService(IMongoClient mongoClient, ILogger<MongoDbSeederService> logger)
        {
            _mongoClient = mongoClient;
            _logger = logger;
        }

        public async Task SeedAsync()
        {
            try
            {
                var database = _mongoClient.GetDatabase(DatabaseName);
                var locationCollection = database.GetCollection<BsonDocument>(LocationCollectionName);

                // Check if collection has data
                var count = await locationCollection.CountDocumentsAsync(new BsonDocument());
                if (count > 0)
                {
                    _logger.LogInformation("MongoDB Locations collection already has data. Skipping seed.");
                    return;
                }

                // Sample location tracking data
                var locationDocuments = new List<BsonDocument>
                {
                    new BsonDocument
                    {
                        { "_id", ObjectId.GenerateNewId() },
                        { "country", "United States" },
                        { "continent", "North America" },
                        { "city", "New York" },
                        { "coordinates", new BsonDocument { { "latitude", 40.7128 }, { "longitude", -74.0060 } } },
                        { "population", 8335897 },
                        { "timestamp", DateTime.UtcNow },
                        { "summary", "Major city in USA" },
                        { "accuracy", "High" }
                    },
                    new BsonDocument
                    {
                        { "_id", ObjectId.GenerateNewId() },
                        { "country", "United Kingdom" },
                        { "continent", "Europe" },
                        { "city", "London" },
                        { "coordinates", new BsonDocument { { "latitude", 51.5074 }, { "longitude", -0.1278 } } },
                        { "population", 9002488 },
                        { "timestamp", DateTime.UtcNow.AddHours(-1) },
                        { "summary", "Capital of UK" },
                        { "accuracy", "High" }
                    },
                    new BsonDocument
                    {
                        { "_id", ObjectId.GenerateNewId() },
                        { "country", "France" },
                        { "continent", "Europe" },
                        { "city", "Paris" },
                        { "coordinates", new BsonDocument { { "latitude", 48.8566 }, { "longitude", 2.3522 } } },
                        { "population", 2161000 },
                        { "timestamp", DateTime.UtcNow.AddHours(-2) },
                        { "summary", "Capital of France" },
                        { "accuracy", "High" }
                    },
                    new BsonDocument
                    {
                        { "_id", ObjectId.GenerateNewId() },
                        { "country", "Japan" },
                        { "continent", "Asia" },
                        { "city", "Tokyo" },
                        { "coordinates", new BsonDocument { { "latitude", 35.6762 }, { "longitude", 139.6503 } } },
                        { "population", 37400068 },
                        { "timestamp", DateTime.UtcNow.AddHours(-3) },
                        { "summary", "World's largest metropolitan area" },
                        { "accuracy", "High" }
                    },
                    new BsonDocument
                    {
                        { "_id", ObjectId.GenerateNewId() },
                        { "country", "Australia" },
                        { "continent", "Oceania" },
                        { "city", "Sydney" },
                        { "coordinates", new BsonDocument { { "latitude", -33.8688 }, { "longitude", 151.2093 } } },
                        { "population", 5312163 },
                        { "timestamp", DateTime.UtcNow.AddHours(-4) },
                        { "summary", "Largest city in Australia" },
                        { "accuracy", "High" }
                    }
                };

                await locationCollection.InsertManyAsync(locationDocuments);
                _logger.LogInformation($"Seeded {locationDocuments.Count} locations into MongoDB.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error seeding MongoDB: {ex.Message}");
                throw;
            }
        }
    }
}
