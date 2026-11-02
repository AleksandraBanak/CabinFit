namespace CabinFit.Api.Models.DTOs.WishListItemDtos
{
    public class WishListItemDto
    {
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public decimal Price { get; set; }
        public decimal? FinalPrice { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public int StockQuantity { get; set; }
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public decimal Depth { get; set; }
        public string Color { get; set; }
        public string CategoryName { get; set; }
        public List<string> Images { get; set; }
        public double AverageRating { get; set; }
        public int RatingsCount { get; set; }
    }

}
