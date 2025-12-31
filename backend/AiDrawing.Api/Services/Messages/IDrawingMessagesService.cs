using AiDrawing.Api.Dtos;

namespace AiDrawing.Api.Services.Messages;

public interface IDrawingMessagesService
{
    Task<List<DrawingMessageResponse>> ListAsync(Guid drawingId, CancellationToken ct);
    Task<DrawingMessageResponse> AddAsync(Guid drawingId, DrawingMessageRequest request, CancellationToken ct);
}
