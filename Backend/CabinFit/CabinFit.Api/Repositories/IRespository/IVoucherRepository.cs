using CabinFit.Api.Models;

namespace CabinFit.Api.Repositories.IRespository
{
    public interface IVoucherRepository
    {
        Task<Voucher> CreateAsync(Voucher voucher);
        Task<Voucher?> GetByCodeAsync(string code);
        Task<Voucher> UpdateAsync(Voucher voucher);
        Task<List<Voucher>> GetAllByUserIdAsync(string userId);
    }
}
