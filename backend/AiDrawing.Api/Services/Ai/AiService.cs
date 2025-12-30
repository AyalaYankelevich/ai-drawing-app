using AiDrawing.Api.Dtos.Ai;
using AiDrawing.Api.Infrastructure.Ai;
using AiDrawing.Api.Models;
using AiDrawing.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace AiDrawing.Api.Services.Ai;

public sealed class AiService : IAiService
{
    private readonly ILlmClient _llm;
    private readonly AppDbContext _db;

    public AiService(ILlmClient llm, AppDbContext db)
    {
        _llm = llm;
        _db = db;
    }

    public async Task<GenerateDrawingResponse> GenerateAsync(GenerateDrawingRequest request, CancellationToken ct)
    {
        if (!Guid.TryParse(request.DrawingId, out var drawingId))
            throw new ArgumentException("Invalid DrawingId (must be a GUID string).");

        // (אופציונלי) לוודא שהציור קיים:
        var exists = await _db.Drawings.AsNoTracking().AnyAsync(d => d.Id == drawingId, ct);
        if (!exists) throw new ArgumentException("Drawing not found.");

        var shapesJson = await _llm.GenerateShapesJsonAsync(request.Prompt, ct);

        // לוג ל־ai_generations
        _db.AiGenerations.Add(new AiGeneration
        {
            Id = Guid.NewGuid(),
            DrawingId = drawingId,
            UserPrompt = request.Prompt,
            ModelName = "fake-llm",
            RequestJson = "",       // אפשר להשאיר ריק בינתיים
            ResponseJson = shapesJson,
            IsSuccess = true,
            ErrorText = null,
            CreatedAt = DateTime.UtcNow
        });

        await _db.SaveChangesAsync(ct);

        return new GenerateDrawingResponse { ShapesJson = shapesJson };
    }
}
