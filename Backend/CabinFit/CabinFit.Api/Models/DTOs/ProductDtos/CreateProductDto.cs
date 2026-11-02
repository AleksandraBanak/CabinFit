using System.ComponentModel.DataAnnotations;

namespace CabinFit.Api.Models.DTOs.ProductDtos
{
    public class CreateProductDto
    {
        [Required]
        [MaxLength(40)]
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public decimal Price { get; set; }

        [Range(0, 100, ErrorMessage = "Discount must be between 0 and 100.")]
        public decimal? DiscountPercentage { get; set; }
        public List<IFormFile> Images { get; set; } = new List<IFormFile>();
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public decimal Depth { get; set; }

        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; }
        public string Color { get; set; } = string.Empty;

        [Required]
        public int CategoryId { get; set; }
    }
}
