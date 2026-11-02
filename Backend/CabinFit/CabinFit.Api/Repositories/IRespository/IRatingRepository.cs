using CabinFit.Api.Models;

namespace CabinFit.Api.Repositories.IRespository
{
    public interface IRatingRepository
    {
        Task<bool> ProductExistsAsync(int productId);
        Task<ProductRating?> GetByProductAndUserAsync(int productId, string userId);
        Task<ProductRating> CreateAsync(ProductRating rating);
        Task<ProductRating> UpdateAsync(ProductRating rating);
        IQueryable<ProductRating> Query();
        
    }
}
