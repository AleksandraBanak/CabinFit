namespace CabinFit.Api.Models.DTOs.CartDtos
{
    public class CartDto
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public List<CartItemDto> CartItems { get; set; } = new();
        public decimal Total => CartItems.Sum(i => i.Subtotal);
    }
}
