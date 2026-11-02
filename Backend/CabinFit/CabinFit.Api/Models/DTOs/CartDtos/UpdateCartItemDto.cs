using System.ComponentModel.DataAnnotations;

namespace CabinFit.Api.Models.DTOs.CartDtos
{
    public class UpdateCartItemDto
    {
        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }
}
