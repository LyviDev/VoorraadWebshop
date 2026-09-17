using Microsoft.EntityFrameworkCore;
using VoorraadWebshop.Core.Interfaces;
using VoorraadWebshop.Core.Models;
using VoorraadWebshop.Infrastructure.Data;

namespace VoorraadWebshop.Infrastructure.Repositories;

public class KlantRepository : IKlantRepository
{
    private readonly AppDbContext _context;

    public KlantRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Klant>> GetAllAsync()
    {
        return await _context.Klanten.ToListAsync();
    }

    public async Task<Klant?> GetByIdAsync(int id)
    {
        return await _context.Klanten.FindAsync(id);
    }

    public async Task AddAsync(Klant klant)
    {
        _context.Klanten.Add(klant);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateAsync(Klant klant)
    {
        _context.Klanten.Update(klant);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(int id)
    {
        var klant = await _context.Klanten.FindAsync(id);
        if (klant != null)
        {
            _context.Klanten.Remove(klant);
            await _context.SaveChangesAsync();
        }
    }
}