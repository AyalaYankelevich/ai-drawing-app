using AiDrawing.Api.Dtos.Ai;

namespace AiDrawing.Api.Services.Ai;

public interface IAiService
{
    Task<GenerateDrawingResponse> GenerateAsync(GenerateDrawingRequest request, CancellationToken ct);
}
