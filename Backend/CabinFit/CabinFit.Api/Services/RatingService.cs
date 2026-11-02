using CabinFit.Api.Models;
using CabinFit.Api.Models.DTOs.RatingDtos;
using CabinFit.Api.Repositories.IRespository;
using CabinFit.Api.Services.IService;
using Microsoft.EntityFrameworkCore;

namespace CabinFit.Api.Services
{
    public class RatingService : IRatingService
    {
        private readonly IRatingRepository _repository;

        public RatingService(IRatingRepository repository)
        {
            _repository = repository;
        }

        public async Task SetRatingAsync(int productId, string userId, int rating)
        {
            var productExists = await _repository.ProductExistsAsync(productId);
            if (!productExists) throw new KeyNotFoundException("Product not found.");

            var existing = await _repository.GetByProductAndUserAsync(productId, userId);

            if (existing == null)
            {
                await _repository.CreateAsync(new ProductRating
                {
                    ProductId = productId,
                    UserId = userId,
                    Rating = rating,
                    CreatedAtUtc = DateTime.UtcNow
                });
            }
            else
            {
                existing.Rating = rating;
                existing.UpdatedAtUtc = DateTime.UtcNow;
                await _repository.UpdateAsync(existing);
            }
        }

        public async Task<int?> GetMyRatingAsync(int productId, string userId)
        {
            return await _repository.Query()
                .Where(r => r.ProductId == productId && r.UserId == userId)
                .Select(r => (int?)r.Rating)
                .FirstOrDefaultAsync();
        }

        public async Task<ProductRatingSummaryDto> GetSummaryAsync(int productId)
        {
            var query = _repository.Query().Where(r => r.ProductId == productId);

            var count = await query.CountAsync();
            var avg = count == 0 ? 0 : await query.AverageAsync(r => (double)r.Rating);

            var starCounts = await query
                .GroupBy(r => r.Rating)
                .Select(g => new
                {
                    Star = g.Key,
                    Count = g.Count()
                })
                .ToDictionaryAsync(x => x.Star, x => x.Count);

            for (int i = 1; i <= 5; i++)
                if (!starCounts.ContainsKey(i))
                    starCounts[i] = 0;

            return new ProductRatingSummaryDto
            {
                ProductId = productId,
                RatingsCount = count,
                AverageRating = Math.Round(avg, 2),
                StarCounts = starCounts
            };
        }
    }
}
