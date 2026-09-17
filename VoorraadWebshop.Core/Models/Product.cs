using System.Text.Json.Serialization;

namespace VoorraadWebshop.Core.Models;

[JsonPolymorphic(TypeDiscriminatorPropertyName = "type")]
[JsonDerivedType(typeof(FysiekProduct), "fysiek")]
[JsonDerivedType(typeof(DigitaalProduct), "digitaal")]
public abstract class Product
{
    public int Id { get; set; }
    public string Naam { get; set; } = string.Empty;
    public string Beschrijving { get; set; } = string.Empty;
    public decimal Prijs { get; set; }
    public int CategorieId { get; set; }
    public Categorie? Categorie { get; set; }
    public abstract string GeefProductType();
}