namespace VoorraadWebshop.Core.Models;

public class DigitaalProduct : Product
{
    public string DownloadLink { get; set; } = string.Empty;
    public long BestandsGrootteInMb { get; set; }

    public override string GeefProductType() => "Digitaal product";
}
