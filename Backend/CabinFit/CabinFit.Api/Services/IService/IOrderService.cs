using CabinFit.Api.Models.DTOs.OrderDtos;
using CabinFit.Api.Models;

namespace CabinFit.Api.Services.IService
{
    public interface IOrderService
    {
        Task<Order?> GetOrderByIdAsync(int id);
        Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId);
        Task<IEnumerable<Order>> GetAllOrdersAsync();
        Task<Order> CreateOrderFromCartAsync(string userId, CreateOrderDto orderDto);
        Task<Order> UpdateOrderStatusAsync(int id, OrderStatus status);
        Task<Order?> CancelOrderAsync(int id);
    }
}
