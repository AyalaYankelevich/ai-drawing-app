namespace AiDrawing.Api.Dtos;

public sealed class UpdateDrawingRequest
{
    public required string Title { get; init; }
    public required string DrawingJson { get; init; }
}
