namespace CabinFit.Api.Models.DTOs.OrderItemDtos
{
    public class CreateOrderItemDto
    {
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int ProductId { get; set; }
    }
}
