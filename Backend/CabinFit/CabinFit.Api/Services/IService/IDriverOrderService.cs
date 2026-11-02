using CabinFit.Api.Models.DTOs.OrderDtos;

namespace CabinFit.Api.Services.IService
{
    public interface IDriverOrderService
    {
        Task<IEnumerable<OrderDto>> GetPendingAsync();
        Task<IEnumerable<OrderDto>> GetMyInDeliveryAsync(string driverId);
        Task<OrderDto> TakeAsync(int orderId, string driverId);
        Task<OrderDto> MarkDeliveredAsync(int orderId, string driverId);
        Task<IEnumerable<OrderDto>> GetDeliveredAsync(string driverId);
    }
}
