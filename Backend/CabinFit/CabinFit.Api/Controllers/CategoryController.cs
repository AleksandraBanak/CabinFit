using AutoMapper;
using CabinFit.Api.Models.DTOs.CategoryDtos;
using CabinFit.Api.Models;
using CabinFit.Api.Services.IService;
using Microsoft.AspNetCore.Mvc;

namespace CabinFit.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _service;
        private readonly IMapper _mapper;

        public CategoryController(ICategoryService service, IMapper mapper)
        {
            _service = service;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetAll()
        {
            var categories = await _service.GetAllCategoriesAsync();
            return Ok(_mapper.Map<IEnumerable<CategoryDto>>(categories));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetById(int id)
        {
            var category = await _service.GetCategoryByIdAsync(id);
            if (category == null) return NotFound();
            return Ok(_mapper.Map<CategoryDto>(category));
        }

        [HttpPost]
        public async Task<ActionResult<CategoryDto>> Create([FromBody] CreateCategoryDto createCategoryDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var category = _mapper.Map<Category>(createCategoryDto);
            var created = await _service.CreateCategoryAsync(category);

            return CreatedAtAction(nameof(GetById), new { id = created.Id }, _mapper.Map<CategoryDto>(created));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CategoryDto?>> Update([FromRoute] int id, [FromBody] UpdateCategoryDto updateCategoryDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var existingCategory = await _service.GetCategoryByIdAsync(id);
            if (existingCategory == null) return NotFound();

            _mapper.Map(updateCategoryDto, existingCategory);


            var updated = await _service.UpdateCategoryAsync(existingCategory);

            return Ok(_mapper.Map<CategoryDto>(updated));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<CategoryDto>> Delete(int id)
        {
            var deletedProduct = await _service.DeleteCategoryAsync(id);
            if (deletedProduct == null) return NotFound();

            return Ok(_mapper.Map<CategoryDto>(deletedProduct));
        }
    }
}
