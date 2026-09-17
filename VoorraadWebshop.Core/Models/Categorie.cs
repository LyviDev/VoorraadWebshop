namespace VoorraadWebshop.Core.Models;

public class Categorie
{
    public int Id { get; set; }
    public string Naam { get; set; } = string.Empty;
    public List<Product> Producten { get; set; } = new();
}