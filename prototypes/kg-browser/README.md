# Knowledge Graph Browser

A lightweight React + Vite application for browsing and exploring Marcus Chen's personal knowledge graph data.

## Features

- **Search**: Real-time search across all knowledge graph data
- **Collapsible Sections**: Expand/collapse any section or nested data
- **Sidebar Navigation**: Quick jump to any category
- **Keyboard Shortcuts**: 
  - `/` - Focus search
  - `Escape` - Clear search
  - `Ctrl+E` - Expand all sections
  - `Ctrl+C` - Collapse all sections
- **State Persistence**: Remembers expanded/collapsed state and preferences
- **Match Highlighting**: Search results are highlighted in yellow
- **Copy to Clipboard**: Click any value to copy it

## Getting Started

```bash
cd prototypes/kg-browser
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
kg-browser/
├── src/
│   ├── components/     # React components
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper functions and constants
│   └── App.jsx         # Main app component
├── public/
│   └── data/           # Knowledge graph JSON files
└── package.json
```

## Data Files

The app loads 8 knowledge graph JSON files from `public/data/`:
- identity.json
- relationships.json
- behaviors.json
- calendar.json
- locations.json
- health.json
- communications.json
- digital-history.json

## Usage

1. **Search**: Type in the search bar to find specific information across all data
2. **Navigate**: Click sidebar items to jump to sections
3. **Explore**: Click section headers or nested objects to expand/collapse
4. **Copy Values**: Click any value to copy it to your clipboard
