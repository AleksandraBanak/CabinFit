using CabinFit.Api.Data;
using CabinFit.Api.Models;
using CabinFit.Api.Repositories.IRespository;
using Microsoft.EntityFrameworkCore;

namespace CabinFit.Api.Repositories
{
    public class OrderItemRepository : IOrderItemRepository
    {
        private readonly ApplicationDbContext _dbContext;

        public OrderItemRepository(ApplicationDbContext context)
        {
            _dbContext = context;
        }

        public async Task<IEnumerable<OrderItem>> GetAllAsync()
        {
            return await _dbContext.OrderItems.Include(o => o.Product).ToListAsync();
        }

        public async Task<OrderItem?> GetByIdAsync(int id)
        {
            return await _dbContext.OrderItems.Include(o => o.Product).FirstOrDefaultAsync(x => x.Id == id);
        }
        public async Task<OrderItem> CreateAsync(OrderItem orderItem)
        {
            _dbContext.OrderItems.Add(orderItem);
            await _dbContext.SaveChangesAsync();
            return orderItem;
        }

        public async Task<OrderItem> UpdateAsync(OrderItem orderItem)
        {
            _dbContext.OrderItems.Update(orderItem);
            await _dbContext.SaveChangesAsync();

            return orderItem;
        }

        public async Task<OrderItem> DeleteAsync(OrderItem orderItem)
        {
            _dbContext.OrderItems.Remove(orderItem);
            await _dbContext.SaveChangesAsync();

            return orderItem;
        }
    }
}
