# LifeOS Backend

Knowledge graph API server and LLM integration for the LifeOS prototype platform.

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   # Copy the example file
   cp .env.example .env
   
   # Edit .env and add your Anthropic API key
   # Get your key from: https://console.anthropic.com/settings/keys
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

   The server will run at `http://localhost:3001`

## Configuration

### Environment Variables

Create a `.env` file in the `backend` directory with the following:

```env
ANTHROPIC_API_KEY=your-actual-api-key-here
```

**Note:** The system works without an API key by providing stub responses. This is useful for:
- Initial prototyping
- Frontend development
- Testing the API structure
- When you don't need LLM-generated content

### LLM Configuration

Advanced LLM settings can be configured in `config/llm-config.yaml`:
- Model selection (Sonnet vs Haiku)
- Temperature settings by use case
- Prompt templates
- Caching rules
- Token limits

## API Endpoints

View all available endpoints by visiting:
- `http://localhost:3001/api` - API documentation
- `http://localhost:3001/health` - Health check

### Key Endpoints

**Context (Knowledge Graph):**
- `GET /api/context/identity` - Marcus's profile
- `GET /api/context/relationships` - Relationships data
- `POST /api/context/query` - RAG query across knowledge graph

**Modes:**
- `GET /api/modes` - List all modes
- `GET /api/modes/:id` - Mode definition
- `GET /api/modes/:id/triage` - Triage rules

**Constitution:**
- `GET /api/orchestrator/values` - Core values
- `GET /api/orchestrator/trade-offs` - Trade-off rules

**LLM:**
- `POST /api/llm/generate` - General text generation
- `POST /api/llm/explain-mode` - Mode explanations
- `POST /api/llm/explain-triage` - Triage explanations
- `POST /api/llm/kg-query` - Natural language knowledge graph queries
- `GET /api/llm/status` - Check LLM configuration status

## Development

```bash
# Start with auto-reload on file changes
npm run dev

# Check LLM status
curl http://localhost:3001/api/llm/status
```

## Data Structure

```
backend/
├── api/
│   ├── server.js          # Main server
│   └── routes/            # API endpoints
├── data/
│   ├── knowledge-graph/   # Marcus's context (JSON)
│   ├── modes/             # Mode definitions (YAML)
│   └── constitution/      # Values & rules (YAML)
└── config/
    └── llm-config.yaml    # LLM settings
```

## Notes

- All data files use JSON (knowledge graph) or YAML (configuration)
- YAML files are human-readable and easy to edit
- The system is designed to work with or without LLM capabilities
- Stub responses are provided when API key is not configured
