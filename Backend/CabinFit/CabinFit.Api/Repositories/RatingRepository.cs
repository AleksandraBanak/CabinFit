using CabinFit.Api.Data;
using CabinFit.Api.Models;
using CabinFit.Api.Repositories.IRespository;
using Microsoft.EntityFrameworkCore;

namespace CabinFit.Api.Repositories
{
    public class RatingRepository : IRatingRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public RatingRepository(ApplicationDbContext context)
        {
            _dbContext = context;
        }

        public async Task<bool> ProductExistsAsync(int productId) 
        {
           return await _dbContext.Products.AnyAsync(p => p.Id == productId); 
        }

        public async Task<ProductRating?> GetByProductAndUserAsync(int productId, string userId)
        {
            return await _dbContext.ProductRatings
                  .FirstOrDefaultAsync(r => r.ProductId == productId && r.UserId == userId);
        }

        public async Task<ProductRating> CreateAsync(ProductRating rating)
        {
            await _dbContext.AddAsync(rating);
            await _dbContext.SaveChangesAsync();
            return rating;
        }

        public async Task<ProductRating> UpdateAsync(ProductRating rating)
        {
            _dbContext.Update(rating);
            await _dbContext.SaveChangesAsync();

            return rating;
        }
        public IQueryable<ProductRating> Query()
        {
            return _dbContext.ProductRatings.AsQueryable();
        }
    }
}
