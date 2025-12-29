using System;

namespace AiDrawing.Api.Models
{
    public class DrawingMessage
    {
        public Guid Id { get; set; }
        public Guid DrawingId { get; set; }
        public string Role { get; set; } = string.Empty;
        public string MessageText { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
