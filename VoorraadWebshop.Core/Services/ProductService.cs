using VoorraadWebshop.Core.Interfaces;
using VoorraadWebshop.Core.Models;

namespace VoorraadWebshop.Core.Services;

public class ProductService : IProductService
{
    private readonly IProductRepository _repository;
    private readonly ICategorieRepository _categorieRepository;

    public ProductService(IProductRepository repository, ICategorieRepository categorieRepository)
    {
        _repository = repository;
        _categorieRepository = categorieRepository;
    }

    public async Task<List<Product>> GetAllProductsAsync()
    {
        return await _repository.GetAllAsync();
    }

    public async Task<Product?> GetProductByIdAsync(int id)
    {
        return await _repository.GetByIdAsync(id);
    }

    public async Task<Product> CreateProductAsync(Product product)
    {
        if (string.IsNullOrWhiteSpace(product.Naam))
        {
            throw new ArgumentException("Productnaam mag niet leeg zijn.");
        }

        if (product.Prijs < 0)
        {
            throw new ArgumentException("Prijs mag niet negatief zijn.");
        }

        var categorie = await _categorieRepository.GetByIdAsync(product.CategorieId);
        if (categorie == null)
        {
            throw new ArgumentException($"Categorie met ID {product.CategorieId} bestaat niet.");
        }

        await _repository.AddAsync(product);
        return product;
    }

    public async Task UpdateProductAsync(Product product)
    {
        await _repository.UpdateAsync(product);
    }

    public async Task DeleteProductAsync(int id)
    {
        await _repository.DeleteAsync(id);
    }
}