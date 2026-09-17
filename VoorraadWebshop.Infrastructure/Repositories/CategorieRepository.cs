using Microsoft.EntityFrameworkCore;
using VoorraadWebshop.Core.Interfaces;
using VoorraadWebshop.Core.Models;
using VoorraadWebshop.Infrastructure.Data;

namespace VoorraadWebshop.Infrastructure.Repositories;

public class CategorieRepository : ICategorieRepository
{
    private readonly AppDbContext _context;

    public CategorieRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Categorie>> GetAllAsync()
    {
        return await _context.Categorieen.ToListAsync();
    }

    public async Task<Categorie?> GetByIdAsync(int id)
    {
        return await _context.Categorieen.FindAsync(id);
    }

    public async Task AddAsync(Categorie categorie)
    {
        _context.Categorieen.Add(categorie);
        await _context.SaveChangesAsync();
    }
}