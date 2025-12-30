namespace AiDrawing.Api.Dtos.Ai;

public sealed class GenerateDrawingRequest
{
    public required string DrawingId { get; init; } // GUID string
    public required string Prompt { get; init; }

    // ✅ חדש: הציור הנוכחי (מערך Shapes כ-JSON string)
    public required string CurrentDrawingJson { get; init; }
}
