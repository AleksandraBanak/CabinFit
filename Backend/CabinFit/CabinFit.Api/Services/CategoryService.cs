using CabinFit.Api.Models;
using CabinFit.Api.Repositories.IRespository;
using CabinFit.Api.Services.IService;

namespace CabinFit.Api.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _repository;

        public CategoryService(ICategoryRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Category> CreateCategoryAsync(Category category)
        {
            return await _repository.CreateAsync(category);
        }

        public async Task<Category?> UpdateCategoryAsync(Category category)
        {
            return await _repository.UpdateAsync(category);
        }

        public async Task<Category?> DeleteCategoryAsync(int id)
        {
            var existingCategory = await _repository.GetByIdAsync(id);
            if (existingCategory == null) return null;

            return await _repository.DeleteAsync(existingCategory);
        }
    }
}
