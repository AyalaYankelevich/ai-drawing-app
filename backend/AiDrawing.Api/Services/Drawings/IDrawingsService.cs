using AiDrawing.Api.Dtos;

namespace AiDrawing.Api.Services.Drawings;

public interface IDrawingsService
{
    Task<DrawingResponse> CreateAsync(CreateDrawingRequest request, CancellationToken ct);
    Task<DrawingResponse?> GetByIdAsync(Guid id, CancellationToken ct);
    Task<DrawingResponse?> UpdateAsync(Guid id, UpdateDrawingRequest request, CancellationToken ct);
}
