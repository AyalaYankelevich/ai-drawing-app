using System;

namespace AiDrawing.Api.Models
{
    public class DrawingRevision
    {
        public Guid Id { get; set; }

        public Guid DrawingId { get; set; }

        public int RevisionNumber { get; set; }

        public string DrawingJson { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
