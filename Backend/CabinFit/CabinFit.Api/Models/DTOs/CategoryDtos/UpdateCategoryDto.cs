using System.ComponentModel.DataAnnotations;

namespace CabinFit.Api.Models.DTOs.CategoryDtos
{
    public class UpdateCategoryDto
    {
        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;
    }
}
