namespace CabinFit.Api.Models.DTOs.RatingDtos
{
    public class ProductRatingSummaryDto
    {
        public int ProductId { get; set; }
        public double AverageRating { get; set; }
        public int RatingsCount { get; set; }
        public Dictionary<int, int> StarCounts { get; set; } = new();
    }
}
