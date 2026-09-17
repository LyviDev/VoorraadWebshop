namespace VoorraadWebshop.Core.Models;

public class Order
{
    public int Id { get; set; }
    public DateTime BesteldOp { get; set; } = DateTime.Now;
    public OrderStatus Status { get; set; } = OrderStatus.InBehandeling;

    public int KlantId { get; set; }
    public Klant? Klant { get; set; }

    public List<OrderRegel> OrderRegels { get; set; } = new();

    public decimal BerekenTotaalPrijs()
    {
        return OrderRegels.Sum(regel => regel.Aantal * regel.PrijsPerStuk);
    }
}