using CabinFit.Api.Models;

namespace CabinFit.Api.Services.IService
{
    public interface IVoucherService
    {
        Task<Voucher> CreateVoucherForUserAsync(User user);
        Task<VoucherValidationResult> ValidateVoucherAsync(string code, string userId);
        Task<Voucher> UpdateVoucherAsync(Voucher voucher);
        Task<List<VoucherDto>> GetAllVouchersForUserAsync(string userId);
    }
}
