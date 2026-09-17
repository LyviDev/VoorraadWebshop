using VoorraadWebshop.Core.Models;

namespace VoorraadWebshop.Core.Interfaces;

public interface IOrderRepository
{
    Task<List<Order>> GetAllAsync();
    Task<Order?> GetByIdAsync(int id);
    Task<Product?> GetProductByIdAsync(int productId);
    Task AddAsync(Order order);
    Task SaveChangesAsync();
}