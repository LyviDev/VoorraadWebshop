using Microsoft.AspNetCore.Mvc;
using VoorraadWebshop.Core.Interfaces;
using VoorraadWebshop.Core.Models;

namespace VoorraadWebshop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class KlantsController : ControllerBase
{
    private readonly IKlantRepository _repository;

    public KlantsController(IKlantRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<Klant>>> GetAll()
    {
        return Ok(await _repository.GetAllAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Klant>> GetById(int id)
    {
        var klant = await _repository.GetByIdAsync(id);
        if (klant == null) return NotFound();
        return Ok(klant);
    }

    [HttpPost]
    public async Task<ActionResult<Klant>> Create(Klant klant)
    {
        await _repository.AddAsync(klant);
        return CreatedAtAction(nameof(GetById), new { id = klant.Id }, klant);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Klant klant)
    {
        if (id != klant.Id) return BadRequest("ID komt niet overeen.");
        await _repository.UpdateAsync(klant);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _repository.DeleteAsync(id);
        return NoContent();
    }
}