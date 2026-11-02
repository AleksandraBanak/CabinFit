using System.ComponentModel.DataAnnotations;

namespace CabinFit.Api.Models
{
    public class ProductRating
    {
        public int Id { get; set; }

        [Range(1, 5)]
        public int Rating { get; set; }

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;

        public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAtUtc { get; set; }
    }
}
