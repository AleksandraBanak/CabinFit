using CabinFit.Api.Models;

namespace CabinFit.Api.Services.IService
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Category?> GetCategoryByIdAsync(int id);
        Task<Category> CreateCategoryAsync(Category categoryDto);
        Task<Category?> UpdateCategoryAsync(Category categoryDto);
        Task<Category?> DeleteCategoryAsync(int id);
    }
}
