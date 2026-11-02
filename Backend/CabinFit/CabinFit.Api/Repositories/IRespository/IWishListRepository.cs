using CabinFit.Api.Models;

namespace CabinFit.Api.Repositories.IRespository
{
    public interface IWishListRepository
    {
        Task<List<WishListItem>> GetByUserIdAsync(string userId);
        Task<WishListItem?> GetByUserAndProductAsync(string userId, int productId);
        Task AddAsync(WishListItem item);
        Task RemoveAsync(WishListItem item);
        Task<bool> ExistsAsync(string userId, int productId);
    }
}
