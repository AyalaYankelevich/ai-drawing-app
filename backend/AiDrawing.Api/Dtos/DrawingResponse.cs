namespace AiDrawing.Api.Dtos;

public sealed class DrawingResponse
{
    public required string Id { get; init; }
    public required string UserId { get; init; }
    public required string Title { get; init; }
    public required string DrawingJson { get; init; }
    public required DateTime CreatedAt { get; init; }
    public DateTime? UpdatedAt { get; init; }
}
