using CabinFit.Api.Models.DTOs.RatingDtos;

namespace CabinFit.Api.Services.IService
{
    public interface IRatingService
    {
        Task SetRatingAsync(int productId, string userId, int rating);
        Task<int?> GetMyRatingAsync(int productId, string userId);
        Task<ProductRatingSummaryDto> GetSummaryAsync(int productId);
    }
}
