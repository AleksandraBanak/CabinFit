using AutoMapper;
using CabinFit.Api.Models;
using CabinFit.Api.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CabinFit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VoucherController : ControllerBase
    {
        private readonly IVoucherService _voucherService;
        private readonly IMapper _mapper;

        public VoucherController(IVoucherService voucherService, IMapper mapper)
        {
            _voucherService = voucherService;
            _mapper = mapper;
        }

        [HttpGet("my")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetUserVouchers()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var vouchers = await _voucherService.GetAllVouchersForUserAsync(userId);
            return Ok(vouchers);
        }

        [HttpPost("validate")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<VoucherDto>> ValidateVoucher([FromBody] ValidateVoucherRequest request)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
                return Unauthorized();

            var result = await _voucherService.ValidateVoucherAsync(request.VoucherCode, userId);

            if (!result.IsValid)
                return BadRequest(new { message = result.Message });

            var voucherDto = _mapper.Map<VoucherDto>(result.Voucher);
            return Ok(new
            {
                message = "Your voucher is valid!",
                voucher = voucherDto
            });
        }

    }

}
