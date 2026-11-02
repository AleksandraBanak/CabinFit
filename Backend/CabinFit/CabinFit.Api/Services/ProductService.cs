using AutoMapper;
using CabinFit.Api.Data;
using CabinFit.Api.Models;
using CabinFit.Api.Models.DTOs.ProductDtos;
using CabinFit.Api.Repositories.Interfaces;
using CabinFit.Api.Repositories.IRespository;
using CabinFit.Api.Services.IService;
using Microsoft.EntityFrameworkCore;

namespace CabinFit.Api.Services
{
    public class ProductService : IProductService
    {
        private readonly IProductRepository _repository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;
        private readonly ApplicationDbContext _dbContext;

        private readonly string _uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images");

        public ProductService(IProductRepository repository, IMapper mapper,
            ICategoryRepository categoryRepository, ApplicationDbContext context)
        {
            _repository = repository;
            _categoryRepository = categoryRepository;
            _mapper = mapper;
            _dbContext = context;
        }

        public async Task<PagedResult<Product>> GetAllProductsAsync(int page, int pageSize, ProductSort sort,
             decimal? minPrice = null,
             decimal? maxPrice = null,
             int[]? categories = null,
             string[]? sizes = null, string[]? colors = null, bool? onlyDiscount = null)
        {
            var query = _repository.GetAllQueryable();

            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice.Value);

            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice.Value);

            if (categories != null && categories.Any())
                query = query.Where(p => categories.Contains(p.CategoryId));

            if (sizes != null && sizes.Any())
            {
                query = query.Where(p =>
                    sizes.Any(label =>
                        (label == "Personal / Underseat" && p.Height >= 35.5m && p.Height <= 50.9m) ||
                        (label == "International Carry On" && p.Height >= 51m && p.Height <= 56m) ||
                        (label == "Medium Checked" && p.Height > 56m && p.Height <= 68.6m) ||
                        (label == "Large Checked" && p.Height > 68.6m && p.Height <= 76.2m) ||
                        (label == "Extra Large Checked" && p.Height > 76.2m)
                    )
                );
            }

            if (colors != null && colors.Any())
                query = query.Where(p => colors.Contains(p.Color));

            if (onlyDiscount == true)
                query = query.Where(p => p.DiscountPercentage > 0);

            query = sort switch
            {
                ProductSort.PriceAsc => query.OrderBy(p => p.Price).ThenBy(p => p.Id),
                ProductSort.PriceDesc => query.OrderByDescending(p => p.Price).ThenBy(p => p.Id),

                ProductSort.RatingDesc => query
                    .OrderByDescending(p => p.Ratings.Any()
                        ? p.Ratings.Average(r => r.Rating)
                        : 0).ThenBy(p => p.Id),

                ProductSort.SizeAsc => query
                    .OrderBy(p => p.Width * p.Height * p.Depth).ThenBy(p => p.Id),

                ProductSort.SizeDesc => query
                    .OrderByDescending(p => p.Width * p.Height * p.Depth).ThenBy(p => p.Id),

                ProductSort.BestSellers => query
                    .OrderByDescending(p => p.OrderItems.Sum(oi => oi.Quantity)).ThenBy(p => p.Id),

                _ => query.OrderBy(p => p.Id)
            };

            var minAvailablePrice = await _repository.GetAllQueryable().MinAsync(p => p.Price);
            var maxAvailablePrice = await _repository.GetAllQueryable().MaxAsync(p => p.Price);

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new PagedResult<Product>
            {
                Items = items,
                TotalCount = totalCount,
                MinPrice = minAvailablePrice,
                MaxPrice = maxAvailablePrice
            };

        }
        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }
        public async Task<Product> CreateProductAsync(Product product)
        {
            await _repository.CreateAsync(product);
            return product;
        }

        public async Task<Product?> UpdateProductAsync(Product existingProduct, UpdateProductDto updateProductDto)
        {
            _mapper.Map(updateProductDto, existingProduct);
            ClearExistingImages(existingProduct);

            if (updateProductDto.Images != null && updateProductDto.Images.Any())
            {
                await AddProductImageUrls(updateProductDto.Images, existingProduct);
            }

            await _repository.UpdateAsync(existingProduct);
            return existingProduct;
        }

        public async Task<Product> UpdateProductAsync(Product product)
        {
            await _repository.UpdateAsync(product);
            return product;
        }


        public async Task<Product?> PatchProductAsync(int id, PatchProductDto patchDto)
        {
            var existingProduct = await _repository.GetByIdAsync(id);
            if (existingProduct == null) return null;

            if (patchDto.Name != null)
                existingProduct.Name = patchDto.Name;

            if (patchDto.Description != null)
                existingProduct.Description = patchDto.Description;

            if (patchDto.Price.HasValue)
                existingProduct.Price = patchDto.Price.Value;

            if (patchDto.Width.HasValue)
                existingProduct.Width = patchDto.Width.Value;

            if (patchDto.Height.HasValue)
                existingProduct.Height = patchDto.Height.Value;

            if (patchDto.Depth.HasValue)
                existingProduct.Depth = patchDto.Depth.Value;

            if (patchDto.StockQuantity.HasValue)
                existingProduct.StockQuantity = patchDto.StockQuantity.Value;

            if (patchDto.Color != null)
                existingProduct.Color = patchDto.Color;

            if (patchDto.CategoryId.HasValue)
                existingProduct.CategoryId = patchDto.CategoryId.Value;

            if (patchDto.DiscountPercentage.HasValue)
                existingProduct.DiscountPercentage = patchDto.DiscountPercentage.Value;

            if (patchDto.Images != null && patchDto.Images.Any())
            {
                ClearExistingImages(existingProduct);
                await AddProductImageUrls(patchDto.Images, existingProduct);
            }

            await _repository.UpdateAsync(existingProduct);
            return existingProduct;
        }
        public async Task<Product?> DeleteProductAsync(int id)
        {
            var existingProduct = await _repository.GetByIdAsync(id);
            if (existingProduct == null) return null;

            var deletedProduct = new Product
            {
                Id = existingProduct.Id,
                Name = existingProduct.Name,
                Description = existingProduct.Description,
                Price = existingProduct.Price,
                Images = existingProduct.Images?.Select(i => new ProductImage { Url = i.Url }).ToList()!,
                Width = existingProduct.Width,
                Height = existingProduct.Height,
                Depth = existingProduct.Depth,
                StockQuantity = existingProduct.StockQuantity,
                Color = existingProduct.Color,
                CategoryId = existingProduct.CategoryId,
                Category = existingProduct.Category,
                DiscountPercentage = existingProduct.DiscountPercentage
            };

            ClearExistingImages(existingProduct);

            await _repository.DeleteAsync(existingProduct);

            return deletedProduct;
        }
        public async Task<Product> AddProductImageUrls(List<IFormFile> images, Product productToBeModified)
        {
            if (!Directory.Exists(_uploadsFolder))
                Directory.CreateDirectory(_uploadsFolder);

            foreach (var file in images)
            {
                var timestamp = DateTime.UtcNow.ToString("yyyyMMdd_HHmmssfff");
                var extension = Path.GetExtension(file.FileName);
                var uniqueFileName = $"{productToBeModified.Id}_{timestamp}{extension}";

                var filePath = Path.Combine(_uploadsFolder, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                productToBeModified.Images.Add(new ProductImage { Url = $"/images/{uniqueFileName}" });
            }

            return productToBeModified;
        }

        public void ClearExistingImages(Product product)
        {
            if (product.Images == null || !product.Images.Any())
                return;

            foreach (var oldImage in product.Images)
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", oldImage.Url.TrimStart('/'));
                if (File.Exists(filePath))
                    File.Delete(filePath);
            }

            _dbContext.ProductImages.RemoveRange(product.Images);

            product.Images.Clear();
        }

        public async Task<List<string>> GetAllColorsAsync()
        {
            return await _repository.GetAllColorsAsync();
        }

    }
}
