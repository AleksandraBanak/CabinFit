namespace CabinFit.Api.Models.DTOs.OrderDtos
{
    public class OrderDto
    {
        public int Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Country { get; set; }
        public string City { get; set; }
        public string Zip { get; set; } 
        public string OrderNumber { get; set; }
        public string UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public string ShippingAddress { get; set; }
        public string ShippingMethod { get; set; }
        public decimal ShippingCost { get; set; }
        public DateTime? DeliveryDueDate { get; set; }
        public string PaymentMethod { get; set; }
        public DateTime OrderDate { get; set; }
        public List<OrderItemDto> OrderItems { get; set; } = new();
        public int? VoucherId { get; set; }
        public string? VoucherCode { get; set; }
        public string? DriverId { get; set; }
    }
}
