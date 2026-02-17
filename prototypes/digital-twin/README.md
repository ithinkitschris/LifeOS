# Digital Twin Chatbot

A lightweight conversational interface where visitors can chat with Chris's digital twin. The chatbot responds as Chris would — same voice, opinions, and patterns.

## How It Works

- **Frontend**: React + Vite chat UI with real-time messaging
- **Backend**: Express API endpoint that loads Chris's PKG (Personal Knowledge Graph) as a system prompt and sends conversation history to Claude Haiku
- **PKG Toggle**: Switch between compact (`pkg-chris.md`) and full (`pkg-chris-full.md`) versions to compare voice fidelity

## Architecture

```
Chat Frontend (Vite + React, port 5176)
    ↓
POST /api/llm/digital-twin (Express backend, port 3001)
    ↓
Loads PKG as system prompt + conversation history
    ↓
Claude Haiku API (with prompt caching)
    ↓
Returns response + token usage
```

## Quick Start

### 1. Start the backend
```bash
cd backend
npm install  # if needed
npm start
```
The API will run on `http://localhost:3001`

### 2. Start the prototype
```bash
cd prototypes/digital-twin
npm install  # if needed
npm run dev
```
The chat interface will open at `http://localhost:5176`

### 3. Set up API key
The system needs `ANTHROPIC_API_KEY` environment variable set. Without it, you'll get stub responses.

```bash
export ANTHROPIC_API_KEY=sk-ant-...
# Then restart the backend
```

## Features

- **Multi-turn conversations**: Full message history sent with each request
- **PKG versioning**: Toggle between compact and full PKG to test voice fidelity
- **Token usage display**: Shows input + output tokens per response
- **Prompt caching**: The PKG is cached across messages (~90% input token savings after first message)
- **Auto-scroll**: Latest message always visible
- **Minimal dark UI**: Matches kg-chat aesthetic

## Cost Optimization

Uses `claude-sonnet-4-6` (latest Sonnet for voice authenticity) with prompt caching:
- First message: ~2.5K input tokens (from PKG)
- Subsequent messages: ~25 input tokens (cached PKG + new message)
- Example: 10-turn conversation costs ~$0.10 vs ~$2.00 without caching
- Prompt caching saves ~90% on repeated messages in the same conversation

## Files

- `src/App.jsx` — Main chatbot component
- `src/index.css` — Dark UI styling (reuses kg-chat variables)
- `vite.config.js` — Port 5176, proxy to `/api` on backend
- `package.json` — React + Vite dependencies

## API Endpoint

**POST `/api/llm/digital-twin`**

Request:
```json
{
  "message": "What's your design philosophy?",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "pkg_version": "compact" | "full"
}
```

Response:
```json
{
  "text": "Chris's response...",
  "model": "claude-haiku-4-5",
  "pkg_version": "compact",
  "usage": {
    "input_tokens": 2500,
    "output_tokens": 150
  }
}
```

## Verification Checklist

- [ ] Backend running: `curl http://localhost:3001/health`
- [ ] Frontend running: http://localhost:5176
- [ ] ANTHROPIC_API_KEY set
- [ ] Type a message and verify response appears
- [ ] Toggle between compact/full PKG versions
- [ ] Check token usage displays correctly
