using CabinFit.Api.Models;
using CabinFit.Api.Models.AuthRequestModels;
using CabinFit.Api.Models.DTOs.UserDto;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace CabinFit.Api.Services.IService
{
    public interface IAuthService
    {
        Task<string> Login(LogInRequest request);
        Task<string> RefreshToken(User user);
        Task<IdentityResult> RegisterUser(SignInRequest request);
        public ClaimsPrincipal? GetTokenPrincipal(string token);
        public CurrentUser? GetCurrentUser();
        public Task<UserDto> GetUserDtoAsync();
        List<string> ValidatePassword(SignInRequest request);
        public Task<User> UpdateUserAsync(UpdateUserDto dto);
        public Task<bool> SendPasswordResetEmailAsync(string email, string resetLinkBase);
        public Task<IdentityResult> ResetPasswordAsync(string email, string token, string newPassword);
    }
}
