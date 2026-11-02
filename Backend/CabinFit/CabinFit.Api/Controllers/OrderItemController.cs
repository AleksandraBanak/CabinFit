using AutoMapper;
using CabinFit.Api.Models;
using CabinFit.Api.Models.DTOs.OrderDtos;
using CabinFit.Api.Models.DTOs.OrderItemDtos;
using CabinFit.Api.Services.IService;
using Microsoft.AspNetCore.Mvc;

namespace CabinFit.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemController : Controller
    {
        private readonly IOrderItemService _service;
        private readonly IMapper _mapper;

        public OrderItemController(IOrderItemService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItemDto>>> GetAll()
        {
            var orderItems = await _service.GetAllAsync();
            return Ok(_mapper.Map<IEnumerable<OrderItemDto>>(orderItems));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItemDto>> GetById(int id)
        {
            var item = await _service.GetByIdAsync(id);
            if (item == null) return NotFound();

            return Ok(_mapper.Map<OrderItemDto>(item));
        }

        [HttpPost]
        public async Task<ActionResult<OrderItemDto>> Create([FromBody] CreateOrderItemDto createOrderItemDto)
        {
            var orderItem = _mapper.Map<OrderItem>(createOrderItemDto);
            var created = await _service.CreateAsync(orderItem);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, _mapper.Map<OrderItemDto>(created));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<OrderItemDto>> Update(int id, [FromBody] UpdateOrderItemDto updateOrderItemDto)
        {
            var existingOrderItem = await _service.GetByIdAsync(id);
            if (existingOrderItem == null) return NotFound();

            _mapper.Map(updateOrderItemDto, existingOrderItem);
            var updatedOrderItem = await _service.UpdateAsync(existingOrderItem);

            return Ok(_mapper.Map<OrderItemDto>(updatedOrderItem));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<OrderItemDto>> Delete(int id)
        {
            var deletedOrderItem = await _service.DeleteAsync(id);
            if (deletedOrderItem == null) return NotFound();

            return Ok(_mapper.Map<OrderItemDto>(deletedOrderItem));
        }
    }
}
