using CabinFit.Api.Models;
using CabinFit.Api.Repositories.IRespository;
using CabinFit.Api.Services.IService;

namespace CabinFit.Api.Services
{
    public class VoucherService : IVoucherService
    {
        private readonly IVoucherRepository _voucherRepository;
        public VoucherService(IVoucherRepository voucherRepository)
        {
            _voucherRepository = voucherRepository;
        }

        public async Task<Voucher> CreateVoucherForUserAsync(User user)
        {
            var voucher = new Voucher
            {
                Code = Guid.NewGuid().ToString("N").Substring(0, 8).ToUpper(),
                DiscountPercentage = 10,
                ExpiryDate = DateTime.UtcNow.AddMonths(2),
                IsUsed = false,
                UserId = user.Id
            };
            return await _voucherRepository.CreateAsync(voucher);
        }

        public async Task<VoucherValidationResult> ValidateVoucherAsync(string code, string userId)
        {
            var voucher = await _voucherRepository.GetByCodeAsync(code);
            if (voucher == null)
                return new VoucherValidationResult { IsValid = false, Message = "Voucher not found." };
            if (voucher.UserId != userId)
                return new VoucherValidationResult { IsValid = false, Message = "Voucher does not belong to this user." };
            if (voucher.IsUsed)
                return new VoucherValidationResult { IsValid = false, Message = "Voucher has already been used." };
            if (voucher.ExpiryDate < DateTime.UtcNow)
                return new VoucherValidationResult { IsValid = false, Message = "Voucher has expired." };

            return new VoucherValidationResult { IsValid = true, Voucher = voucher };
        }
        public async Task<Voucher> UpdateVoucherAsync(Voucher voucher)
        {
            return await _voucherRepository.UpdateAsync(voucher);
        }
        public async Task<List<VoucherDto>> GetAllVouchersForUserAsync(string userId)
        {
            var vouchers = await _voucherRepository.GetAllByUserIdAsync(userId);

            return vouchers.Select(v => new VoucherDto
            {
                Code = v.Code,
                DiscountPercentage = v.DiscountPercentage,
                ExpiryDate = v.ExpiryDate,
                IsUsed = v.IsUsed
            }).ToList();
        }
    }

}
