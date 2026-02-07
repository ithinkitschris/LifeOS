# Response Formats

Structured formats for consistent Claude Code interactions when working with the LifeOS platform.

---

## Format Registry

| Format ID | Purpose | Invocation |
|-----------|---------|------------|
| `scenario` | Generate design scenarios with passive/active intents | "Generate a scenario: [context]" or naturally describe a situation |

---

## Scenario Format

**Purpose:** Generate design scenarios that explore how LifeOS behaves in specific contexts. Used for prototyping, thesis exploration, and validating design decisions against world rules.

**When to use:**
- Exploring how modes activate in real situations
- Designing what intents should surface
- Testing world rules against concrete examples
- Specifying prototype behavior

### Structure

```
## SCENARIO: [Title]

**Date:** [Specific date in 2030]
**Location:** [Physical location]
**Time:** [Time of day]
**Mode:** [Active LifeOS mode]
**Device:** [Tablet/watch/phone/etc.]

**Context Signals:**
- Calendar: [relevant events]
- Location: [location context]
- Co-location: [people present]
- Recent history: [relevant background]
- User's state: [stress/energy/focus level]
- Time: [temporal context]

---

## PASSIVE INTENTS
*(Background monitoring, no user action required)*

### [Intent Name]
**Why it surfaces:** [Explanation of what triggered this]

**What's happening:**
- [What the system is doing]
- [How it manifests in UI]
- [What state it's maintaining]

**Data sources:**
- [What signals/data inform this]
- [PKG patterns referenced]
- [Mode context]

**Agency preservation:** [How this respects user control]

---

## ACTIVE INTENTS
*(User must trigger, bounded experiences)*

### [Intent Name]
**Why available:** [Why this intent is relevant now]

**What it does:**
- [Scope and boundaries]
- [What happens when invoked]
- [Completion condition]

**Entry:** [How user initiates]
**Exit:** [How user leaves or intent completes]

**Design rationale:**
- [Which mode constraints allow this]
- [How it's bounded]
- [How it preserves agency]

---

## DESIGN VALIDATION

**Against World Rules:**
✓ [Principle 1]: [How scenario respects it]
✓ [Principle 2]: [How scenario respects it]
...

**Against User PKG:**
✓ [User preference/pattern]: [How scenario aligns]
✓ [User context]: [How scenario aligns]
...
```

### Key Principles

1. **Grounded in canon**: Every scenario must derive from `backend/data/world/` rules and `backend/data/knowledge-graph/` context
2. **Passive vs. Active clarity**: Passive intents monitor/suggest; Active intents require user choice
3. **Always bounded**: Every active intent has clear entry, scope, and completion
4. **Validated**: Check against design principles and constitutional framework
5. **Agency-preserving**: Show how automation serves user, never overrides

### Variations

**Abbreviated (intents only):**
Skip validation section when iterating quickly on intent ideas.

**Deep dive (single intent):**
Expand one intent with full interaction flows, edge cases, and UI sketches.

**Validation focus:**
Emphasize the validation section when checking existing designs against world rules.

---

## Notes

- Formats are living conventions, not rigid templates
- Adapt as needed for the specific question
- Reference with "use scenario format" or let Claude recognize the context naturally
- Evolve this document as new formats emerge
