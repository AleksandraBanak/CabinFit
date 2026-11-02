using AutoMapper;
using CabinFit.Api.Data;
using CabinFit.Api.Models.DTOs.WishListItemDtos;
using CabinFit.Api.Models;
using CabinFit.Api.Repositories.IRespository;
using CabinFit.Api.Services.IService;
using Microsoft.EntityFrameworkCore;

namespace CabinFit.Api.Services
{
    public class WishListService : IWishListService
    {
        private readonly IWishListRepository _repo;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _context;

        public WishListService(IWishListRepository repo, IMapper mapper, ApplicationDbContext context)
        {
            _repo = repo;
            _mapper = mapper;
            _context = context;
        }

        public async Task<List<WishListItemDto>> GetUserWishlistAsync(string userId)
        {
            var items = await _repo.GetByUserIdAsync(userId);
            return _mapper.Map<List<WishListItemDto>>(items);
        }

        public async Task<WishListItemDto?> AddToWishlistAsync(string userId, int productId)
        {
            if (await _repo.ExistsAsync(userId, productId))
                return null;

            var product = await _context.Products
                .Include(p => p.Category)
                .Include(p => p.Images)
                .Include(p => p.Ratings)
                .FirstOrDefaultAsync(p => p.Id == productId);

            if (product == null)
                throw new KeyNotFoundException("Product not found.");

            var item = new WishListItem
            {
                UserId = userId,
                ProductId = productId,
                Product = product 
            };

            await _repo.AddAsync(item);

            return _mapper.Map<WishListItemDto>(item);
        }

        public async Task<WishListItemDto?> RemoveFromWishlistAsync(string userId, int productId)
        {
            var item = await _repo.GetByUserAndProductAsync(userId, productId);
            if (item == null)
                return null;

            var wishListItemDto = _mapper.Map<WishListItemDto>(item);

            _context.WishlistItems.Remove(item);
            await _context.SaveChangesAsync();

            return wishListItemDto;
        }

        public async Task<bool> IsInWishlistAsync(string userId, int productId)
            => await _repo.ExistsAsync(userId, productId);
    }

}