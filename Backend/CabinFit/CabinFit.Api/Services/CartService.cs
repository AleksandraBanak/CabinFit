using CabinFit.Api.Models;
using CabinFit.Api.Repositories.Interfaces;
using CabinFit.Api.Repositories.IRespository;
using CabinFit.Api.Services.IService;

namespace CabinFit.Api.Services
{
    public class CartService : ICartService
    {
        private readonly ICartRepository _repository;
        private readonly IProductRepository _productRepository;

        public CartService(ICartRepository repository, IProductRepository productRepository)
        {
            _repository = repository;
            _productRepository = productRepository;
        }

        public async Task<Cart> GetCartByUserIdAsync(string userId)
        {
            return await GetOrCreateCartAsync(userId);
        }
        public async Task<Cart> AddCartItemAsync(string userId, CartItem dto)
        {
            var cart = await GetOrCreateCartAsync(userId);
            var product = await _productRepository.GetByIdAsync(dto.ProductId);

            if (product == null)
                throw new ArgumentException("Invalid product");

            var existingItem = cart.CartItems.FirstOrDefault(ci => ci.ProductId == dto.ProductId);

            if (existingItem != null)
            {
                existingItem.Quantity += dto.Quantity;
                await _repository.UpdateCartItemAsync(existingItem);
            }
            else
            {
                var newItem = new CartItem
                {
                    CartId = cart.Id,
                    ProductId = dto.ProductId,
                    Quantity = dto.Quantity
                };
                await _repository.AddCartItemAsync(newItem);
            }

            return await _repository.GetCartByUserIdAsync(userId);
        }

        public async Task<Cart> UpdateCartItemAsync(string userId, int itemId, CartItem dto)
        {
            var cart = await GetOrCreateCartAsync(userId);
            var item = cart.CartItems.FirstOrDefault(ci => ci.Id == itemId);

            if (item == null)
                throw new ArgumentException("Item not found in cart");

            item.Quantity = dto.Quantity;
            await _repository.UpdateCartItemAsync(item);

            return cart;
        }
        public async Task<CartItem?> RemoveCartItemAsync(string userId, int itemId)
        {
            var item = await _repository.GetCartItemById(itemId);
            if (item == null) return null;

            return await _repository.RemoveCartItemAsync(item);
        }
        public async Task<bool> ClearCartAsync(string userId)
        {
            var cart = await GetOrCreateCartAsync(userId);
            return await _repository.ClearCartAsync(cart.Id);
        }

        private async Task<Cart> GetOrCreateCartAsync(string userId)
        {
            var cart = await _repository.GetCartByUserIdAsync(userId);

            if (cart == null)
            {
                cart = new Cart { UserId = userId };
                cart = await _repository.CreateCartAsync(cart);
            }

            return cart;
        }
    }
}
