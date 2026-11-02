using System.ComponentModel.DataAnnotations;

namespace CabinFit.Api.Models.DTOs.RatingDtos
{
    public class SetRatingDto
    {
        [Range(1, 5, ErrorMessage = "Rating must be between 1 and 5.")]
        public int Rating { get; set; }
    }
}
