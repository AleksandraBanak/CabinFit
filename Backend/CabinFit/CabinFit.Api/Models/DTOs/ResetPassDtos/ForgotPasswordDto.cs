using System.ComponentModel.DataAnnotations;

namespace CabinFit.Api.Models.DTOs.ResetPassDtos
{
    public class ForgotPasswordDto
    {
        [Required]
        public string Email { get; set; } = string.Empty;
    }
}
