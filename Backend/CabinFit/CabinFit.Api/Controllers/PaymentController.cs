using CabinFit.Api.Models;
using CabinFit.Api.Services.IService;
using Microsoft.AspNetCore.Mvc;

namespace CabinFit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly IPaymentService _paymentService;

        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [HttpPost("create-checkout-session")]
        public async Task<IActionResult> CreateCheckoutSession([FromBody] List<PaymentItem> items)
        {
            var successUrl = "https://localhost:5173/success";
            var cancelUrl = "https://localhost:5173/cancel";

            var session = await _paymentService.CreateCheckoutSessionAsync(items, successUrl, cancelUrl);
            return Ok(new { url = session.Url });
        }
    }

}
