namespace VoorraadWebshop.Core.Models;

public class OrderRegel
{
    public int Id { get; set; }
    public int Aantal { get; set; }
    public decimal PrijsPerStuk { get; set; }

    public int OrderId { get; set; }
    public Order? Order { get; set; }

    public int ProductId { get; set; }
    public Product? Product { get; set; }
}