using Microsoft.AspNetCore.Mvc;
using VoorraadWebshop.Core.Interfaces;
using VoorraadWebshop.Core.Models;

namespace VoorraadWebshop.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly ICategorieRepository _repository;

    public CategoriesController(ICategorieRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public async Task<ActionResult<List<Categorie>>> GetAll()
    {
        return Ok(await _repository.GetAllAsync());
    }

    [HttpPost]
    public async Task<ActionResult<Categorie>> Create(Categorie categorie)
    {
        await _repository.AddAsync(categorie);
        return CreatedAtAction(nameof(GetAll), new { id = categorie.Id }, categorie);
    }
}