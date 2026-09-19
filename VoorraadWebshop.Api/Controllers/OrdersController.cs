using Microsoft.AspNetCore.Mvc;
using VoorraadWebshop.Core.DTOs;
using VoorraadWebshop.Core.Interfaces;
using VoorraadWebshop.Core.Models;

namespace VoorraadWebshop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet]
    public async Task<ActionResult<List<Order>>> GetAll()
    {
        return Ok(await _orderService.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Order>> GetById(int id)
    {
        var order = await _orderService.GetByIdAsync(id);
        if (order == null) return NotFound();
        return Ok(order);
    }

    [HttpPost]
    public async Task<ActionResult<Order>> PlaatsOrder(OrderAanmakenDto dto)
    {
        try
        {
            var order = await _orderService.PlaatsOrderAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] OrderStatus nieuweStatus)
    {
        try
        {
            await _orderService.UpdateStatusAsync(id, nieuweStatus);
            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return NotFound(ex.Message);
        }
    }
}