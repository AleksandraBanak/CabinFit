using CabinFit.Api.Models;

namespace CabinFit.Api.Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<IEnumerable<Product>> GetAllAsync();
        IQueryable<Product> GetAllQueryable();
        Task<Product?> GetByIdAsync(int id);
        Task<Product> CreateAsync(Product product);
        Task<Product?> UpdateAsync(Product product);
        Task<Product> DeleteAsync(Product product);
        Task<List<string>> GetAllColorsAsync();

    }
}
