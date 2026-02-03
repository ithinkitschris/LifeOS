# LifeOS Prototype Platform

A research platform for prototyping and testing LifeOS interactions. This platform provides a shared backend with Marcus's knowledge graph that multiple prototypes can query.

## Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start the Backend

```bash
npm start
```

The API will be available at `http://localhost:3001`

### 3. Create a Prototype

**React prototype:**
```bash
cp -r prototypes/templates/react-template prototypes/active/my-prototype
cd prototypes/active/my-prototype
npm install
npm run dev
```

**Swift prototype:**
1. Copy `prototypes/templates/swift-template` to `prototypes/active/`
2. Open in Xcode
3. Run (make sure backend is running)

## Project Structure

```
lifeos-platform/
├── backend/
│   ├── api/                    # Express server
│   │   ├── server.js           # Main entry point
│   │   └── routes/             # API endpoints
│   ├── data/
│   │   ├── knowledge-graph/    # Marcus's context (JSON)
│   │   ├── modes/              # Mode definitions (YAML)
│   │   └── constitution/       # Values & rules (YAML)
│   └── config/                 # LLM settings
├── prototypes/
│   ├── templates/              # Starter templates
│   │   ├── react-template/     # Web prototypes
│   │   └── swift-template/     # iOS prototypes
│   └── active/                 # Your prototypes go here
├── scripts/                    # Utility scripts
└── tools/                      # Future: GUI tools
```

## API Endpoints

### Context (Knowledge Graph)

| Endpoint | Description |
|----------|-------------|
| `GET /api/context/identity` | Marcus's profile |
| `GET /api/context/relationships` | All relationships |
| `GET /api/context/relationships/:id` | Specific person |
| `GET /api/context/behaviors` | Behavioral patterns |
| `GET /api/context/calendar` | Calendar patterns |
| `GET /api/context/locations` | Location data |
| `GET /api/context/health` | Health/biometrics |
| `GET /api/context/communications` | Communication patterns |
| `POST /api/context/query` | Search knowledge graph |
| `POST /api/context/assemble` | Get context for scenario |

### Modes

| Endpoint | Description |
|----------|-------------|
| `GET /api/modes` | List all modes |
| `GET /api/modes/:id` | Mode definition |
| `GET /api/modes/:id/triage` | Triage rules for mode |
| `GET /api/modes/:id/activation` | Activation triggers |

### Constitution

| Endpoint | Description |
|----------|-------------|
| `GET /api/orchestrator/values` | Core values |
| `GET /api/orchestrator/trade-offs` | Trade-off rules |
| `GET /api/orchestrator/boundaries` | Hard boundaries |

### LLM (Natural Language)

| Endpoint | Description |
|----------|-------------|
| `POST /api/llm/generate` | General text generation |
| `POST /api/llm/explain-mode` | Mode entry/exit explanation |
| `POST /api/llm/explain-triage` | Triage decision explanation |
| `GET /api/llm/status` | Check LLM availability |

## Configuration

### Enabling LLM Generation

Set your Anthropic API key:

```bash
export ANTHROPIC_API_KEY=your-key-here
npm start
```

Without an API key, the LLM endpoints return sensible stub responses.

### Editing Mode Rules

Mode definitions are in `backend/data/modes/mode-definitions.yaml`. Edit this file to:
- Change activation triggers
- Modify triage rules (center/periphery/silence)
- Adjust allowed/blocked intents

### Editing Constitutional Values

Values are in `backend/data/constitution/values.yaml`. Edit this file to:
- Change Marcus's priorities
- Modify trade-off rules
- Adjust hard boundaries

Changes take effect immediately (no restart needed for YAML files).

## Creating Prototypes

### React (Web)

1. Copy the template:
   ```bash
   cp -r prototypes/templates/react-template prototypes/active/your-name
   ```

2. Install and run:
   ```bash
   cd prototypes/active/your-name
   npm install
   npm run dev
   ```

3. Use the `useLifeOS` hook in your components:
   ```jsx
   const { identity, modes, getModeExplanation, getContext } = useLifeOS();
   ```

### Swift (iOS)

1. Copy the template folder
2. Open in Xcode
3. Follow instructions in the template's README.md

## Knowledge Graph

Marcus Chen is a 23-year-old design student. The knowledge graph includes:

- **Identity**: Profile, personality, preferences
- **Relationships**: 6 core people (partner, friends, family, advisor)
- **Behaviors**: Daily rhythms, work patterns, stress responses
- **Calendar**: Recurring commitments, scheduling preferences
- **Locations**: Home, university, cafes, commute routes
- **Health**: Sleep, exercise, biometric patterns
- **Communications**: Channel preferences, response patterns
- **Digital History**: 20-year summary of digital life

### Marcus's Constitutional Profile

- **Automation preference**: 75%
- **Primary directive**: Mental wellbeing, flow state maintenance
- **Trust level**: High (rarely overrides)
- **Key protection**: Reduce context-switching, protect deep work

## Development

### Running in Development Mode

```bash
cd backend
npm run dev  # Auto-restarts on file changes
```

### API Documentation

Visit `http://localhost:3001/api` for endpoint documentation.

### Testing API Endpoints

```bash
# Get identity
curl http://localhost:3001/api/context/identity

# Get mode definition
curl http://localhost:3001/api/modes/navigation

# Generate mode explanation
curl -X POST http://localhost:3001/api/llm/explain-mode \
  -H "Content-Type: application/json" \
  -d '{"mode_name": "navigation", "action": "entry", "trigger_type": "calendar"}'
```

## Future Enhancements

The architecture supports future additions:
- **Real-time orchestration**: API structure ready, logic not implemented
- **GUI tools**: Planned for knowledge graph exploration
- **Additional prototypes**: Easy to add new prototype templates

---

*LifeOS Prototype Platform - Part of the LifeOS thesis research project*
