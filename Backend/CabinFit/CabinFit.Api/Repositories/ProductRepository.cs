using CabinFit.Api.Data;
using CabinFit.Api.Models;
using CabinFit.Api.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CabinFit.Api.Repositories
{
    public class ProductRepository : IProductRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public ProductRepository(ApplicationDbContext context)
        {
            _dbContext = context;
        }

        public async Task<IEnumerable<Product>> GetAllAsync()
        {
            return await _dbContext.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Ratings).ToListAsync();
        }

        public IQueryable<Product> GetAllQueryable()
        {
            return _dbContext.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Ratings);
        }


        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _dbContext.Products.Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Ratings)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<Product> CreateAsync(Product product)
        {
            await _dbContext.Products.AddAsync(product);
            await _dbContext.SaveChangesAsync();
            return product;
        }

        public async Task<Product?> UpdateAsync(Product product)
        {
            _dbContext.Update(product);

            await _dbContext.SaveChangesAsync();
            return product;
        }

        public async Task<Product> DeleteAsync(Product product)
        {
            _dbContext.Products.Remove(product);
            await _dbContext.SaveChangesAsync();

            return product;
        }

        public async Task<List<string>> GetAllColorsAsync()
        {
            return await _dbContext.Products
                .Select(p => p.Color)
                .Distinct()
                .ToListAsync();
        }

    }
}
