using System;

namespace webapi.Model
{
    public class Minimap
    {
        private static readonly Random random = new Random();

        public int Id { get; set; }
        public int Status { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public string? Summary { get; set; }

        // Constructor initializes random values for X, Y, and Status
        public Minimap()
        {
            X = random.Next(0, 300);
            Y = random.Next(0, 300);
            Status = random.Next(1, 3);  // Assuming Status can be either 1 or 2
            Summary = "Generated Location";  // Assign a default summary or change it based on your needs
        }
    }
}
