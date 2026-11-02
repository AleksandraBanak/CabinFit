namespace CabinFit.Api.Models
{
    public class Voucher
    {
        public int Id { get; set; }

        public string Code { get; set; } = null!;

        public decimal DiscountPercentage { get; set; }

        public DateTime ExpiryDate { get; set; }

        public bool IsUsed { get; set; } = false;

        public string UserId { get; set; } = null!;
        public User User { get; set; } = null!;
    }
}
