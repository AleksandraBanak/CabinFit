using CabinFit.Api.Models;
using CabinFit.Api.Models.AuthRequestModels;
using CabinFit.Api.Models.DTOs.ResetPassDtos;
using CabinFit.Api.Models.DTOs.UserDto;
using CabinFit.Api.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace CabinFit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : Controller
    {
        private readonly UserManager<User> _userManager;
        private readonly IAuthService _authService;
        private readonly IOrderService _orderService;
        private readonly IVoucherService _voucherService;

        public AuthController(UserManager<User> userManager, IAuthService authService,
            IOrderService orderService, IVoucherService voucherService)
        {
            _userManager = userManager;
            _authService = authService;
            _orderService = orderService;
            _voucherService = voucherService;
        }

        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] SignInRequest request)
        {
            Voucher voucher;
            var errors = _authService.ValidatePassword(request);

            if (await _userManager.FindByNameAsync(request.UserName) != null)
                errors.Add("Username already exists.");
            if (await _userManager.FindByEmailAsync(request.Email) != null)
                errors.Add("Email already exists.");

            if (errors.Any())
                return BadRequest(new { Errors = errors });

            var result = await _authService.RegisterUser(request);

            if (!result.Succeeded)
            {
                errors.AddRange(result.Errors.Select(e => e.Description));
                return BadRequest(new { Errors = errors });
            }

            var user = await _userManager.FindByNameAsync(request.UserName);
            voucher = await _voucherService.CreateVoucherForUserAsync(user);

            return Ok(new
            {
                message = "Successfully registered",
                voucherCode = voucher.Code,
                discount = voucher.DiscountPercentage
            });
        }

        //[HttpPost("user")]
        //public async Task<IActionResult> Register([FromBody] SignInRequest request)
        //{
        //    var userExists = await _userManager.FindByNameAsync(request.UserName);
        //    if (userExists != null)
        //        return BadRequest("User already exists");

        //    if (await _authService.RegisterUser(request))
        //    {
        //        return Ok("Successfully done");
        //    }
        //    return BadRequest("Something went wrong");
        //}

        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LogInRequest request)
        {
            User identityUser;


            if (new EmailAddressAttribute().IsValid(request.UserName))
            {
                identityUser = await _userManager.FindByEmailAsync(request.UserName);
            }
            else
            {
                identityUser = await _userManager.FindByNameAsync(request.UserName);
            }

            if (identityUser is null || (await _userManager.CheckPasswordAsync(identityUser, request.Password)) == false)
            {
                return Unauthorized();
            }

            var token = await _authService.Login(request);

            return Ok(new
            {
                token = token
            });
        }

        [HttpPost("RefreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest jwtToken)
        {
            try
            {
                var refreshToken = Request.Cookies["refreshToken"];
                Console.WriteLine($"Refresh token cookie exists: {!string.IsNullOrEmpty(refreshToken)}");

                if (string.IsNullOrEmpty(refreshToken))
                {
                    Console.WriteLine("ERROR: Refresh token cookie missing");
                    return BadRequest("Refresh token is missing.");
                }

                Console.WriteLine("Validating principal...");
                var principal = _authService.GetTokenPrincipal(jwtToken.JwtToken);

                if (principal?.Identity?.Name is null)
                {
                    Console.WriteLine("ERROR: Invalid JWT - no principal identity");
                    return BadRequest("Invalid access token");
                }

                Console.WriteLine($"Looking for user: {principal.Identity.Name}");
                var identityUser = await _userManager.FindByNameAsync(principal.Identity.Name);

                if (identityUser is null)
                {
                    Console.WriteLine("ERROR: User not found");
                    return BadRequest("Invalid access token");
                }

                Console.WriteLine($"User found. Validating refresh token...");
                Console.WriteLine($"DB Token: {identityUser.RefreshToken?.Substring(0, 5)}...");
                Console.WriteLine($"Cookie Token: {refreshToken?.Substring(0, 5)}...");
                Console.WriteLine($"Token Expiry: {identityUser.RefreshTokenExpiry} (Now: {DateTime.Now})");

                if (identityUser.RefreshToken != refreshToken || identityUser.RefreshTokenExpiry < DateTime.Now)
                {
                    Console.WriteLine("ERROR: Refresh token mismatch or expired");
                    return BadRequest("Invalid access token or refresh token has expired");
                }

                Console.WriteLine("Generating new tokens...");
                var token = await _authService.RefreshToken(identityUser);
                Console.WriteLine("Refresh successful!");

                return Ok(new { token });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"EXCEPTION: {ex}");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("Logout")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> Logout()
        {
            var username = User.Identity?.Name;
            if (username == null)
                return Unauthorized();

            var user = await _userManager.FindByNameAsync(username);
            if (user != null)
            {
                user.RefreshToken = null;       
                user.RefreshTokenExpiry = null; 
                await _userManager.UpdateAsync(user);
            }

            Response.Cookies.Delete("refreshToken");

            return Ok("Logged out successfully");
        }

        [HttpGet("user")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> GetMyProfile()
        {
            var userDto = await _authService.GetUserDtoAsync();
            return Ok(userDto);
        }

        [HttpGet("verify")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public IActionResult VerifyToken()
        {
            return Ok(new { isValid = true });
        }

        [HttpPut("user")]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateUserDto dto)
        {
            User user = await _authService.UpdateUserAsync(dto);
            return NoContent();
        }

        [HttpPost("make-driver/{userName}")]
        [Authorize(Roles = "admin")]
        public async Task<IActionResult> MakeDriver(string userName)
        {
            var user = await _userManager.FindByNameAsync(userName);
            if (user == null) return NotFound();

            if (!await _userManager.IsInRoleAsync(user, "driver"))
                await _userManager.AddToRoleAsync(user, "driver");

            return Ok(new { message = $"{userName} is now a driver." });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordDto request)
        {
            var resetLinkBase = "https://localhost:5173/reset-password";
            var sent = await _authService.SendPasswordResetEmailAsync(request.Email, resetLinkBase);
            if (!sent)
                return NotFound(new { message = "User with this email does not exist." });
            return Ok(new { message = "Password reset email sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto request)
        {
            if (request.NewPassword != request.ConfirmPassword)
                return BadRequest(new { message = "Passwords do not match." });

            var result = await _authService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);
            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

            return Ok(new { message = "Password has been reset successfully." });
        }

    }
}
