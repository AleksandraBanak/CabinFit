namespace CabinFit.Api.Models
{
    public class VoucherValidationResult
    {
        public bool IsValid { get; set; }
        public string? Message { get; set; }
        public Voucher? Voucher { get; set; }
    }

}
