using System.Text.Json;

namespace AiDrawing.Api.Infrastructure.Ai;

public sealed class FakeLlmClient : ILlmClient
{
    public Task<string> GenerateShapesJsonAsync(string prompt, string currentDrawingJson, CancellationToken ct)
    {
        // JSON מינימלי של shapes: rect + circle
        var shapes = new object[]
        {
            new { type = "circle", x = 120, y = 90, r = 35, color = "yellow" },   // שמש
            new { type = "rect", x = 0, y = 220, w = 600, h = 200, color = "green" } // דשא
        };

        return Task.FromResult(JsonSerializer.Serialize(shapes));
    }
}
