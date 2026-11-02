namespace CabinFit.Api.Models
{
    public class PaymentItem
    {
        public string Name { get; set; }
        public List<string> Images { get; set; } = new(); 
        public decimal Price { get; set; }
        public int Quantity { get; set; }
    }
}
