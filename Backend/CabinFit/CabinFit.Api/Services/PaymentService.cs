using CabinFit.Api.Models;
using CabinFit.Api.Services.IService;
using Stripe.Checkout;

namespace CabinFit.Api.Services
{
    public class PaymentService : IPaymentService
    {
        public async Task<Session> CreateCheckoutSessionAsync(List<PaymentItem> items, string successUrl, string cancelUrl)
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = items.Select(i => new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        Currency = "eur",
                        UnitAmount = (long)(i.Price * 100), 
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = i.Name,
                            Images = i.Images
                        },
                    },
                    Quantity = i.Quantity,
                }).ToList(),
                Mode = "payment",
                SuccessUrl = successUrl,
                CancelUrl = cancelUrl
            };

            var service = new SessionService();
            var session = await service.CreateAsync(options);
            return session;
        }
    }
}
