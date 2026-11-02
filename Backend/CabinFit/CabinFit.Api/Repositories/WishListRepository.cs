using CabinFit.Api.Data;
using CabinFit.Api.Models;
using CabinFit.Api.Repositories.IRespository;
using Microsoft.EntityFrameworkCore;

namespace CabinFit.Api.Repositories
{
    public class WishListRepository : IWishListRepository
    {
        private readonly ApplicationDbContext _context;
        public WishListRepository(ApplicationDbContext context) => _context = context;

        public async Task<List<WishListItem>> GetByUserIdAsync(string userId) =>
            await _context.WishlistItems
                .Where(w => w.UserId == userId)
                .Include(w => w.Product).ThenInclude(p => p.Category)
                .Include(w => w.Product).ThenInclude(p => p.Images)
                .Include(w => w.Product).ThenInclude(p => p.Ratings)
                .OrderByDescending(w => w.CreatedAt)
                .ToListAsync();

        public async Task<WishListItem?> GetByUserAndProductAsync(string userId, int productId)
        {
            return await _context.WishlistItems.Where(w => w.UserId == userId && w.ProductId == productId)
                  .Include(w => w.Product).ThenInclude(p => p.Category)
                  .Include(w => w.Product).ThenInclude(p => p.Images)
                  .Include(w => w.Product).ThenInclude(p => p.Ratings)
                  .FirstOrDefaultAsync();
        }

        public async Task AddAsync(WishListItem item)
        {
            _context.WishlistItems.Add(item);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(WishListItem item)
        {
            _context.WishlistItems.Remove(item);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(string userId, int productId) =>
            await _context.WishlistItems.AnyAsync(w => w.UserId == userId && w.ProductId == productId);
    }

}
