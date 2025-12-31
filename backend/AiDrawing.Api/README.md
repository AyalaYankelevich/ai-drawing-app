# AiDrawing API

## Setup

### Step 1: Configure API Key

**Recommended way:** Edit `Properties/launchSettings.json` and add your API key:

1. Open `backend/AiDrawing.Api/Properties/launchSettings.json`
2. Find the `environmentVariables` section in your profile (http or https)
3. Replace `"your-openai-api-key-here"` with your actual OpenAI API key:
   ```json
   "environmentVariables": {
     "ASPNETCORE_ENVIRONMENT": "Development",
     "OPENAI_API_KEY": "sk-your-actual-api-key-here",
     "OPENAI_MODEL": "gpt-4.1-mini"
   }
   ```

**Note:** `launchSettings.json` is in `.gitignore` - your API key will NOT be committed to git.

**Alternative:** Set environment variable manually before running:
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
1. `OPENAI_API_KEY` environment variable (from system or `launchSettings.json`) ✅ **Recommended**
2. `appsettings.Development.json` → `OpenAI:ApiKey` (fallback)
3. `appsettings.json` → `OpenAI:ApiKey` (fallback)

**Security Notes:** 
- `launchSettings.json` is in `.gitignore` - your API key will NOT be committed to git
- `launchSettings.json.example` is safe to commit (contains only placeholders)
- Never commit your API key! Always use the example file as a template

