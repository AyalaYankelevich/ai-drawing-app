using AiDrawing.Api.Dtos;
using AiDrawing.Api.Models;
using AiDrawing.Api.Repositories.Messages;

namespace AiDrawing.Api.Services.Messages;

public sealed class DrawingMessagesService : IDrawingMessagesService
{
    private readonly IDrawingMessagesRepository _repo;

    public DrawingMessagesService(IDrawingMessagesRepository repo) => _repo = repo;

    public async Task<List<DrawingMessageResponse>> ListAsync(Guid drawingId, CancellationToken ct)
    {
        var msgs = await _repo.ListByDrawingAsync(drawingId, ct);
        return msgs.Select(ToResponse).ToList();
    }

    public async Task<DrawingMessageResponse> AddAsync(Guid drawingId, DrawingMessageRequest request, CancellationToken ct)
    {
        // (רשות) ולידציה בסיסית
        var role = request.Role.Trim().ToLowerInvariant();
        if (role is not ("user" or "assistant"))
            throw new ArgumentException("Role must be 'user' or 'assistant'.");

        if (string.IsNullOrWhiteSpace(request.MessageText))
            throw new ArgumentException("MessageText is required.");

        var msg = new DrawingMessage
        {
            Id = Guid.NewGuid(),
            DrawingId = drawingId,
            Role = role,
            MessageText = request.MessageText,
            CreatedAt = DateTime.UtcNow
        };

        await _repo.AddAsync(msg, ct);
        await _repo.SaveChangesAsync(ct);

        return ToResponse(msg);
    }

    private static DrawingMessageResponse ToResponse(DrawingMessage m) => new()
    {
        Id = m.Id.ToString(),
        DrawingId = m.DrawingId.ToString(),
        Role = m.Role,
        MessageText = m.MessageText,
        CreatedAt = m.CreatedAt
    };
}
