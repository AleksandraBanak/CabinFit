using CabinFit.Api.Data;
using CabinFit.Api.Models;
using CabinFit.Api.Repositories.IRespository;
using Microsoft.EntityFrameworkCore;

namespace CabinFit.Api.Repositories
{
    public class CartRepository : ICartRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public CartRepository(ApplicationDbContext context)
        {
            _dbContext = context;
        }
        public async Task<Cart?> GetCartByUserIdAsync(string userId)
        {
            return await _dbContext.Carts
               .Include(c => c.CartItems)
               .ThenInclude(ci => ci.Product)
               .ThenInclude(p => p.Images)
               .FirstOrDefaultAsync(c => c.UserId == userId);
        }
        public async Task<Cart> CreateCartAsync(Cart cart)
        {
            await _dbContext.Carts.AddAsync(cart);
            await _dbContext.SaveChangesAsync();
            return cart;
        }
        public async Task<CartItem> AddCartItemAsync(CartItem item)
        {
            await _dbContext.CartItems.AddAsync(item);
            await _dbContext.SaveChangesAsync();
            return item;
        }

        public async Task<CartItem?> UpdateCartItemAsync(CartItem item)
        {
            _dbContext.CartItems.Update(item);
            await _dbContext.SaveChangesAsync();
            return item;
        }
        public async Task<CartItem> RemoveCartItemAsync(CartItem item)
        {
            _dbContext.CartItems.Remove(item);
            await _dbContext.SaveChangesAsync();
            return item;
        }

        public async Task<bool> ClearCartAsync(int cartId)
        {
            var cart = await _dbContext.Carts
               .Include(c => c.CartItems)
               .FirstOrDefaultAsync(c => c.Id == cartId);

            if (cart != null)
            {
                _dbContext.CartItems.RemoveRange(cart.CartItems);
                await _dbContext.SaveChangesAsync();
                return true;
            }

            return false;
        }

        public async Task<CartItem?> GetCartItemById(int cartItemId)
        {
            return await _dbContext.CartItems.FindAsync(cartItemId);
        }
    }
}
