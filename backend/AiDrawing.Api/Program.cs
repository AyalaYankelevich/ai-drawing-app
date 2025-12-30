using AiDrawing.Api.Data;
using AiDrawing.Api.Infrastructure.Ai;
using AiDrawing.Api.Repositories.Drawings;
using AiDrawing.Api.Repositories.Messages;
using AiDrawing.Api.Services.Ai;
using AiDrawing.Api.Services.Drawings;
using AiDrawing.Api.Services.Messages;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ====================
// Services (DI)
// ====================

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("Default")));

// Controllers + Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Drawings
builder.Services.AddScoped<IDrawingsRepository, DrawingsRepository>();
builder.Services.AddScoped<IDrawingsService, DrawingsService>();

// Messages (Chat)
builder.Services.AddScoped<IDrawingMessagesRepository, DrawingMessagesRepository>();
builder.Services.AddScoped<IDrawingMessagesService, DrawingMessagesService>();

// AI
builder.Services.AddScoped<IAiService, AiService>();
builder.Services.AddSingleton<ILlmClient, FakeLlmClient>();

var app = builder.Build();

// ====================
// Middleware
// ====================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
