# ai-drawing-app

AI-powered drawing application where users describe a scene in natural language and receive a generated drawing on a canvas.

## Project Demonstration
You can watch a full demo of the application here: View Demo on Google Drive


## Tech Stack
- Frontend: React + TypeScript
- Backend: ASP.NET Core Web API
- Database: SQLite (EF Core)
- AI: LLM converting text prompts to drawing instructions

## How to run

### Backend Setup

1. Configure API key:
   
   **Option A: Using launchSettings.json (Recommended for local development)**
   ```bash
   # Copy the example file
   cp backend/AiDrawing.Api/Properties/launchSettings.json.example backend/AiDrawing.Api/Properties/launchSettings.json
   
   # Then edit backend/AiDrawing.Api/Properties/launchSettings.json
   # and replace "your-openai-api-key-here" with your actual API key
   ```
   
   **Option B: Set environment variables manually**
   ```bash
   # Windows PowerShell
   $env:OPENAI_API_KEY="your-api-key-here"
   $env:OPENAI_MODEL="gpt-4.1-mini"
   
   # Windows CMD
   set OPENAI_API_KEY=your-api-key-here
   set OPENAI_MODEL=gpt-4.1-mini
   
   # Linux/Mac
   export OPENAI_API_KEY=your-api-key-here
   export OPENAI_MODEL=gpt-4.1-mini
   ```

2. Navigate to backend:
   ```bash
   cd backend/AiDrawing.Api
   ```

3. Run the API:
   ```bash
   dotnet run
   ```
   
   **Note:** See `backend/AiDrawing.Api/README.md` for more detailed setup instructions.

### Frontend Setup

1. Navigate to frontend:
   ```bash
   cd frontend/ai-drawing-ui
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the app:
   ```bash
   npm run dev
   ```

## Environment Variables

**Required:**
- `OPENAI_API_KEY` - Your OpenAI API key (get it from https://platform.openai.com/api-keys)

**Optional:**
- `OPENAI_MODEL` - Model to use (default: "gpt-4.1-mini")
