---
name: review-twin
description: Review and apply PKG improvements suggested by digital twin corrections. Walks through each correction-driven suggestion one by one for approval.
allowed-tools: Bash, Read, Edit, AskUserQuestion
---

# Review Twin Corrections & Apply PKG Improvements

Walk through suggestions for improving Chris's PKG based on logged corrections from the digital twin. Approve or reject each suggestion, and apply approved edits directly to the PKG.

## How It Works

1. Fetches correction analysis from the backend
2. Displays each suggestion one at a time (section, current text, proposed change, what drove it)
3. For each: you approve or reject
4. Applied edits are made directly to `pkg-chris.md`
5. Summary of what changed

## Before You Begin

**Start the backend** if not already running:
```bash
cd backend
export ANTHROPIC_API_KEY=sk-ant-...
npm start
```

**Log some corrections** in the digital twin chat (http://localhost:5176):
- Send messages to the twin
- Flag responses that don't sound right (👎)
- Provide corrections explaining what was off or what it should have said
- Need at least 3 corrections for meaningful suggestions

## The Workflow

### Step 1: Check Backend

Verifies that the backend is running and accessible.

### Step 2: Fetch Suggestions

Calls `GET http://localhost:3001/api/llm/digital-twin/corrections/analyze`

Expected response:
```json
{
  "suggestions": [
    {
      "section": "Conversational Patterns",
      "current_text": "**Verbal tics:** \"Right?\" as a check-in...",
      "suggested_edit": "Add: \"'I obviously couldn't resist' when talking about projects that excite me.\"",
      "reasoning": "Multiple corrections flagged missing conversational tics.",
      "based_on_corrections": ["corr_1708192800000", "corr_1708192800001"]
    }
  ],
  "correction_count": 5
}
```

### Step 3: Review Each Suggestion

For each suggestion:
- **Section:** Where in the PKG to make the change
- **Current text:** What's there now
- **Suggested edit:** What to add/change
- **Reasoning:** Why the analysis thinks this improves authenticity
- **Corrections:** Which of your flagged corrections motivated this suggestion

You decide: **Approve** (apply it) or **Reject** (skip it).

### Step 4: Apply Approved Edits

For each approved suggestion:
1. Read the relevant PKG section
2. Locate the text to modify
3. Apply the Edit using Claude Code's Edit tool
4. Confirm the change

If a section can't be found, the skill skips and moves to the next suggestion.

### Step 5: Summary

Shows:
- How many suggestions were approved/rejected
- Which PKG file was updated
- Reminder that you may need to apply the same changes to `pkg-chris-full.md` separately if you want both versions updated

## Important Notes

### PKG Files

This skill edits `pkg-chris.md` (compact) by default. If you want the same improvements in `pkg-chris-full.md` (full), you can run the skill again after renaming or manually sync changes.

### Suggested Edit Interpretation

The `suggested_edit` is a description, not a literal copy-paste. The skill reads the PKG section and applies a **contextual edit** that preserves your voice and formatting. For example:

- ❌ Don't: Replace entire section with suggested text
- ✅ Do: Understand the suggestion and integrate it into the existing text

### No Auto-Commit

Changes are made to your local files but NOT committed to git. You can review all changes with:
```bash
git diff pkg-chris.md
```

Then decide whether to commit them yourself.

### Rejecting Suggestions

If a suggestion doesn't fit your voice or seems wrong, reject it. The system learns from what you reject too — future analyses will be more accurate.

## Example Session

```
$ /review-twin

✓ Backend is running

Fetching corrections analysis...
Found 5 corrections, generating suggestions...
Analyzing 5 corrections for PKG improvements...

Found 3 suggestions for pkg-chris.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suggestion 1 of 3

📍 Section: "Values and Convictions"

Current text:
  - **Form and function are equal partners.** Function cannot exist on its own.

Suggested change:
  Add more assertive language. One correction said: "Too generic. I'd emphasize that I'm genuinely frustrated by people who treat craft as decoration."

Motivated by: corr_1708192800000, corr_1708192800001

What do you want to do?
  → Approve — apply this edit
  → Reject — skip this one

You chose: Approve

✓ Applied to pkg-chris.md (Values and Convictions section)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Suggestion 2 of 3
...
```

## Troubleshooting

**Backend not running:**
```bash
cd backend && npm start
```

**No corrections logged yet:**
Flag some responses in the digital twin chat first (http://localhost:5176). Need at least 3 for meaningful suggestions.

**Suggestions don't seem right:**
The analysis is based on your corrections. If the suggestions miss the mark, the corrections might not have been specific enough. Try flagging more responses with detailed corrections.

**Want to redo it?**
Corrections are persisted in `backend/data/corrections/twin-corrections.json`. You can:
- Delete that file to start fresh
- Run `/review-twin` again to get a new analysis

## The Philosophy Behind This

This workflow treats corrections as **training data** that you control:

- ✅ You flag when something's off
- ✅ The system analyzes patterns you've highlighted
- ✅ Claude suggests specific PKG improvements
- ✅ You approve/reject each change
- ✅ You maintain full agency over your representation

It's reinforcement learning where you stay in the loop — automation helping you, not replacing you.

## What This Accomplishes (For Your Thesis)

This is a concrete prototype of **human-in-the-loop AI improvement**:

1. **Observation** — Twin diverges from your authentic voice
2. **Flagging** — You capture where it failed
3. **Analysis** — System finds patterns in your corrections
4. **Suggestion** — AI proposes specific improvements
5. **Approval** — You decide what to keep
6. **Application** — Changes are made on your terms
7. **Verification** — You review the results

At no point does the system bypass your consent. This is what "preserving agency in AI-mediated systems" looks like in practice.
