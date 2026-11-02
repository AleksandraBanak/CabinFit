using CabinFit.Api.Models;

namespace CabinFit.Api.Repositories.IRespository
{
    public interface IOrderItemRepository
    {
        Task<IEnumerable<OrderItem>> GetAllAsync();
        Task<OrderItem?> GetByIdAsync(int id);
        Task<OrderItem> CreateAsync(OrderItem orderItem);
        Task<OrderItem> UpdateAsync(OrderItem orderItem);
        Task<OrderItem?> DeleteAsync(OrderItem orderItem);
    }
}
