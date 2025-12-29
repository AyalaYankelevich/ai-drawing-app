using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AiDrawing.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AiGenerations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DrawingId = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserPrompt = table.Column<string>(type: "TEXT", nullable: false),
                    ModelName = table.Column<string>(type: "TEXT", nullable: false),
                    RequestJson = table.Column<string>(type: "TEXT", nullable: false),
                    ResponseJson = table.Column<string>(type: "TEXT", nullable: false),
                    IsSuccess = table.Column<bool>(type: "INTEGER", nullable: false),
                    ErrorText = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AiGenerations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DrawingMessages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DrawingId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Role = table.Column<string>(type: "TEXT", nullable: false),
                    MessageText = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrawingMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DrawingRevisions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DrawingId = table.Column<Guid>(type: "TEXT", nullable: false),
                    RevisionNumber = table.Column<int>(type: "INTEGER", nullable: false),
                    DrawingJson = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DrawingRevisions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Drawings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Title = table.Column<string>(type: "TEXT", nullable: false),
                    DrawingJson = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Drawings", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    DisplayName = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AiGenerations");

            migrationBuilder.DropTable(
                name: "DrawingMessages");

            migrationBuilder.DropTable(
                name: "DrawingRevisions");

            migrationBuilder.DropTable(
                name: "Drawings");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
