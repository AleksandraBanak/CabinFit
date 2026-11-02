using System.ComponentModel.DataAnnotations;

namespace CabinFit.Api.Models.AuthRequestModels
{
    public class LogInRequest
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Password { get; set; } 
    }
}
