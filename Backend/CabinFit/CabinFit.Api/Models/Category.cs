namespace CabinFit.Api.Models
{
    public class Category
    {
        public int Id { get; set; }
        public string Name { get; set; } // Suitcase, Backpack, Bag
        public ICollection<Product> Products { get; set; }
    }
}
