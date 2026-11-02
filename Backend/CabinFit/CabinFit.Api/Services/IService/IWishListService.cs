using CabinFit.Api.Models.DTOs.WishListItemDtos;

namespace CabinFit.Api.Services.IService
{
    public interface IWishListService
    {
        Task<List<WishListItemDto>> GetUserWishlistAsync(string userId);
        Task<WishListItemDto> AddToWishlistAsync(string userId, int productId);
        Task<WishListItemDto?> RemoveFromWishlistAsync(string userId, int productId);
        Task<bool> IsInWishlistAsync(string userId, int productId);
    }
}
