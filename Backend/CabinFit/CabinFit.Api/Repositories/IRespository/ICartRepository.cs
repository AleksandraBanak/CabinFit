using CabinFit.Api.Models;

namespace CabinFit.Api.Repositories.IRespository
{
    public interface ICartRepository
    {
        Task<Cart?> GetCartByUserIdAsync(string userId);
        Task<Cart> CreateCartAsync(Cart cart);
        Task<CartItem> AddCartItemAsync(CartItem item);
        Task<CartItem?> UpdateCartItemAsync(CartItem item);
        Task<CartItem> RemoveCartItemAsync(CartItem item);
        Task<bool> ClearCartAsync(int cartId);
        Task<CartItem?> GetCartItemById(int cartItemId);
    }
}
