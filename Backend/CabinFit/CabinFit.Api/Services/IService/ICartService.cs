using CabinFit.Api.Models;

namespace CabinFit.Api.Services.IService
{
    public interface ICartService
    {
        Task<Cart> GetCartByUserIdAsync(string userId);
        Task<Cart> AddCartItemAsync(string userId, CartItem dto);
        Task<Cart> UpdateCartItemAsync(string userId, int itemId, CartItem dto);
        Task<CartItem?> RemoveCartItemAsync(string userId, int itemId);
        Task<bool> ClearCartAsync(string userId);
    }
}
