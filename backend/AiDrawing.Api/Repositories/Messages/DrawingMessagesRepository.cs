using AiDrawing.Api.Data;
using AiDrawing.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace AiDrawing.Api.Repositories.Messages;

public sealed class DrawingMessagesRepository : IDrawingMessagesRepository
{
    private readonly AppDbContext _db;
    public DrawingMessagesRepository(AppDbContext db) => _db = db;

    public async Task<List<DrawingMessage>> ListByDrawingAsync(Guid drawingId, CancellationToken ct)
    {
        return await _db.DrawingMessages
            .AsNoTracking()
            .Where(m => m.DrawingId == drawingId)
            .OrderBy(m => m.CreatedAt)
            .ToListAsync(ct);
    }

    public Task AddAsync(DrawingMessage message, CancellationToken ct)
    {
        _db.DrawingMessages.Add(message);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken ct) => _db.SaveChangesAsync(ct);
}
