# AiDrawing API

## Environment Variables

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key

**Optional:**
- `OPENAI_MODEL` - Model to use (default: "gpt-4.1-mini")

## Setup

### Step 1: Configure API Key

Copy the example file and add your API key:
```bash
# Copy the example file
cp Properties/launchSettings.json.example Properties/launchSettings.json

# Then edit Properties/launchSettings.json and replace "your-openai-api-key-here" with your actual API key
```

Or set environment variable manually:
```bash
# Windows PowerShell
$env:OPENAI_API_KEY="your-api-key-here"

# Windows CMD
set OPENAI_API_KEY=your-api-key-here

# Linux/Mac
export OPENAI_API_KEY=your-api-key-here
```

### Step 2: Run the API
```bash
dotnet run
```

## How it works

The API checks for the API key in this order:
1. `OPENAI_API_KEY` environment variable (from system or launchSettings.json)
2. `appsettings.json` → `OpenAI:ApiKey` (fallback)

**Note:** 
- `launchSettings.json` is in `.gitignore` - your API key will NOT be committed to git
- Never commit your API key! Always use `launchSettings.json.example` as a template

