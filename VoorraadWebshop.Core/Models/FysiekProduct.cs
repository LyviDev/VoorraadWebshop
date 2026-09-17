namespace VoorraadWebshop.Core.Models;

public class FysiekProduct : Product
{
    public double GewichtInKg { get; set; }
    public int VoorraadAantal { get; set; }

    public override string GeefProductType() => "Fysiek product";
}