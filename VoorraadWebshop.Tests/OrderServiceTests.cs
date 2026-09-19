using Moq;
using VoorraadWebshop.Core.DTOs;
using VoorraadWebshop.Core.Interfaces;
using VoorraadWebshop.Core.Models;
using VoorraadWebshop.Core.Services;
using Xunit;

namespace VoorraadWebshop.Tests;

public class OrderServiceTests
{
    [Fact]
    public async Task PlaatsOrderAsync_MetOnvoldoendeVoorraad_GooitException()
    {
        // Arrange (opzetten van de testsituatie)
        var mockRepository = new Mock<IOrderRepository>();

        var product = new FysiekProduct
        {
            Id = 1,
            Naam = "Testproduct",
            Prijs = 10.00m,
            VoorraadAantal = 5
        };

        mockRepository
            .Setup(r => r.GetProductByIdAsync(1))
            .ReturnsAsync(product);

        var service = new OrderService(mockRepository.Object);

        var dto = new OrderAanmakenDto
        {
            KlantId = 1,
            OrderRegels = new List<OrderRegelDto>
            {
                new OrderRegelDto { ProductId = 1, Aantal = 10 } // meer dan de 5 op voorraad
            }
        };

        // Act & Assert (uitvoeren en controleren)
        await Assert.ThrowsAsync<InvalidOperationException>(() => service.PlaatsOrderAsync(dto));
    }

    [Fact]
    public async Task PlaatsOrderAsync_MetVoldoendeVoorraad_VerlaagtVoorraadCorrect()
    {
        // Arrange
        var mockRepository = new Mock<IOrderRepository>();

        var product = new FysiekProduct
        {
            Id = 1,
            Naam = "Testproduct",
            Prijs = 10.00m,
            VoorraadAantal = 5
        };

        mockRepository
            .Setup(r => r.GetProductByIdAsync(1))
            .ReturnsAsync(product);

        var service = new OrderService(mockRepository.Object);

        var dto = new OrderAanmakenDto
        {
            KlantId = 1,
            OrderRegels = new List<OrderRegelDto>
            {
                new OrderRegelDto { ProductId = 1, Aantal = 3 }
            }
        };

        // Act
        await service.PlaatsOrderAsync(dto);

        // Assert
        Assert.Equal(2, product.VoorraadAantal); // 5 - 3 = 2
    }

    [Fact]
    public async Task PlaatsOrderAsync_MetNietBestaandProduct_GooitException()
    {
        // Arrange
        var mockRepository = new Mock<IOrderRepository>();

        mockRepository
            .Setup(r => r.GetProductByIdAsync(999))
            .ReturnsAsync((Product?)null);

        var service = new OrderService(mockRepository.Object);

        var dto = new OrderAanmakenDto
        {
            KlantId = 1,
            OrderRegels = new List<OrderRegelDto>
        {
            new OrderRegelDto { ProductId = 999, Aantal = 1 }
        }
        };

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() => service.PlaatsOrderAsync(dto));
    }
}