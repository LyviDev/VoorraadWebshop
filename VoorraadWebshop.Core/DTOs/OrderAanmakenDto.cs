namespace VoorraadWebshop.Core.DTOs;

public class OrderAanmakenDto
{
    public int KlantId { get; set; }
    public List<OrderRegelDto> OrderRegels { get; set; } = new();
}

public class OrderRegelDto
{
    public int ProductId { get; set; }
    public int Aantal { get; set; }
}