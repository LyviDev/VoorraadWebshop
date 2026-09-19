using VoorraadWebshop.Core.DTOs;
using VoorraadWebshop.Core.Models;

namespace VoorraadWebshop.Core.Interfaces;

public interface IOrderService
{
    Task<List<Order>> GetAllAsync();
    Task<Order?> GetByIdAsync(int id);
    Task<Order> PlaatsOrderAsync(OrderAanmakenDto dto);
    Task UpdateStatusAsync(int orderId, OrderStatus nieuweStatus);
}