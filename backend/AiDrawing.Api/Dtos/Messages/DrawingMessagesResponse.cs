namespace AiDrawing.Api.Dtos;

public sealed class DrawingMessageResponse
{
    public required string Id { get; init; }
    public required string DrawingId { get; init; }
    public required string Role { get; init; }
    public required string MessageText { get; init; }
    public required DateTime CreatedAt { get; init; }
}
