using System.ComponentModel.DataAnnotations;

namespace CabinFit.Api.Models.DTOs.CartDtos
{
    public class CreateCartItemDto
    {
        [Required]
        public int ProductId { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }
    }
}
