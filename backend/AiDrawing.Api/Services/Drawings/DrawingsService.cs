using AiDrawing.Api.Dtos;
using AiDrawing.Api.Models;
using AiDrawing.Api.Repositories.Drawings;

namespace AiDrawing.Api.Services.Drawings;

public sealed class DrawingsService : IDrawingsService
{
    private readonly IDrawingsRepository _drawingsRepo;

    public DrawingsService(IDrawingsRepository drawingsRepo)
    {
        _drawingsRepo = drawingsRepo;
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

    public async Task<List<DrawingResponse>> ListByUserAsync(Guid userId, CancellationToken ct)
    {
        var drawings = await _drawingsRepo.ListByUserAsync(userId, ct);
        return drawings.Select(ToResponse).ToList();
    }

}
