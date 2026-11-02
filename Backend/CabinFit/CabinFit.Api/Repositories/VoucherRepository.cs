using CabinFit.Api.Data;
using CabinFit.Api.Models;
using CabinFit.Api.Repositories.IRespository;
using Microsoft.EntityFrameworkCore;

namespace CabinFit.Api.Repositories
{
    public class VoucherRepository : IVoucherRepository
    {
        private readonly ApplicationDbContext _dbContext;
        public VoucherRepository(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<Voucher> CreateAsync(Voucher voucher)
        {
            _dbContext.Vouchers.Add(voucher);
            await _dbContext.SaveChangesAsync();
            return voucher;
        }
        public async Task<Voucher?> GetByCodeAsync(string code)
        {
            return await _dbContext.Vouchers.FirstOrDefaultAsync(v => v.Code == code);
        }
        public async Task<Voucher> UpdateAsync(Voucher voucher)
        {
            _dbContext.Vouchers.Update(voucher);
            await _dbContext.SaveChangesAsync();
            return voucher;
        }
        public async Task<List<Voucher>> GetAllByUserIdAsync(string userId)
        {
            return await _dbContext.Vouchers
                .Where(v => v.UserId == userId)
                .ToListAsync();
        }
    }
}
