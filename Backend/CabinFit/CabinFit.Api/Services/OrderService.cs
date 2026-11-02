using CabinFit.Api.Models;
using CabinFit.Api.Models.DTOs.OrderDtos;
using CabinFit.Api.Repositories.Interfaces;
using CabinFit.Api.Repositories.IRespository;
using CabinFit.Api.Services.IService;
using CabinFit.Api.Services.Helpers;

namespace CabinFit.Api.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepository;
        private readonly ICartRepository _cartRepository;
        private readonly IProductRepository _productRepository;
        private readonly IVoucherService _voucherService;
        public OrderService(IOrderRepository orderRepository, ICartRepository cartRepository,
            IProductRepository productRepository, IVoucherService voucherService)
        {
            _orderRepository = orderRepository;
            _cartRepository = cartRepository;
            _productRepository = productRepository;
            _voucherService = voucherService;
        }
        public async Task<Order?> GetOrderByIdAsync(int id)
        {
            return await _orderRepository.GetByIdAsync(id);
        }
        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId)
        {
            return await _orderRepository.GetOrdersByUserIdAsync(userId);
        }
        public async Task<IEnumerable<Order>> GetAllOrdersAsync()
        {
            return await _orderRepository.GetAllAsync();
        }
        public async Task<Order> CreateOrderFromCartAsync(string userId, CreateOrderDto orderDto)
        {
            var cart = await _cartRepository.GetCartByUserIdAsync(userId);
            if (cart == null || !cart.CartItems.Any())
                throw new InvalidOperationException("Cart is empty");

            var orderDate = DateTime.UtcNow;

            var order = new Order
            {
                UserId = userId,
                FirstName = orderDto.FirstName,
                LastName = orderDto.LastName,
                Email = orderDto.Email,
                PhoneNumber = orderDto.PhoneNumber,
                Country = orderDto.Country,
                City = orderDto.City,
                Zip = orderDto.Zip,
                ShippingAddress = orderDto.ShippingAddress,
                ShippingMethod = orderDto.ShippingMethod,
                OrderDate = orderDate,
                Status = OrderStatus.Pending,
                DeliveryDueDate = CalculateDeliveryDueDate(orderDate, orderDto.ShippingMethod),
                OrderNumber = GenerateOrderNumber(),
                PaymentMethod = orderDto.PaymentMethod
            };

            foreach (var cartItem in cart.CartItems)
            {
                var product = await _productRepository.GetByIdAsync(cartItem.ProductId);
                if (product == null) continue;

                var unitPrice = Math.Round(product.FinalPrice, 2);

                order.OrderItems.Add(new OrderItem
                {
                    ProductId = cartItem.ProductId,
                    Quantity = cartItem.Quantity,
                    Price = unitPrice
                });

                product.StockQuantity -= cartItem.Quantity;
            }

            var subtotal = order.OrderItems.Sum(i => i.Price * i.Quantity);

            decimal shippingCost = orderDto.ShippingMethod switch
            {
                "standard" => 0m,
                "express" => 9.99m,
                "priority" => 49.99m,
                _ => throw new InvalidOperationException("Invalid shipping method")
            };

            var discountedSubtotal = subtotal;

            order.TotalAmount = order.OrderItems.Sum(i => i.Price * i.Quantity);

            if (!string.IsNullOrEmpty(orderDto.VoucherCode))
            {
                var validationResult = await _voucherService.ValidateVoucherAsync(orderDto.VoucherCode, userId);
                if (!validationResult.IsValid)
                    throw new InvalidOperationException(validationResult.Message);

                var voucher = validationResult.Voucher!;
                discountedSubtotal = Math.Round(order.TotalAmount * (1 - voucher.DiscountPercentage / 100m), 2);
                voucher.IsUsed = true;
                order.VoucherId = voucher.Id;
                order.Voucher = voucher;

                await _voucherService.UpdateVoucherAsync(voucher);
            }

            order.ShippingCost = shippingCost;
            order.TotalAmount = discountedSubtotal + shippingCost;

            var createdOrder = await _orderRepository.CreateAsync(order);

            await _cartRepository.ClearCartAsync(cart.Id);

            return createdOrder;
        }
        public async Task<Order> UpdateOrderStatusAsync(int id, OrderStatus status)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null) throw new ArgumentException("Order not found");

            order.Status = status;
            return await _orderRepository.UpdateAsync(order);
        }
        public async Task<Order?> CancelOrderAsync(int id)
        {
            var order = await _orderRepository.GetByIdAsync(id);
            if (order == null) return null;

            foreach (var item in order.OrderItems)
            {
                var product = await _productRepository.GetByIdAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity += item.Quantity;
                }
            }

            return await _orderRepository.DeleteAsync(id);
        }
        private string GenerateOrderNumber()
        {
            return $"ORD-{DateTime.Now:yyyyMMdd}-{Guid.NewGuid().ToString().Substring(0, 8).ToUpper()}";
        }

        private DateTime CalculateDeliveryDueDate(DateTime orderDate, string shippingMethod)
        {
            return shippingMethod switch
            {
                "standard" => orderDate.AddBusinessDays(7),
                "express" => orderDate.AddBusinessDays(5),
                "priority" => orderDate.AddBusinessDays(2),
                _ => orderDate.AddBusinessDays(7)
            };
        }
    }
}
