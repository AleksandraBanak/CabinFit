using CabinFit.Api.Models;
using CabinFit.Api.Repositories.IRespository;
using CabinFit.Api.Services.IService;

namespace CabinFit.Api.Services
{
    public class OrderItemService : IOrderItemService
    {
        private readonly IOrderItemRepository _repository;

        public OrderItemService(IOrderItemRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<OrderItem>> GetAllAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<OrderItem?> GetByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }
        public async Task<OrderItem> CreateAsync(OrderItem orderItem)
        {
            await _repository.CreateAsync(orderItem);
            return orderItem;
        }

        public async Task<OrderItem?> UpdateAsync(OrderItem orderItem)
        {
            return await _repository.UpdateAsync(orderItem);
        }
        public async Task<OrderItem?> DeleteAsync(int id)
        {
            var existingProduct = await _repository.GetByIdAsync(id);
            if (existingProduct == null) return null;

            return await _repository.DeleteAsync(existingProduct);
        }
    }
}
