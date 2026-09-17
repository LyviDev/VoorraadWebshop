using Microsoft.EntityFrameworkCore;
using VoorraadWebshop.Core.Interfaces;
using VoorraadWebshop.Core.Models;
using VoorraadWebshop.Infrastructure.Data;

namespace VoorraadWebshop.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly AppDbContext _context;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Order>> GetAllAsync()
    {
        return await _context.Orders
            .Include(o => o.Klant)
            .Include(o => o.OrderRegels)
                .ThenInclude(r => r.Product)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _context.Orders
            .Include(o => o.Klant)
            .Include(o => o.OrderRegels)
                .ThenInclude(r => r.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<Product?> GetProductByIdAsync(int productId)
    {
        return await _context.Producten.FindAsync(productId);
    }

    public async Task AddAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
    }

    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
}