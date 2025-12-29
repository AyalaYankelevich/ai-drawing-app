using AiDrawing.Api.Dtos;
using AiDrawing.Api.Models;
using AiDrawing.Api.Repositories.Drawings;
using AiDrawing.Api.Services.Drawings;

namespace AiDrawing.Api.Services.Drawings;

public sealed class DrawingsService : IDrawingsService
{
    private readonly IDrawingsRepository _drawingsRepo;
    private readonly IDrawingRevisionsRepository _revisionsRepo;

    public DrawingsService(IDrawingsRepository drawingsRepo, IDrawingRevisionsRepository revisionsRepo)
    {
        _drawingsRepo = drawingsRepo;
        _revisionsRepo = revisionsRepo;
    }

    public async Task<DrawingResponse> CreateAsync(CreateDrawingRequest request, CancellationToken ct)
    {
        if (!Guid.TryParse(request.UserId, out var userId))
            throw new ArgumentException("Invalid UserId (must be a GUID string).");

        var drawing = new Drawing
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            Title = request.Title,
            DrawingJson = request.DrawingJson,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = null
        };

        await _drawingsRepo.AddAsync(drawing, ct);

        // Revision #1 (snapshot)
        await _revisionsRepo.AddAsync(new DrawingRevision
        {
            Id = Guid.NewGuid(),
            DrawingId = drawing.Id,
            RevisionNumber = 1,
            DrawingJson = drawing.DrawingJson,
            CreatedAt = DateTime.UtcNow
        }, ct);

        await _drawingsRepo.SaveChangesAsync(ct);

        return ToResponse(drawing);
    }

    public async Task<DrawingResponse?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        var drawing = await _drawingsRepo.GetByIdAsync(id, ct);
        return drawing is null ? null : ToResponse(drawing);
    }

    public async Task<DrawingResponse?> UpdateAsync(Guid id, UpdateDrawingRequest request, CancellationToken ct)
    {
        var drawing = await _drawingsRepo.GetByIdAsync(id, ct);
        if (drawing is null) return null;

        drawing.Title = request.Title;
        drawing.DrawingJson = request.DrawingJson;
        drawing.UpdatedAt = DateTime.UtcNow;

        var nextRev = await _revisionsRepo.GetNextRevisionNumberAsync(id, ct);
        await _revisionsRepo.AddAsync(new DrawingRevision
        {
            Id = Guid.NewGuid(),
            DrawingId = id,
            RevisionNumber = nextRev,
            DrawingJson = drawing.DrawingJson,
            CreatedAt = DateTime.UtcNow
        }, ct);

        await _drawingsRepo.SaveChangesAsync(ct);

        return ToResponse(drawing);
    }

    private static DrawingResponse ToResponse(Drawing d) => new()
    {
        Id = d.Id.ToString(),
        UserId = d.UserId.ToString(),
        Title = d.Title,
        DrawingJson = d.DrawingJson,
        CreatedAt = d.CreatedAt,
        UpdatedAt = d.UpdatedAt
    };
}
