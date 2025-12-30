using AiDrawing.Api.Dtos;
using AiDrawing.Api.Services.Drawings;
using Microsoft.AspNetCore.Mvc;

namespace AiDrawing.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public sealed class DrawingsController : ControllerBase
{
    private readonly IDrawingsService _service;

    public DrawingsController(IDrawingsService service) => _service = service;

    [HttpPost]
    public async Task<ActionResult<DrawingResponse>> Create([FromBody] CreateDrawingRequest request, CancellationToken ct)
    {
        try
        {
            var created = await _service.CreateAsync(request, ct);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<DrawingResponse>> GetById(Guid id, CancellationToken ct)
    {
        var result = await _service.GetByIdAsync(id, ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<DrawingResponse>> Update(Guid id, [FromBody] UpdateDrawingRequest request, CancellationToken ct)
    {
        var result = await _service.UpdateAsync(id, request, ct);
        return result is null ? NotFound() : Ok(result);
    }

    [HttpGet]
    public async Task<ActionResult<List<DrawingResponse>>> List(
        [FromQuery] Guid userId,
        CancellationToken ct)
    {
        var items = await _service.ListByUserAsync(userId, ct);
        return Ok(items);
    }
}
