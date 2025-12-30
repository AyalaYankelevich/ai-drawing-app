using AiDrawing.Api.Dtos;
using AiDrawing.Api.Services.Messages;
using Microsoft.AspNetCore.Mvc;

namespace AiDrawing.Api.Controllers;

[ApiController]
[Route("api/drawings/{drawingId:guid}/messages")]
public sealed class DrawingMessagesController : ControllerBase
{
    private readonly IDrawingMessagesService _service;

    public DrawingMessagesController(IDrawingMessagesService service) => _service = service;

    [HttpGet]
    public async Task<ActionResult<List<DrawingMessageResponse>>> List(Guid drawingId, CancellationToken ct)
    {
        var items = await _service.ListAsync(drawingId, ct);
        return Ok(items);
    }

    [HttpPost]
    public async Task<ActionResult<DrawingMessageResponse>> Add(Guid drawingId, [FromBody] DrawingMessageRequest request, CancellationToken ct)
    {
        try
        {
            var created = await _service.AddAsync(drawingId, request, ct);
            return Ok(created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
