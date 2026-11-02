namespace CabinFit.Api.Models
{
    public class WishListItem
    {
        public string UserId { get; set; } = null!;
        public User User { get; set; } = null!;

        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
