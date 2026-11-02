namespace CabinFit.Api.Models.AuthRequestModels
{
    public class RefreshTokenRequest
    {
        public string JwtToken { get; set; } = string.Empty;
    }
}
