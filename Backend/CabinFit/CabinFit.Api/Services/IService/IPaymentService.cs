using CabinFit.Api.Models;
using Stripe.Checkout;

namespace CabinFit.Api.Services.IService
{
    public interface IPaymentService
    {
        Task<Session> CreateCheckoutSessionAsync(List<PaymentItem> items, string successUrl, string cancelUrl);
    }
}
