using AiDrawing.Api.Models;

namespace AiDrawing.Api.Repositories.Drawings;

public interface IDrawingsRepository
{
    Task<Drawing?> GetByIdAsync(Guid id, CancellationToken ct);
    Task AddAsync(Drawing drawing, CancellationToken ct);
    Task SaveChangesAsync(CancellationToken ct);
}
