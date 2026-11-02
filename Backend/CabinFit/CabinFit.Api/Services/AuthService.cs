using CabinFit.Api.Data;
using CabinFit.Api.Models;
using CabinFit.Api.Models.AuthRequestModels;
using CabinFit.Api.Models.DTOs.UserDto;
using CabinFit.Api.Services.IService;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.WebUtilities;
using System.ComponentModel.DataAnnotations;

namespace CabinFit.Api.Services
{
    public class AuthService : IAuthService
    {
        private readonly UserManager<User> _userManager;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ApplicationDbContext _dbContext;
        public AuthService(UserManager<User> userManager, IConfiguration config,
            IHttpContextAccessor httpContextAccessor, ApplicationDbContext context)
        {
            _userManager = userManager;
            _config = config;
            _httpContextAccessor = httpContextAccessor;
            _dbContext = context;
        }

        public async Task<IdentityResult> RegisterUser(SignInRequest request)
        {
            var identityUser = new User
            {
                UserName = request.UserName,
                Email = request.Email,
                FirstName = request.FirstName,
                LastName = request.LastName,
                PhoneNumber = request.PhoneNumber,
                SecurityStamp = Guid.NewGuid().ToString()
            };

            var result = await _userManager.CreateAsync(identityUser, request.Password);

            if (result.Succeeded && request.Email.StartsWith("admin@cabinFit"))
            {
                await _userManager.AddToRoleAsync(identityUser, "admin");
            }

            if (result.Succeeded && request.Email.StartsWith("driver@cabinFit"))
            {
                await _userManager.AddToRoleAsync(identityUser, "driver");
            }

            else if (result.Succeeded && !await _userManager.IsInRoleAsync(identityUser, "user"))
            {
                await _userManager.AddToRoleAsync(identityUser, "user");
            }

            return result;
        }


        public async Task<string> Login(LogInRequest request)
        {
            User? identityUser;

            if (new EmailAddressAttribute().IsValid(request.UserName))
            {
                identityUser = await _userManager.FindByEmailAsync(request.UserName);
            }
            else
            {
                identityUser = await _userManager.FindByNameAsync(request.UserName);
            }


            string accessToken = await this.GenerateTokenString(identityUser);

            identityUser.RefreshToken = this.GenerateRefreshTokenString();
            identityUser.RefreshTokenExpiry = DateTime.Now.AddHours(24);
            await _userManager.UpdateAsync(identityUser);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true, 
                Expires = identityUser.RefreshTokenExpiry,
                SameSite = SameSiteMode.None,
                Path = "/" 
            };

            _httpContextAccessor.HttpContext!.Response.Cookies.Append("refreshToken", identityUser.RefreshToken, cookieOptions);

            return accessToken;
        }

        public async Task<string> RefreshToken(User identityUser)
        {
            string accessToken = await this.GenerateTokenString(identityUser);

            identityUser.RefreshToken = this.GenerateRefreshTokenString();
            identityUser.RefreshTokenExpiry = DateTime.Now.AddDays(7);
            await _userManager.UpdateAsync(identityUser);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.None,
                Expires = identityUser.RefreshTokenExpiry,
                Path = "/"
            };

            _httpContextAccessor.HttpContext!.Response.Cookies.Append("refreshToken", identityUser.RefreshToken, cookieOptions);

            return accessToken;
        }


            public static bool DebugJWTIssuer(string token, string expectedIssuer)
            {
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(token);

                var issuer = jwtToken.Issuer;

                Console.WriteLine("=== JWT Issuer Debug ===");
                Console.WriteLine($"Token issuer (iss): {issuer}");
                Console.WriteLine($"Expected issuer: {expectedIssuer}");

                if (string.IsNullOrEmpty(issuer))
                {
                    Console.WriteLine("Problem: Token has no issuer claim");
                    return false;
                }

                Console.WriteLine("\nComparison:");
                Console.WriteLine($"Exact match: {issuer == expectedIssuer}");
                Console.WriteLine($"Token length: {issuer.Length}");
                Console.WriteLine($"Expected length: {expectedIssuer.Length}");
                Console.WriteLine($"Case match: {issuer.ToLower() == expectedIssuer.ToLower()}");

                if (issuer.TrimEnd('/') == expectedIssuer.TrimEnd('/'))
                {
                    Console.WriteLine("Issue: Trailing slash mismatch");
                }

                var tokenNoProtocol = issuer.Replace("https://", "").Replace("http://", "");
                var expectedNoProtocol = expectedIssuer.Replace("https://", "").Replace("http://", "");

                if (tokenNoProtocol == expectedNoProtocol)
                {
                    Console.WriteLine("Issue: Protocol mismatch (http vs https)");
                }

                return issuer == expectedIssuer;
            }

        public ClaimsPrincipal? GetTokenPrincipal(string token)
        {
            Console.WriteLine($"Raw token: {token}");
            DebugJWTIssuer(token, "https://localhost:7203");

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetSection("Jwt:Key").Value!));

            var handler = new JwtSecurityTokenHandler();

            var jwt = handler.ReadJwtToken(token);
            Console.WriteLine("---- TOKEN CLAIMS ----");

            foreach (var claim in jwt.Claims)
            {
                Console.WriteLine($"{claim.Type} : {claim.Value}");
            }

            Console.WriteLine("----------------------");

            var issuer = _config["Jwt:Issuer"];
            var validation = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidAudience = _config["Jwt:Audience"],
                ValidIssuer = _config["Jwt:Issuer"],
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)),
                ValidateLifetime = false 
            };
            try
            {
                var principal = new JwtSecurityTokenHandler().ValidateToken(token, validation, out _);
                return principal;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return null;
            }
        }

        private async Task<string> GenerateTokenString(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName!),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), 
                new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString()) 
            };

            var roles = await _userManager.GetRolesAsync(user);
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(30),
                Issuer = _config["Jwt:Issuer"],
                Audience = _config["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key),
                    SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            var accessToken = tokenHandler.WriteToken(token);

            var parsed = tokenHandler.ReadJwtToken(accessToken);

            return accessToken;
        }

        private string GenerateRefreshTokenString()
        {
            var randomNumber = new byte[64];

            using (var numberGenerator = RandomNumberGenerator.Create())
            {
                numberGenerator.GetBytes(randomNumber);
            }

            return Convert.ToBase64String(randomNumber);
        }

        public CurrentUser? GetCurrentUser()
        {
            var user = _httpContextAccessor.HttpContext?.User;
            if (user == null)
            {
                throw new InvalidOperationException("User context is not present");
            }

            var userId = user.FindFirst(c => c.Type == ClaimTypes.NameIdentifier)!.Value;
            var userName = user.FindFirst(c => c.Type == ClaimTypes.Name)!.Value;
            var roles = user.Claims.Where(c => c.Type == ClaimTypes.Role)!.Select(c => c.Value);

            return new CurrentUser(userId, userName, roles);
        }

        public async Task<UserDto> GetUserDtoAsync()
        {
            var currentUser = GetCurrentUser();
            if (currentUser == null)
                throw new UnauthorizedAccessException("User is not authenticated");

            var user = await _userManager.FindByIdAsync(currentUser.Id);

            return new UserDto
            {
                UserName = user.UserName,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user?.PhoneNumber,
                Roles = currentUser.Roles
            };
        }

        public List<string> ValidatePassword(SignInRequest request)
        {
            var errors = new List<string>();

            if (string.IsNullOrWhiteSpace(request.Password))
                errors.Add("Password is required.");
            else
            {
                if (request.Password.Length < 8)
                    errors.Add("Password must be at least 8 characters long.");
                if (!request.Password.Any(char.IsUpper))
                    errors.Add("Password must contain at least one uppercase letter.");
                if (!request.Password.Any(char.IsLower))
                    errors.Add("Password must contain at least one lowercase letter.");
                if (!request.Password.Any(char.IsDigit))
                    errors.Add("Password must contain at least one digit.");
                if (!request.Password.Any(ch => !char.IsLetterOrDigit(ch)))
                    errors.Add("Password must contain at least one special character.");
            }

            if (request.Password != request.ConfirmPassword)
                errors.Add("Passwords do not match.");

            return errors;
        }

        public async Task<User> UpdateUserAsync(UpdateUserDto dto)
        {
            var currentUser = GetCurrentUser();
            if (currentUser == null)
            {
                throw new UnauthorizedAccessException("User is not authenticated");
            }

            var user = await _userManager.FindByIdAsync(currentUser.Id);
            if (user == null)
            {
                throw new InvalidOperationException($"User with ID '{currentUser.Id}' not found.");
            }

            user.FirstName = dto.FirstName;
            user.LastName = dto.LastName;
            user.PhoneNumber = dto.PhoneNumber;
            user.Email = dto.Email;
            user.UserName = dto.UserName;

            await _userManager.UpdateAsync(user);

            return user;
        }

        public async Task<bool> SendPasswordResetEmailAsync(string email, string resetLinkBase)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return false;

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var tokenEncoded = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var resetLink = $"{resetLinkBase}?email={WebUtility.UrlEncode(email)}&token={tokenEncoded}";

            var smtpSection = _config.GetSection("EmailConfiguration");
            var smtpClient = new SmtpClient(smtpSection["Host"], int.Parse(smtpSection["Port"]!))
            {
                Credentials = new NetworkCredential(smtpSection["User"], smtpSection["Password"]),
                EnableSsl = bool.Parse(smtpSection["EnableSsl"]!)
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(smtpSection["User"]!),
                Subject = "CabinFit Password Reset",
                Body = $"Click the link to reset your password: {resetLink}",
                IsBodyHtml = false
            };
            mailMessage.To.Add(email);

            await smtpClient.SendMailAsync(mailMessage);
            return true;
        }

        public async Task<IdentityResult> ResetPasswordAsync(string email, string token, string newPassword)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
                return IdentityResult.Failed(new IdentityError { Description = "Your attempt was not successful." });

            var decodedToken = Encoding.UTF8.GetString(WebEncoders.Base64UrlDecode(token));
            return await _userManager.ResetPasswordAsync(user, decodedToken, newPassword);
        }
    }
}


