using AutoMapper;
using CabinFit.Api.Models.DTOs.OrderDtos;
using CabinFit.Api.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CabinFit.Api.Exceptions;

namespace CabinFit.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(AuthenticationSchemes = "Bearer")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IMapper _mapper;
        private readonly IAuthService _authService;
        public OrderController(IOrderService orderService, IMapper mapper, IAuthService authService)
        {
            _orderService = orderService;
            _mapper = mapper;
            _authService = authService;
        }

        [HttpGet]
        [Route("/api/userOrders")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetUserOrders()
        {
            var userId = GetCurrentUserId();
            var orders = await _orderService.GetOrdersByUserIdAsync(userId);
            return Ok(_mapper.Map<IEnumerable<OrderDto>>(orders));
        }

        [HttpGet]
        [Route("/api/orders")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetAllOrders()
        {
            var orders = await _orderService.GetAllOrdersAsync();
            return Ok(_mapper.Map<IEnumerable<OrderDto>>(orders));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) throw new NotFoundException("The requested order does not exist or has been deleted"); 

            var userId = GetCurrentUserId();
            if (order.UserId != userId)
                return Forbid();

            return Ok(_mapper.Map<OrderDto>(order));
        }

        [HttpPost]
        public async Task<ActionResult<OrderDto>> CreateOrder([FromBody] CreateOrderDto createOrderDto)
        {
            var userId = GetCurrentUserId();

            try
            {
                var order = await _orderService.CreateOrderFromCartAsync(userId, createOrderDto);
                return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, _mapper.Map<OrderDto>(order));
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpPatch("{id}/status")]
        public async Task<ActionResult<OrderDto>> UpdateOrderStatus([FromRoute] int id,
            [FromBody] UpdateOrderStatusDto statusDto)
        {
            var order = await _orderService.UpdateOrderStatusAsync(id, statusDto.Status);
            return Ok(_mapper.Map<OrderDto>(order));
        }

        [HttpDelete("delete/{id}")]
        public async Task<ActionResult<OrderDto>> CancelOrder(int id)
        {
            var order = await _orderService.GetOrderByIdAsync(id);
            if (order == null) throw new NotFoundException("The requested order does not exist or has been deleted");

            var userId = GetCurrentUserId();
            if (order.UserId != userId)
                return Forbid();

            var deletedOrder = await _orderService.CancelOrderAsync(id);
            if (deletedOrder == null) throw new Exception("The order chould not be canceled");

            return Ok(_mapper.Map<OrderDto>(deletedOrder));
        }

        private string GetCurrentUserId()
        {
            var user = _authService.GetCurrentUser();

            return user?.Id ?? throw new UnauthorizedAccessException("User not authenticated");
        }
    }
}
