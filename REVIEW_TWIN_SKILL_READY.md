# /review-twin Skill — Ready to Use

## Status: ✅ Complete and Registered

The `/review-twin` Claude Code skill is fully implemented and ready to review correction-driven PKG improvements.

## Quick Start

### Prerequisites

1. **Backend running:**
   ```bash
   cd backend
   export ANTHROPIC_API_KEY=sk-ant-...
   npm start
   ```

2. **Frontend running (for logging corrections):**
   ```bash
   cd prototypes/digital-twin
   npm run dev
   ```

3. **Corrections logged:**
   - Open http://localhost:5176
   - Chat with digital twin
   - Flag (👎) responses that don't sound right
   - Provide corrections (need 3+ for meaningful suggestions)

### Run the Skill

```
/review-twin
```

## What It Does

The skill orchestrates a human-in-the-loop review workflow:

1. **Check Backend** — Verifies the backend API is running
2. **Fetch Suggestions** — Calls `/api/llm/digital-twin/corrections/analyze`
   - Claude Haiku analyzes patterns in your corrections
   - Returns specific PKG improvement suggestions
   - Each suggestion includes: section, current text, proposed change, reasoning, which corrections motivated it
3. **Review Each Suggestion** — One at a time:
   - Displays section, current text, suggested edit, reasoning, and corrections that motivated it
   - You choose: **Approve** (apply the edit) or **Reject** (skip)
4. **Apply Approved Edits** — For each approved suggestion:
   - Claude Code reads the PKG section
   - Applies a contextual edit (preserves your voice and formatting)
   - Confirms with "✓ Applied" message
5. **Summary** — Shows how many suggestions were applied vs. rejected

## Files

| File | Purpose |
|------|---------|
| `.claude/skills/review-twin/SKILL.md` | Skill definition with full documentation |
| `backend/data/corrections/twin-corrections.json` | Your logged corrections (auto-created) |
| `pkg-chris.md` | Your compact PKG (what the skill edits) |

## Example Workflow

```
$ /review-twin

✓ Backend is running

Fetching correction analysis...
Found 3 suggestions for pkg-chris.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suggestion 1 of 3

📍 Section: "Values and Convictions"

Current text:
  - **Form and function are equal partners.** Function cannot exist on its own.

Suggested change:
  Add more assertive language emphasizing frustration with treating craft as mere decoration.

Reasoning: Multiple corrections flagged generic language on this point.

Motivated by: corr_1708192800000, corr_1708192800001

What do you want to do?
  → Approve — apply this edit
  → Reject — skip this one

You chose: Approve

✓ Applied to pkg-chris.md (Values and Convictions section)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Suggestions 2 and 3...]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Review complete

Applied: 2 suggestions
Skipped: 1 suggestion

Review changes with: git diff pkg-chris.md
```

## Key Features

✅ **Human-in-the-loop** — You control all approval decisions
✅ **Contextual edits** — Changes preserve your voice and formatting
✅ **Transparent reasoning** — See why each suggestion was made
✅ **Correction tracking** — Know which corrections motivated each suggestion
✅ **Git-friendly** — No auto-commit; review with `git diff` first
✅ **Graceful handling** — Skips sections that can't be found, continues with others

## What This Demonstrates

This workflow embodies the core thesis principle:
- **Observation**: Twin diverges from your voice
- **Flagging**: You capture where it failed
- **Analysis**: System finds patterns in corrections
- **Suggestion**: AI proposes specific improvements
- **Approval**: You decide what to keep
- **Application**: Changes applied on your terms
- **Verification**: You review the results

At no point does the system bypass your consent. This is **agency-by-default** in AI-mediated systems.

## Troubleshooting

### Backend not running
```bash
cd backend && npm start
```

### No corrections logged yet
Open the digital twin chat (http://localhost:5176), flag some responses with the thumbs-down button, and provide corrections. You need at least 3 for meaningful suggestions.

### No suggestions returned
This means your corrections indicate the PKG is already accurate — great job!

### A section can't be found
The skill will skip that suggestion and continue with others. You can manually review and edit if needed.

## Next Steps (Optional)

- Sync changes to `pkg-chris-full.md` if you want both versions updated
- Review the detailed correction log at `backend/data/corrections/twin-corrections.json`
- Run the skill again after logging more corrections to iterate further
