using CabinFit.Api.Models;

namespace CabinFit.Api.Repositories.IRespository
{
    public interface IOrderRepository
    {
        Task<Order?> GetByIdAsync(int id);
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId);
        Task<IEnumerable<Order>> GetAllAsync();
        Task<Order> CreateAsync(Order order);
        Task<Order> UpdateAsync(Order order);
        Task<Order?> DeleteAsync(int id);
        Task<OrderItem> AddOrderItemAsync(OrderItem item);
        Task<IEnumerable<Order>> GetPendingOrdersAsync();
        Task<IEnumerable<Order>> GetInDeliveryOrdersForDriverAsync(string driverId);
        Task<IEnumerable<Order>> GetDeliveredOrdersForDriverAsync(string driverId);
    }
}
