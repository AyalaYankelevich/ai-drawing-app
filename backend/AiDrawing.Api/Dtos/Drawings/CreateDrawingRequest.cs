namespace AiDrawing.Api.Dtos;

public sealed class CreateDrawingRequest
{
    public required string Title { get; init; }
    public string? DrawingJson { get; init; }
    public required string UserId { get; init; } // Guid כ-string כדי להקל על Frontend
}
