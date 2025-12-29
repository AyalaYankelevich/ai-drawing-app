using Microsoft.EntityFrameworkCore;
using AiDrawing.Api.Models;

namespace AiDrawing.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Drawing> Drawings => Set<Drawing>();
        public DbSet<DrawingMessage> DrawingMessages => Set<DrawingMessage>();
        public DbSet<AiGeneration> AiGenerations => Set<AiGeneration>();
        public DbSet<DrawingRevision> DrawingRevisions => Set<DrawingRevision>();

    }
}
