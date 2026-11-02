using CabinFit.Api.Data;
using CabinFit.Api.Models;
using CabinFit.Api.Repositories.IRespository;
using Microsoft.EntityFrameworkCore;

namespace CabinFit.Api.Repositories
{
    public class OrderRepository : IOrderRepository
    {
        private readonly ApplicationDbContext _dbContext;
        public OrderRepository(ApplicationDbContext context)
        {
            _dbContext = context;
        }
        public async Task<Order?> GetByIdAsync(int id)
        {
            return await _dbContext.Orders
                .Include(o => o.Voucher)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.Images)
                .Include(o => o.User)
                .FirstOrDefaultAsync(o => o.Id == id);
        }
        public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(string userId)
        {
            return await _dbContext.Orders
               .Include(o => o.Voucher)
               .Include(o => o.OrderItems)
               .ThenInclude(oi => oi.Product)
               .ThenInclude(p => p.Images)
               .Where(o => o.UserId == userId)
               .OrderByDescending(o => o.OrderDate)
               .ToListAsync();
        }
        public async Task<IEnumerable<Order>> GetAllAsync()
        {
            return await _dbContext.Orders
                .Include(o => o.Voucher)
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .ThenInclude(p => p.Images)
                .Include(o => o.User)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }
        public async Task<Order> CreateAsync(Order order)
        {
            await _dbContext.Orders.AddAsync(order);
            await _dbContext.SaveChangesAsync();
            return order;
        }
        public async Task<Order> UpdateAsync(Order order)
        {
            _dbContext.Orders.Update(order);
            await _dbContext.SaveChangesAsync();
            return order;
        }
        public async Task<Order?> DeleteAsync(int id)
        {
            var order = await _dbContext.Orders.FindAsync(id);
            if (order == null) return null;

            _dbContext.Orders.Remove(order);
            await _dbContext.SaveChangesAsync();
            return order;
        }
        public async Task<OrderItem> AddOrderItemAsync(OrderItem item)
        {
            await _dbContext.OrderItems.AddAsync(item);
            await _dbContext.SaveChangesAsync();
            return item;
        }
        public async Task<IEnumerable<Order>> GetPendingOrdersAsync()
        {
            return await _dbContext.Orders
                .Include(o => o.Voucher)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.Images)
                .Include(o => o.User)
                .Where(o => o.Status == OrderStatus.Pending)
                .OrderBy(o => o.OrderDate)
                .ToListAsync();
        }
        public async Task<IEnumerable<Order>> GetInDeliveryOrdersForDriverAsync(string driverId)
        {
            return await _dbContext.Orders
                .Include(o => o.Voucher)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.Images)
                .Include(o => o.User)
                .Where(o => o.Status == OrderStatus.InDelivery && o.DriverId == driverId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }
        public async Task<IEnumerable<Order>> GetDeliveredOrdersForDriverAsync(string driverId)
        {
            return await _dbContext.Orders
                .Include(o => o.Voucher)
                .Include(o => o.OrderItems)
                    .ThenInclude(oi => oi.Product)
                        .ThenInclude(p => p.Images)
                .Include(o => o.User)
                .Where(o => o.Status == OrderStatus.Delivered && o.DriverId == driverId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();
        }
    }
}
