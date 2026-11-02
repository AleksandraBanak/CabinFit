using CabinFit.Api.Models.DTOs.RatingDtos;
using CabinFit.Api.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CabinFit.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class RatingController : ControllerBase
    {
        private readonly IRatingService _ratingService;
        private readonly IAuthService _authService;

        public RatingController(IRatingService ratingService, IAuthService authService)
        {
            _ratingService = ratingService;
            _authService = authService;
        }

        // POST: api/rating/{productId}
        [HttpPost("{productId}")]
        public async Task<IActionResult> SetRating(int productId, [FromBody] SetRatingDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var currentUser = _authService.GetCurrentUser();

            await _ratingService.SetRatingAsync(productId, currentUser!.Id, dto.Rating);

            return NoContent();
        }

        // GET: api/rating/{productId}/me
        [HttpGet("{productId:int}/me")]
        public async Task<ActionResult<int?>> GetMyRating(int productId)
        {
            var currentUser = _authService.GetCurrentUser();

            var rating = await _ratingService.GetMyRatingAsync(productId, currentUser!.Id);
            return Ok(rating);
        }

        // GET: api/rating/{productId}/summary
        [AllowAnonymous]
        [HttpGet("{productId:int}/summary")]
        public async Task<ActionResult<ProductRatingSummaryDto>> GetSummary(int productId)
        {
            var summary = await _ratingService.GetSummaryAsync(productId);
            return Ok(summary);
        }
    }
}
