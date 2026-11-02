using CabinFit.Api.Models;

namespace CabinFit.Api.Repositories.IRespository
{
    public interface ICategoryRepository
    {
        Task<IEnumerable<Category>> GetAllAsync();
        Task<Category?> GetByIdAsync(int id);
        Task<Category> CreateAsync(Category category);
        Task<Category?> UpdateAsync(Category category);
        Task<Category> DeleteAsync(Category id);
    }
}
