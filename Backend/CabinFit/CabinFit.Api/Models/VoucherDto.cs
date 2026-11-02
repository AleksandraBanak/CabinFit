namespace CabinFit.Api.Models
{
    public class VoucherDto
    {
        public string Code { get; set; } = null!;
        public decimal DiscountPercentage { get; set; }
        public DateTime ExpiryDate { get; set; }
        public bool IsUsed { get; set; }
    }
}
