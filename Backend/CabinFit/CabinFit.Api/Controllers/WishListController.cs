using CabinFit.Api.Models;
using CabinFit.Api.Models.DTOs.WishListItemDtos;
using CabinFit.Api.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CabinFit.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class WishListController : ControllerBase
    {
        private readonly IWishListService _service;

        public WishListController(IWishListService service)
        {
            _service = service;
        }

        private string GetUserId() => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WishListItemDto>>> GetMyWishlist()
        {
            var items = await _service.GetUserWishlistAsync(GetUserId());
            return Ok(items);
        }

        [HttpPost("{productId}")]
        public async Task<ActionResult<WishListItemDto>> AddToWishlist(int productId)
        {
            try
            {
                var result = await _service.AddToWishlistAsync(GetUserId(), productId);

                if (result == null)
                    return BadRequest(new { message = "Product is already in the wishlist." });

                return Ok(result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [HttpDelete("{productId}")]
        public async Task<IActionResult> RemoveFromWishlist(int productId)
        {
            var result = await _service.RemoveFromWishlistAsync(GetUserId(), productId);

            if (result == null)
                return NotFound(new { message = "Wishlist item not found." });

            return Ok(new { message = "Item removed from the wishlist." });
        }

        [HttpGet("contains/{productId}")]
        public async Task<IActionResult> IsInWishlist(int productId)
        {
            var exists = await _service.IsInWishlistAsync(GetUserId(), productId);
            return Ok(exists);
        }
    }

}
