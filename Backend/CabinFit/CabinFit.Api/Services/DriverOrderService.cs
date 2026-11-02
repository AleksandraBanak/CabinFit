using CabinFit.Api.Models.DTOs.OrderDtos;
using CabinFit.Api.Models;
using CabinFit.Api.Repositories.IRespository;
using CabinFit.Api.Services.IService;
using AutoMapper;

namespace CabinFit.Api.Services
{
    public class DriverOrderService : IDriverOrderService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IMapper _mapper;

        public DriverOrderService(IOrderRepository orderRepo, IMapper mapper)
        {
            _orderRepo = orderRepo;
            _mapper = mapper;
        }

        public async Task<IEnumerable<OrderDto>> GetPendingAsync()
        {
            var orders = await _orderRepo.GetPendingOrdersAsync();
            return orders.Select(o => _mapper.Map<OrderDto>(o));
        }

        public async Task<IEnumerable<OrderDto>> GetMyInDeliveryAsync(string driverId)
        {
            var orders = await _orderRepo.GetInDeliveryOrdersForDriverAsync(driverId);
            return orders.Select(o => _mapper.Map<OrderDto>(o));

        }

        public async Task<OrderDto> TakeAsync(int orderId, string driverId)
        {
            var order = await _orderRepo.GetByIdAsync(orderId)
                ?? throw new KeyNotFoundException("Order not found.");

            if (order.Status != OrderStatus.Pending)
                throw new InvalidOperationException("Order is not pending anymore.");

            if (!string.IsNullOrEmpty(order.DriverId))
                throw new InvalidOperationException("Order already assigned to a driver.");

            order.DriverId = driverId;
            order.Status = OrderStatus.InDelivery;

            await _orderRepo.UpdateAsync(order);
            var updated = await _orderRepo.GetByIdAsync(orderId);
            return _mapper.Map<OrderDto>(updated!);
        }

        public async Task<OrderDto> MarkDeliveredAsync(int orderId, string driverId)
        {
            var order = await _orderRepo.GetByIdAsync(orderId)
                ?? throw new KeyNotFoundException("Order not found.");

            if (order.DriverId != driverId)
                throw new UnauthorizedAccessException("You are not assigned to this order.");

            if (order.Status != OrderStatus.InDelivery)
                throw new InvalidOperationException("Order is not in delivery.");

            order.Status = OrderStatus.Delivered;

            await _orderRepo.UpdateAsync(order);

            var updated = await _orderRepo.GetByIdAsync(orderId);
            return _mapper.Map<OrderDto>(updated!);
        }
        public async Task<IEnumerable<OrderDto>> GetDeliveredAsync(string driverId)
        {
            var orders = await _orderRepo.GetDeliveredOrdersForDriverAsync(driverId);
            return orders.Select(o => _mapper.Map<OrderDto>(o));
        }
    }
}
