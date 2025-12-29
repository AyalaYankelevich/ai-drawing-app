using AiDrawing.Api.Data;
using AiDrawing.Api.Models;
using AiDrawing.Api.Repositories.Drawings;
using Microsoft.EntityFrameworkCore;

namespace AiDrawing.Api.Repositories.Drawings;

public sealed class DrawingsRepository : IDrawingsRepository
{
    private readonly AppDbContext _db;

    public DrawingsRepository(AppDbContext db) => _db = db;

    public Task<Drawing?> GetByIdAsync(Guid id, CancellationToken ct) =>
        _db.Drawings.FirstOrDefaultAsync(d => d.Id == id, ct);

    public Task AddAsync(Drawing drawing, CancellationToken ct)
    {
        _db.Drawings.Add(drawing);
        return Task.CompletedTask;
    }

    public Task SaveChangesAsync(CancellationToken ct) => _db.SaveChangesAsync(ct);
}
