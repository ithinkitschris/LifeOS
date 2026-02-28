---
name: scenario
description: Generate a LifeOS scenario that tests the architecture against a realistic human situation. Use when exploring design tensions, testing mode interactions, investigating open questions, or when the user asks for a scenario.
allowed-tools: Read, Grep, Glob, Bash
---

# LifeOS Scenario Generation

Generate speculative scenarios that test the LifeOS architecture through the user's PKG-powered experience.

## Before You Begin

**Read the source material:**

1. **WORLD.md** — The world canon. Pay attention to:
   - Locked sections (constraints you must respect)
   - Open questions (tensions worth exploring)
   - Mode definitions and their triage rules
   - The constitutional framework

2. **The PKG** — Read files in `knowledge/pkg/`:
   - `core/identity.md` — Who the user is
   - `core/values.md` — Their values and priorities
   - `context/life.md` — Current life situation
   - `positions/technology.md` — Augmentation-agency lens

3. **Open questions** — Check `data/world/open-questions.yaml` for unresolved tensions

## Scenario Structure

Every scenario should follow this structure:

### 1. Setup
- Where is the user? (location, time, physical context — from PKG)
- What's their current mode? (and why — what signals triggered it?)
- What's their internal state? (energy, mood, cognitive load)
- What's in Center, Periphery, and Silence right now?

### 2. Trigger
- What event or need initiates LifeOS involvement?
- Is this an external interrupt or internal recognition?
- How does this interact with their current mode?

### 3. LifeOS Response
- What does the orchestrator surface?
- Which attention layer does it appear in?
- What's the reasoning? (make this explicit)
- What intents become available?

### 4. The Tension
- What competing priorities arise?
- Where do the user's values conflict?
- What does LifeOS "want" to do vs. what the user might want?
- What's the agency tradeoff here?

### 5. The User's Response
- What do they perceive?
- What do they choose to do?
- Do they accept LifeOS's framing or override it?
- How do they feel about the interaction?

### 6. Resolution & Reflection
- What happens next?
- What does this reveal about the architecture?
- Did LifeOS preserve agency? How?
- What design question does this scenario illuminate?

## What Makes a Good Scenario

**Do:**
- Test a specific architectural element (mode collision, constitutional conflict, intent inheritance, urgency determination)
- Create situations with competing priorities and no obvious right answer
- Show both what LifeOS does AND how they experience it
- Ground in plausible 2030 technology
- Reference specific elements from the user's PKG (real relationships, real values)
- Surface uncomfortable implications of the architecture

**Don't:**
- Write feature demos ("the user asks LifeOS to schedule a meeting")
- Create happy paths with obvious resolutions
- Ignore world rules or the user's established PKG context
- Hand-wave the technology ("AI figures it out")
- Resolve tensions too neatly

## Scenario Types to Consider

### Mode Collision (OQ-1)
Two modes have equal or near-equal confidence. What happens?
- Work call coming in during family dinner
- Exercise time overlapping with a creative flow state
- Social event where work emergency occurs

### Constitutional Conflict (OQ-3)
the user's stated values contradict in a specific moment.
- "Be present with family" vs. "Don't miss important work"
- "Protect my focus time" vs. "Be responsive to my team"
- "Prioritize health" vs. "Meet this deadline"

### Urgency Determination (OQ-4)
Something tries to pierce Silence. Should it?
- Message from an unknown number with urgent language
- Calendar reminder for something the user forgot they scheduled
- Health alert during a critical meeting

### Intent Inheritance (OQ-2)
Mode is about to transition. What happens to the active intent?
- Deep in a document when Navigation mode triggers
- Mid-conversation when Focus mode activates
- Composing a message when Social mode begins

### Trust Boundaries (OQ-8)
LifeOS makes a decision. Should it have?
- Auto-declining a meeting based on patterns
- Rescheduling something without explicit approval
- Surfacing something the user didn't ask for

### Edge Cases (OQ-10)
Find scenarios that break or strain the model.
- Rapid context switching
- Contradictory signals
- Gaming/manipulation attempts
- System failures and recovery

## Output Format

Present the scenario in narrative form, with clear section breaks. Include:

1. A **title** that captures the tension being explored
2. An **open question tag** (e.g., "Explores: OQ-3 Constitutional Conflict")
3. The **narrative** following the structure above
4. A **design implications** section at the end

## After Generating

Save the scenario to the dashboard so it's browsable at `/scenarios`:

```bash
curl -X POST http://localhost:3001/api/conversations/import \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "THE_USER_PROMPT"}, {"role": "assistant", "content": "THE_SCENARIO_YOU_GENERATED"}], "source": "claude-code"}'
```

For follow-up scenarios in the same thread, use the conversation ID returned from the first call:

```bash
curl -X POST http://localhost:3001/api/conversations/{id}/import \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "FOLLOW_UP"}, {"role": "assistant", "content": "CONTINUATION"}]}'
```

## Example Prompt Patterns

User might ask:
- "Generate a scenario where..." → Full scenario generation
- "What happens when [situation]?" → Scenario exploring that situation
- "Explore OQ-3" → Scenario specifically targeting that open question
- "Break the model" → Edge case scenario that strains the architecture
- "Continue the scenario" → Extend an existing scenario thread

$ARGUMENTS
