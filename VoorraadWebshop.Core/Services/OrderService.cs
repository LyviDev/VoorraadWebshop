using VoorraadWebshop.Core.DTOs;
using VoorraadWebshop.Core.Interfaces;
using VoorraadWebshop.Core.Models;

namespace VoorraadWebshop.Core.Services;

public class OrderService : IOrderService
{
    private readonly IOrderRepository _orderRepository;

    public OrderService(IOrderRepository orderRepository)
    {
        _orderRepository = orderRepository;
    }

    public async Task<List<Order>> GetAllAsync()
    {
        return await _orderRepository.GetAllAsync();
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _orderRepository.GetByIdAsync(id);
    }

    public async Task<Order> PlaatsOrderAsync(OrderAanmakenDto dto)
    {
        if (dto.OrderRegels.Count == 0)
        {
            throw new ArgumentException("Een order moet minstens één product bevatten.");
        }

        var order = new Order
        {
            KlantId = dto.KlantId,
            Status = OrderStatus.InBehandeling
        };

        foreach (var regelDto in dto.OrderRegels)
        {
            var product = await _orderRepository.GetProductByIdAsync(regelDto.ProductId);

            if (product == null)
            {
                throw new ArgumentException($"Product met ID {regelDto.ProductId} bestaat niet.");
            }

            // Voorraadcontrole: alleen relevant voor fysieke producten
            if (product is FysiekProduct fysiekProduct)
            {
                if (fysiekProduct.VoorraadAantal < regelDto.Aantal)
                {
                    throw new InvalidOperationException(
                        $"Onvoldoende voorraad voor '{product.Naam}'. " +
                        $"Beschikbaar: {fysiekProduct.VoorraadAantal}, gevraagd: {regelDto.Aantal}.");
                }

                fysiekProduct.VoorraadAantal -= regelDto.Aantal;
            }

            order.OrderRegels.Add(new OrderRegel
            {
                ProductId = product.Id,
                Aantal = regelDto.Aantal,
                PrijsPerStuk = product.Prijs
            });
        }

        await _orderRepository.AddAsync(order);
        return order;
    }
}