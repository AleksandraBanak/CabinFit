using Microsoft.AspNetCore.Identity;

namespace CabinFit.Api.Models
{
    public class User : IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiry { get; set; }
        public Cart Cart { get; set; } = new();
        public ICollection<Order> Orders { get; set; } = new List<Order>();
        public ICollection<ProductRating> ProductRatings { get; set; } = new List<ProductRating>();
        public ICollection<Voucher> Vouchers { get; set; } = new List<Voucher>();
        public ICollection<WishListItem> WishlistItems { get; set; } = new List<WishListItem>();
    }
}
