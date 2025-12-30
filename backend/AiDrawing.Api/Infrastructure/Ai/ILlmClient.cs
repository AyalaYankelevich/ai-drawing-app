namespace AiDrawing.Api.Infrastructure.Ai;

public interface ILlmClient
{
    Task<string> GenerateShapesJsonAsync(string prompt, CancellationToken ct);
}
