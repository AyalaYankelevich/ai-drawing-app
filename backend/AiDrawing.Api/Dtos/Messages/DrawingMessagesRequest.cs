namespace AiDrawing.Api.Dtos;

public sealed class DrawingMessageRequest
{
    public required string Role { get; init; }        // "user" / "assistant"
    public required string MessageText { get; init; } // הטקסט
}
