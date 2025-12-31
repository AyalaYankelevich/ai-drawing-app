using System;
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

        // Try environment variable first (more secure), then fall back to config
        var apiKey = Environment.GetEnvironmentVariable("OPENAI_API_KEY") 
                     ?? cfg["OpenAI:ApiKey"];
        
        if (string.IsNullOrWhiteSpace(apiKey))
            throw new InvalidOperationException(
                "Missing OpenAI API Key. Set OPENAI_API_KEY environment variable or configure OpenAI:ApiKey in appsettings.json");

        _model = Environment.GetEnvironmentVariable("OPENAI_MODEL") 
                 ?? cfg["OpenAI:Model"] 
                 ?? "gpt-4.1-mini";

        _http.BaseAddress = new Uri("https://api.openai.com/");
        _http.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);
    }

        public async Task<string> GenerateShapesJsonAsync(string prompt, string currentDrawingJson, CancellationToken ct)

        {
            var instruction = """
        Return ONLY valid JSON (no markdown, no extra text) as an array of shapes.

        IMPORTANT RULES:
        - Never return an empty array. Always return at least ONE shape.
        - Keep all coordinates inside a 900x520 canvas (0<=x<=900, 0<=y<=520).
        - If the prompt is vague, choose a reasonable default object.
        - Use only these types: circle, rect, line.

        Each shape is one of:
        - circle: { "type":"circle", "x":number, "y":number, "r":number, "color"?:string }
        - rect:   { "type":"rect", "x":number, "y":number, "w":number, "h":number, "color"?:string }
        - line:   { "type":"line", "x1":number, "y1":number, "x2":number, "y2":number, "color"?:string, "width"?:number }
        """;

            async Task<string> CallOnceAsync(string extra, CancellationToken token)
            {
                var payload = new
                {
                    model = _model,
                    input = $"{instruction}\nCURRENT_DRAWING_JSON:\n{currentDrawingJson}\nUSER_PROMPT: {prompt}"

                };

                var json = JsonSerializer.Serialize(payload);
                using var content = new StringContent(json, Encoding.UTF8, "application/json");

                using var resp = await _http.PostAsync("v1/responses", content, token);
                var respText = await resp.Content.ReadAsStringAsync(token);

                if (!resp.IsSuccessStatusCode)
                    throw new InvalidOperationException($"OpenAI error: {(int)resp.StatusCode} {respText}");

                using var doc = JsonDocument.Parse(respText);

                string? text =
                    doc.RootElement.TryGetProperty("output_text", out var outputTextEl)
                        ? outputTextEl.GetString()?.Trim()
                        : doc.RootElement.GetProperty("output")[0].GetProperty("content")[0].GetProperty("text").GetString()?.Trim();

                ValidateJsonArray(text, allowEmpty: false);
                return text!;
            }

            // ניסיון ראשון
            var first = await CallOnceAsync(extra: "", ct);

            // אם בכל זאת הגיע "[]" (לא אמור, אבל קורה), Retry עם fallback ברור
            using (var parsed = JsonDocument.Parse(first))
            {
                if (parsed.RootElement.GetArrayLength() == 0)
                {
                    var retry = await CallOnceAsync(
                        extra: "You returned an empty array. Retry. If unsure, draw a small blue circle at x=50,y=50,r=12.",
                        token: ct
                    );
                    return retry;
                }
            }

            return first;
        }


    private static void ValidateJsonArray(string? text, bool allowEmpty)
    {
        if (string.IsNullOrWhiteSpace(text))
            throw new InvalidOperationException("Empty model response.");

        using var parsed = JsonDocument.Parse(text);

        if (parsed.RootElement.ValueKind != JsonValueKind.Array)
            throw new InvalidOperationException("Model response is not a JSON array.");

        if (!allowEmpty && parsed.RootElement.GetArrayLength() == 0)
            throw new InvalidOperationException("Model returned an empty array.");
    }

}
