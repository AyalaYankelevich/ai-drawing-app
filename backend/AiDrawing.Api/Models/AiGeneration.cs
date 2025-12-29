using System;

namespace AiDrawing.Api.Models
{
    public class AiGeneration
    {
        public Guid Id { get; set; }
        public Guid DrawingId { get; set; }
        public string UserPrompt { get; set; } = string.Empty;
        public string ModelName { get; set; } = string.Empty;
        public string RequestJson { get; set; } = string.Empty;
        public string ResponseJson { get; set; } = string.Empty;
        public bool IsSuccess { get; set; }
        public string? ErrorText { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
