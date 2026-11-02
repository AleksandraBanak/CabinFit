using AutoMapper;
using CabinFit.Api.Models;
using CabinFit.Api.Models.DTOs.CartDtos;
using CabinFit.Api.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CabinFit.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class CartController : Controller
    {
        private readonly ICartService _cartService;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;

        public CartController(ICartService cartService, IMapper mapper, IAuthService authService)
        {
            _cartService = cartService;
            _mapper = mapper;
            _authService = authService;
        }

        [HttpGet]
        [Authorize(AuthenticationSchemes = "Bearer")]
        public async Task<ActionResult<CartDto>> GetCart()
        {
            var userId = GetCurrentUserId();
            var cart = await _cartService.GetCartByUserIdAsync(userId);
            var cartDto = _mapper.Map<CartDto>(cart);

            return Ok(cartDto);
        }

        [HttpPost("addItems")]
        public async Task<ActionResult<CartDto>> AddCartItem([FromBody] CreateCartItemDto createCartItemDto)
        {
            var userId = GetCurrentUserId();

            var cartItem = _mapper.Map<CartItem>(createCartItemDto);
            var updatedCart = await _cartService.AddCartItemAsync(userId, cartItem);

            return Ok(_mapper.Map<CartDto>(updatedCart));
        }

        [HttpPut("items/{itemId}")]
        public async Task<ActionResult<CartDto>> UpdateCartItem([FromRoute] int itemId,
            [FromBody] UpdateCartItemDto updateCartItemDto)
        {
            var userId = GetCurrentUserId();
            var cartItem = _mapper.Map<CartItem>(updateCartItemDto);

            var updatedCart = await _cartService.UpdateCartItemAsync(userId, itemId, cartItem);
            return Ok(_mapper.Map<CartDto>(updatedCart));
        }

        [HttpDelete("items/{itemId}")]
        public async Task<ActionResult<CartItemDto>> RemoveItem([FromRoute] int itemId)
        {
            var userId = GetCurrentUserId();
            var deletedCartItem = await _cartService.RemoveCartItemAsync(userId, itemId);
            if (deletedCartItem == null) return NotFound();

            return Ok(_mapper.Map<CartItemDto>(deletedCartItem));
        }

        [HttpDelete("clear")]
        public async Task<IActionResult> ClearCart()
        {
            var userId = GetCurrentUserId();
            var success = await _cartService.ClearCartAsync(userId);
            if(!success) return NotFound("The cart does not exist");

            return NoContent();
        }

        private string GetCurrentUserId()
        {
            var user = _authService.GetCurrentUser();

            return user?.Id ?? throw new UnauthorizedAccessException("User not authenticated");
        }
    }
}
