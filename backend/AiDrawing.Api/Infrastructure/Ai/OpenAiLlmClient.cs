using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace AiDrawing.Api.Infrastructure.Ai;

public sealed class OpenAiLlmClient : ILlmClient
{
    private readonly HttpClient _http;
    private readonly string _model;

    public OpenAiLlmClient(HttpClient http, IConfiguration cfg)
    {
        _http = http;

        var apiKey = cfg["OpenAI:ApiKey"];
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException("Missing OpenAI:ApiKey in configuration (appsettings.Development.json).");

        _model = cfg["OpenAI:Model"] ?? "gpt-4.1-mini";

        _http.BaseAddress = new Uri("https://api.openai.com/");
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
    }

    public async Task<string> GenerateShapesJsonAsync(string prompt, CancellationToken ct)
    {
        var instruction = """
Return ONLY valid JSON (no markdown, no extra text) as an array of shapes.
Each shape is one of:
- circle: { "type":"circle", "x":number, "y":number, "r":number, "color"?:string }
- rect:   { "type":"rect", "x":number, "y":number, "w":number, "h":number, "color"?:string }
- line:   { "type":"line", "x1":number, "y1":number, "x2":number, "y2":number, "color"?:string, "width"?:number }
""";

        var payload = new
        {
            model = _model,
            input = $"{instruction}\nUser prompt: {prompt}"
        };

        var json = JsonSerializer.Serialize(payload);
        using var content = new StringContent(json, Encoding.UTF8, "application/json");

        using var resp = await _http.PostAsync("v1/responses", content, ct);
        var respText = await resp.Content.ReadAsStringAsync(ct);

        if (!resp.IsSuccessStatusCode)
            throw new InvalidOperationException($"OpenAI error: {(int)resp.StatusCode} {respText}");

        // חילוץ "טקסט" מתוך responses:
        using var doc = JsonDocument.Parse(respText);

        if (doc.RootElement.TryGetProperty("output_text", out var outputTextEl))
        {
            var outText = outputTextEl.GetString()?.Trim();
            ValidateJsonArray(outText);
            return outText!;
        }

        var output = doc.RootElement.GetProperty("output");
        var contentArr = output[0].GetProperty("content");
        var text = contentArr[0].GetProperty("text").GetString()?.Trim();

        ValidateJsonArray(text);
        return text!;
    }

    private static void ValidateJsonArray(string? text)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new InvalidOperationException("Empty model response.");

        using var parsed = JsonDocument.Parse(text);
        if (parsed.RootElement.ValueKind != JsonValueKind.Array)
            throw new InvalidOperationException("Model response is not a JSON array.");
    }
}
