namespace CabinFit.Api.Models.DTOs.CartDtos
{
    public class CartItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; }
        public List<string> ProductImages { get; set; } = new();
        public decimal Price { get; set; }
        public decimal? DiscountPercentage { get; set; }
        public decimal FinalPrice { get; set; }
        public int Quantity { get; set; }
        public int StockQuantity { get; set; }
        public decimal Subtotal => FinalPrice * Quantity;
        public decimal SubtotalBeforeDiscount => Price * Quantity;
        public decimal Width { get; set; }
        public decimal Height { get; set; }
        public decimal Depth { get; set; }
    }
}
