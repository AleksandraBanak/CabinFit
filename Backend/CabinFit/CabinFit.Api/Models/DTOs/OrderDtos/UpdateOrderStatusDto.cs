using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace CabinFit.Api.Models.DTOs.OrderDtos
{
    public class UpdateOrderStatusDto
    {
        [Required]
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public OrderStatus Status { get; set; }
    }
}
