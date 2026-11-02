using CabinFit.Api.Models;
using CabinFit.Api.Models.DTOs.ProductDtos;

namespace CabinFit.Api.Services.IService
{
    public interface IProductService
    {
        Task<PagedResult<Product>> GetAllProductsAsync(int page, int pageSize, ProductSort sort,
                  decimal? minPrice, decimal? maxPrice, int[]? categories,
                  string[]? sizes, string[]? colors, bool? onlyDiscount);
        Task<Product?> GetProductByIdAsync(int id);
        Task<Product> CreateProductAsync(Product product);
        Task<Product?> UpdateProductAsync(Product existingProduct, UpdateProductDto updatedProduct);
        Task<Product> UpdateProductAsync(Product product);
        Task<Product?> PatchProductAsync(int id, PatchProductDto patchDto);
        Task<Product?> DeleteProductAsync(int id);
        Task<Product> AddProductImageUrls(List<IFormFile> images, Product productToBeModified);
        void ClearExistingImages(Product product);
        Task<List<string>> GetAllColorsAsync();

    }
}
