using VoorraadWebshop.Core.Models;

namespace VoorraadWebshop.Core.Interfaces;

public interface ICategorieRepository
{
    Task<List<Categorie>> GetAllAsync();
    Task<Categorie?> GetByIdAsync(int id);
    Task AddAsync(Categorie categorie);
}