using AiDrawing.Api.Dtos.Ai;
using AiDrawing.Api.Services.Ai;
using Microsoft.AspNetCore.Mvc;

namespace AiDrawing.Api.Controllers;

[ApiController]
[Route("api/ai")]
public sealed class AiController : ControllerBase
{
    private readonly IAiService _service;

    public AiController(IAiService service) => _service = service;

    [HttpPost("generate")]
    public async Task<ActionResult<GenerateDrawingResponse>> Generate([FromBody] GenerateDrawingRequest request, CancellationToken ct)
    {
        try
        {
            var res = await _service.GenerateAsync(request, ct);
            return Ok(res);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }
}
