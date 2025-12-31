namespace AiDrawing.Api.Infrastructure.Ai;

public interface ILlmClient
{
    Task<string> GenerateShapesJsonAsync(string prompt, string currentDrawingJson, CancellationToken ct);
}
