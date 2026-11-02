using AutoMapper;
using CabinFit.Api.Models;
using CabinFit.Api.Models.DTOs.ProductDtos;
using CabinFit.Api.Services.IService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CabinFit.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly IProductService _service;
        private readonly ICategoryService _categoryService;

        public ProductController(IMapper mapper, IProductService service, ICategoryService categoryService)
        {
            _mapper = mapper;
            _service = service;
            _categoryService = categoryService; 
        }


        [HttpGet]
        public async Task<ActionResult<PagedResult<ProductDto>>> GetAll(
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 3,
            [FromQuery] ProductSort sort = ProductSort.None,
            [FromQuery] decimal? minPrice = null, [FromQuery] decimal? maxPrice = null,
            [FromQuery] int[]? categories = null,
            [FromQuery] string[]? sizes = null, [FromQuery] string[]? colors = null,
            [FromQuery] bool onlyDiscount = false)
         {
            var result = await _service.GetAllProductsAsync(page, pageSize, sort, minPrice, maxPrice, categories, sizes, colors, onlyDiscount);

            return Ok(new PagedResult<ProductDto>
            {
                Items = _mapper.Map<IEnumerable<ProductDto>>(result.Items),
                TotalCount = result.TotalCount,
                MinPrice = result.MinPrice,
                MaxPrice = result.MaxPrice
            });
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            var product = await _service.GetProductByIdAsync(id);
            if (product == null) return NotFound();

            return Ok(_mapper.Map<ProductDto>(product));
        }

        [HttpPost]
        public async Task<ActionResult<ProductDto>> Create([FromForm] CreateProductDto createProductDto)
        {
            var category = await _categoryService.GetCategoryByIdAsync(createProductDto.CategoryId);
            if (category == null) return BadRequest("Invalid CategoryId. Category not found.");

            var createdProduct = await _service.CreateProductAsync(_mapper.Map<Product>(createProductDto));
            createdProduct.Category = category;

            if (createProductDto.Images != null && createProductDto.Images.Any())
            {
                createdProduct = await _service.AddProductImageUrls(createProductDto.Images, createdProduct);
                await _service.UpdateProductAsync(createdProduct);
            }

            return CreatedAtAction(nameof(GetById), new { id = createdProduct.Id }, _mapper.Map<ProductDto>(createdProduct));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ProductDto>> Update([FromRoute] int id, [FromForm] UpdateProductDto updateProductDto)
        {
            var existingProduct = await _service.GetProductByIdAsync(id);

            if (existingProduct == null)
                return NotFound($"The product with id {id} does not exist");

            var updatedProduct = await _service.UpdateProductAsync(existingProduct, updateProductDto);
            if (updatedProduct == null) return NotFound();

            return Ok(_mapper.Map<ProductDto>(updatedProduct));
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<ProductDto>> Patch(int id, [FromForm] PatchProductDto patchDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var updatedProduct = await _service.PatchProductAsync(id, patchDto);
            if (updatedProduct == null) return NotFound();

            return Ok(_mapper.Map<ProductDto>(updatedProduct));
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<ProductDto>> Delete(int id)
        {
            var deletedProduct = await _service.DeleteProductAsync(id);
            if (deletedProduct == null) return NotFound();

            return Ok(_mapper.Map<ProductDto>(deletedProduct)); 
        }

        [HttpGet("colors")]
        public async Task<IActionResult> GetColors()
        {
            var colors = await _service.GetAllColorsAsync();
            return Ok(colors);
        }


    }
}
