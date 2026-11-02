using CabinFit.Api.Models;

namespace CabinFit.Api.Services.IService
{
    public interface IOrderItemService
    {
        Task<IEnumerable<OrderItem>> GetAllAsync();
        Task<OrderItem?> GetByIdAsync(int id);
        Task<OrderItem> CreateAsync(OrderItem orderItem);
        Task<OrderItem?> UpdateAsync(OrderItem orderItem);
        Task<OrderItem?> DeleteAsync(int id);
    }
}
