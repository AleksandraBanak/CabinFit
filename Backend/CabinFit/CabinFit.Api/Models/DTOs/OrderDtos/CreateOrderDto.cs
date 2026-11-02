using System.ComponentModel.DataAnnotations;

namespace CabinFit.Api.Models.DTOs.OrderDtos
{
    public class CreateOrderDto
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string PhoneNumber { get; set; }

        [Required]
        public string Country { get; set; }

        [Required]
        public string City { get; set; }

        [Required]
        public string Zip { get; set; }

        [Required]
        public string ShippingAddress { get; set; }

        [Required]
        public string ShippingMethod { get; set; }

        [Required]
        public string PaymentMethod { get; set; }
        public string? VoucherCode { get; set; }
    }
}
