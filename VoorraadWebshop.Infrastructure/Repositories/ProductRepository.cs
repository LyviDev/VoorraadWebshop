using Microsoft.EntityFrameworkCore;
using VoorraadWebshop.Core.Interfaces;
using VoorraadWebshop.Core.Models;
using VoorraadWebshop.Infrastructure.Data;

namespace VoorraadWebshop.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly AppDbContext _context;

    public ProductRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Product>> GetAllAsync()
    {
        return await _context.Producten
            .Include(p => p.Categorie)
            .ToListAsync();
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        return await _context.Producten
            .Include(p => p.Categorie)
            .FirstOrDefaultAsync(p => p.Id == id);
    }

    public async Task AddAsync(Product product)
    {
        _context.Producten.Add(product);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Product product)
    {
        _context.Producten.Update(product);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var product = await _context.Producten.FindAsync(id);
        if (product != null)
        {
            _context.Producten.Remove(product);
            await _context.SaveChangesAsync();
        }
    }
}