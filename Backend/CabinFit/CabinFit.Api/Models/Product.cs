using System.ComponentModel.DataAnnotations.Schema;

namespace CabinFit.Api.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public decimal? DiscountPercentage { get; set; }

        [NotMapped]
        public decimal FinalPrice => DiscountPercentage.HasValue && DiscountPercentage > 0
           ? Price - (Price * DiscountPercentage.Value / 100)
           : Price;
        public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public decimal Depth { get; set; }
        public int StockQuantity { get; set; }
        public string Color { get; set; }

        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public ICollection<CartItem> CartItems { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
        public ICollection<ProductRating> Ratings { get; set; } = new List<ProductRating>();
        public ICollection<WishListItem> WishlistItems { get; set; } = new List<WishListItem>();
    }
}
