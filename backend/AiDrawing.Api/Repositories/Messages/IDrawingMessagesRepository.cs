using AiDrawing.Api.Models;

namespace AiDrawing.Api.Repositories.Messages;

public interface IDrawingMessagesRepository
{
    Task<List<DrawingMessage>> ListByDrawingAsync(Guid drawingId, CancellationToken ct);
    Task AddAsync(DrawingMessage message, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}
