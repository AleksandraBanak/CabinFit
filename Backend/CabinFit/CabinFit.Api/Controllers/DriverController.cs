using CabinFit.Api.Models.DTOs.OrderDtos;
using CabinFit.Api.Models;
using CabinFit.Api.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace CabinFit.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = "Bearer", Roles = "driver")]
    public class DriverController : ControllerBase
    {
        private readonly IDriverOrderService _service;
        private readonly UserManager<User> _userManager;

        public DriverController(IDriverOrderService service, UserManager<User> userManager)
        {
            _service = service;
            _userManager = userManager;
        }

        [HttpGet("orders/pending")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> Pending()
            => Ok(await _service.GetPendingAsync());

        [HttpGet("orders/mine")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> Mine()
        {
            var driverId = _userManager.GetUserId(User)!;
            return Ok(await _service.GetMyInDeliveryAsync(driverId));
        }

        [HttpPost("orders/{id:int}/take")]
        public async Task<ActionResult<OrderDto>> Take(int id)
        {
            var driverId = _userManager.GetUserId(User)!;

            try { return Ok(await _service.TakeAsync(id, driverId)); }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpPost("orders/{id:int}/delivered")]
        public async Task<ActionResult<OrderDto>> Delivered(int id)
        {
            var driverId = _userManager.GetUserId(User)!;

            try { return Ok(await _service.MarkDeliveredAsync(id, driverId)); }
            catch (KeyNotFoundException ex) { return NotFound(new { message = ex.Message }); }
            catch (UnauthorizedAccessException) { return Forbid(); }
            catch (InvalidOperationException ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpGet("orders/delivered")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> DeliveredHistory()
        {
            var driverId = _userManager.GetUserId(User)!;
            return Ok(await _service.GetDeliveredAsync(driverId));
        }
    }
}
