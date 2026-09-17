using VoorraadWebshop.Core.Models;

namespace VoorraadWebshop.Core.Interfaces;

public interface IKlantRepository
{
    Task<List<Klant>> GetAllAsync();
    Task<Klant?> GetByIdAsync(int id);
    Task AddAsync(Klant klant);
    Task UpdateAsync(Klant klant);
    Task DeleteAsync(int id);
}