using Microsoft.EntityFrameworkCore;
using VoorraadWebshop.Core.Models;

namespace VoorraadWebshop.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Product> Producten => Set<Product>();
    public DbSet<Categorie> Categorieen => Set<Categorie>();
    public DbSet<Klant> Klanten => Set<Klant>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OrderRegel> OrderRegels => Set<OrderRegel>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Product>()
            .HasDiscriminator<string>("ProductType")
            .HasValue<FysiekProduct>("Fysiek")
            .HasValue<DigitaalProduct>("Digitaal");
        modelBuilder.Entity<Product>()
            .Property(p => p.Prijs)
            .HasPrecision(18, 2);

        modelBuilder.Entity<OrderRegel>()
            .Property(o => o.PrijsPerStuk)
            .HasPrecision(18, 2);

        base.OnModelCreating(modelBuilder);
    }
}