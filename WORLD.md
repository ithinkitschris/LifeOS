# LifeOS World Canon — 2030

> **Purpose:** Single source of truth for the LifeOS speculative world. This document defines what LifeOS *is* in 2030—its architecture, principles, constraints, and open questions. All persona knowledge graphs (like Marcus Chen's PKG) and scenarios are derived from this canon.

> **How to use:** When generating scenarios, personas, or design explorations, this document provides the foundational constraints. Anything marked **[LOCKED]** is canonical and should not be contradicted. Anything marked **[OPEN]** is unresolved and can be explored through speculative scenarios.

---

## 1. The World of 2030

### 1.1 Setting

LifeOS exists in a speculative 2030 where:

- AI assistance is deeply embedded in daily life
- The convenience-control tension has become a mainstream societal concern
- Users are increasingly aware of attention manipulation by apps and platforms
- Alternative computing paradigms are being actively explored
- Wearable/ambient computing has matured (neural smartwatches, AR glasses, smart earphones)
- The app-centric model is showing its limitations

**Design constraint:** All LifeOS elements should feel plausible for 2030—ambitious but not fantastical. No magic, no hand-waving.

### 1.2 The Problem LifeOS Solves

The current app-centric computing model creates cognitive overload through:

- **Constant application selection** — Which tool for this task?
- **Context fragmentation** — Managing state across dozens of apps
- **Rapid task transitions** — No meaningful boundaries between activities
- **Adversarial attention design** — Notification systems optimized for engagement, not wellbeing
- **Binary information model** — Show/hide, with nothing in between

**LifeOS premise:** These are interaction design failures, not inevitable trade-offs. A different architectural model can deliver automation benefits while preserving human agency.

### 1.3 The Core Thesis

**Question:** How can interaction design preserve human agency and meaningful oversight while delivering genuine automation benefits like reduced cognitive load, decreased screen dependence, and proactive assistance?

**Argument:** Convenience and control are not necessarily zero-sum opposites. LifeOS demonstrates that automation can enhance rather than erode human agency—if the interaction model is designed thoughtfully.

---

## 2. System Architecture

### 2.1 Mode-Intent Separation [LOCKED]

This is the fundamental architectural decision of LifeOS.

| Concept | Definition | Who Controls | Key Characteristic |
|---------|------------|--------------|-------------------|
| **Mode** | Context-aware stance toward the world | Orchestrator (auto-entry) | Constrains the solution space |
| **Intent** | Bounded action within current mode | User (explicit selection) | User-chosen execution |

**Invariants:**
- Modes are never user-selected (though users can always exit)
- Intents are always user-selected (never auto-executed)
- Available intents are constrained by current mode
- Mode = "what kind of moment this is"; Intent = "what I want to do in this moment"

**Why this matters:** This separation is the core mechanism for preserving agency. Automation handles context assessment (reducing cognitive load) while humans retain action authority (preserving agency).

### 2.2 Three-Layer Attention Model [LOCKED]

Within any mode, information exists on an attention spectrum:

| Layer | Definition | Visibility | User Access |
|-------|------------|------------|-------------|
| **Center** | Primary focus of current stance | Active display | Immediate |
| **Periphery** | Available but de-emphasized | Indicated, not displayed | Pull to view |
| **Silence** | Held until contextually appropriate | Hidden | Request or wait |

**Rules:**
- Every piece of information exists in exactly one layer at any moment
- Layer assignment is mode-specific (same info might be Center in one mode, Silence in another)
- Movement between layers follows triage rules informed by constitutional values
- User can always pull from Periphery or request from Silence

**Design principle:** This is calm technology in practice—information available at appropriate attention levels, not demanding attention or completely hidden.

### 2.3 Provider-Orchestrator-Intent Flow [LOCKED]

```
[Providers] → [Orchestrator] → [Constitutional Check] → [Intent Experience]
     ↓              ↓                    ↓                      ↓
  Data/APIs    Processing         Validation            User interaction
  Capabilities  Synthesis         Filtering             Bounded scope
  Content       Decisions         Manipulation check    Clear exit
```

**Provider role:**
- Supply data, APIs, capabilities, content
- Have business models and agendas
- Cannot directly reach user

**Orchestrator role:**
- Synthesizes provider information
- Makes presentation decisions
- Applies constitutional rules
- Constructs bounded experiences
- Has final authority over what reaches user

**Why apps become obsolete:** When the orchestrator can determine context (mode), surface relevant capabilities (available intents), generate purpose-built interfaces (intent experiences), and filter manipulation (constitutional validation)—the app as intermediary is no longer necessary.

### 2.4 Dashboard: The Neutral Clearing [LOCKED]

A timeline visualization with three temporal zones:

| Zone | Content | Purpose |
|------|---------|---------|
| **Past** | Completed modes, actions taken, what was held, triage decisions | Verification, audit, trust-building |
| **Present** | Current mode, activation reasoning, active holds, periphery contents | Awareness, correction surface |
| **Future** | Predicted modes, scheduled events, queued intents | Preview, adjustment, preparation |

**Properties:**
- Always accessible (never mode-locked)
- Neutral ground (no mode applies in dashboard)
- Visible escape hatch from any mode
- Retrospective verification builds trust
- Correction surface for adjusting system behavior

---

## 3. Mode Mechanics

### 3.1 Activation Model [LOCKED]

**Confidence-based entry:**
- Multiple context signals contribute to confidence score
- Each signal has weight based on reliability and relevance
- Confidence must exceed threshold for activation

**Threshold types:**

| Threshold | Behavior |
|-----------|----------|
| **Soft activation** (~0.60) | System suggests mode: "Looks like you're entering Focus. Confirm?" |
| **Hard activation** (~0.85) | System enters mode automatically, explanation available |
| **Exit threshold** (~0.40) | Hysteresis—must drop below this to exit |

**Hysteresis rationale:** Different thresholds for entry vs. exit prevents oscillation. Once in a mode, stay until clearly no longer appropriate.

### 3.2 Exit Design [LOCKED]

**Invariant:** Exit is always possible. User is never locked into a mode.

**Friction design:**
- Exit has friction, but friction is *informational*, not obstructive
- Friction surfaces trade-offs: "This is what you're leaving; this is what changes"
- Friction never punishes, shames, or creates dead ends
- Exit option always visible

**Exit friction template:**
```
You're leaving [Mode Name].

What changes:
• [Specific change 1]
• [Specific change 2]
• [What was held will become active]

Why you might stay:
• [Contextual reason]
• [Progress indicator if applicable]

[Exit anyway]  [Stay in mode]
```

### 3.3 Mode Collision [OPEN]

**Unresolved:** What happens when two modes have equal or near-equal confidence?

**Candidate approaches to explore:**
- Recency bias (stay in current mode unless new mode clearly dominant)
- User tiebreaker (soft prompt for ambiguous cases)
- Hierarchical priority (some modes trump others)
- Hybrid mode (rare—elements of both)

---

## 4. Intent Design

### 4.1 Intent Requirements [LOCKED]

Every intent must have:

| Requirement | Description |
|-------------|-------------|
| **Clear entry** | How user accesses/initiates the intent |
| **Bounded scope** | What the intent includes and explicitly excludes |
| **Completion condition** | How user knows they're done |
| **Exit path** | How to leave before completion |
| **Mode constraints** | Which modes this intent is available in |

**Rationale:** Bounded experiences, not infinite feeds. Every intent has designed completion, not endless engagement.

### 4.2 Intent vs. App

| Traditional App | LifeOS Intent |
|-----------------|---------------|
| General-purpose tool | Specific goal accomplishment |
| User selects app, then figures out task | User selects intent based on goal |
| Persistent, always available | Available based on context (mode) |
| Business model may conflict with user goals | Orchestrator filters for user goals |
| Infinite engagement possible | Bounded with completion designed in |

### 4.3 Intent Inheritance [OPEN]

**Unresolved:** Can intents span mode transitions, or do they terminate on mode exit?

**Candidate approaches:**
- Hard termination (intent ends when mode ends)
- Graceful handoff (intent pauses, can resume if mode re-entered)
- Intent completion priority (mode exit blocked until intent completes, with override)

---

## 5. Constitutional Framework

### 5.1 How It Works [LOCKED]

1. Users articulate values through natural conversation and structured prompts
2. System probes with scenarios to clarify value boundaries
3. Values translated into operational rules
4. Rules inform triage decisions, mode behavior, provider filtering
5. Conflicts between values surfaced for user resolution
6. Values refined through real-world testing and feedback

### 5.2 Value-to-Rule Translation

**Example value:** "I want to be present with people when I'm with them"

**Derived rules:**
- Social context detected → increase notification hold threshold
- Co-located contacts detected → reduce periphery visibility
- Social mode available when social signals strong
- Work content during social time → Silence unless emergency

### 5.3 Constitutional Conflict [OPEN]

**Unresolved:** How does the system handle values that contradict in specific scenarios?

**Example conflict:**
- Value A: "I don't want to miss actually important things"
- Value B: "Work shouldn't bleed into everything"
- Scenario: Important work message arrives during family dinner

**Likely approach:** Surface conflict to user with options rather than system deciding autonomously.

---

## 6. Device Ecosystem

### 6.1 Two-Tier Model [LOCKED]

**Information Interfaces (orchestration & primary interaction):**

| Device | Role |
|--------|------|
| Phone/Tablet | Core orchestrator, real-time state detection, primary interaction |
| Desktop | Computing hub, high-performance tasks, extended sessions |

**Peripheral Interfaces (sensing & ambient output):**

| Device | Role |
|--------|------|
| Neural Smartwatch | Biometric sensing, haptic feedback, ambient notifications |
| AR Glasses | Ambient information display, environmental awareness |
| Earphones | Audio output, voice input, contextual audio |

**Key principle:** Peripheral devices sense and output; they never orchestrate.

### 6.2 Attention Layer Mapping

| Attention Layer | Peripheral Display |
|-----------------|-------------------|
| Center | Not shown on peripherals (requires primary device) |
| Periphery | Indicated on watch/glasses (counts, presence) |
| Silence | No indication on any device |

---

## 7. Core Design Principles [LOCKED]

1. **Modes Constrain, Intents Execute**
   - Modes define stance and solution space
   - Intents are user-chosen actions within that space
   - Never conflate these

2. **Center-Periphery-Silence (Not Binary)**
   - Information exists on attention spectrum
   - Reject show/hide binary thinking

3. **Automation Must Be Reversible, Explainable, and Auditable**
   - Instant undo for mode changes
   - Plain-language explanations for all decisions
   - Dashboard provides retrospective audit trail

4. **Freedom Preserved Through Explicit Trade-offs**
   - Context switching always possible
   - Friction makes costs visible
   - Freedom ≠ frictionless; freedom means informed choice

5. **No Punishment, No Shame, No Dead Ends**
   - System never locks users out or judges choices
   - Override patterns become learning signals, not defiance
   - Every state has exit path

6. **Constitutional Co-Design**
   - Users articulate values that inform system policies
   - System tests values against real scenarios to refine understanding

7. **Orchestrator as Guardian Against Manipulation**
   - Final oversight over provider-supplied information
   - Validates against constitutional rules
   - Checks for engagement manipulation, dark patterns, misinformation

8. **Bounded Experiences, Not Infinite Feeds**
   - Clear entry and exit conditions for every intent
   - Completion designed in, not endless scroll

---

## 8. Defined Modes

### 8.1 Navigation Mode

**Purpose:** Active when user is traveling to a destination. Optimizes for wayfinding while protecting attention.

**Activation triggers:**
- Calendar event with different location approaching
- User initiates travel/directions query
- GPS movement pattern suggests transit

**Confidence signals:**
- Calendar certainty (confirmed vs. tentative)
- Location delta (distance to destination)
- Time pressure (buffer available)
- Historical patterns (familiar route?)

**Attention triage:**

| Layer | Content |
|-------|---------|
| Center | Route guidance, ETA, destination preparation |
| Periphery | Message counts (no content), batched notifications, media controls |
| Silence | Social media, news, non-urgent email, marketing |

**Exit conditions:**
- Arrival at destination (automatic soft exit)
- Route becomes irrelevant (event cancelled)
- User explicit exit (with friction)

### 8.2 Focus Mode

**Purpose:** Active during deep work requiring sustained attention. Maximizes protection from interruption.

**Activation triggers:**
- User declares focus time
- Calendar "focus block" detected
- Work pattern signals (specific apps, typing patterns)

**Attention triage:**

| Layer | Content |
|-------|---------|
| Center | Current work task, relevant documents |
| Periphery | Timer, emergency-only contacts |
| Silence | Everything else |

### 8.3 Social Mode

**Purpose:** Active during interpersonal interaction. Optimizes for presence with people.

**Activation triggers:**
- Co-located contacts detected
- Calendar social event
- User declares social time

**Attention triage:**

| Layer | Content |
|-------|---------|
| Center | Present moment (minimal digital) |
| Periphery | Emergency contacts only |
| Silence | All notifications, work content |

### 8.4 Rest Mode

**Purpose:** Downtime and recovery periods.

**Activation triggers:**
- Time-based (evening hours)
- User declares rest
- Health signals (fatigue indicators)

### 8.5 Work Mode

**Purpose:** Professional tasks and communications.

**Activation triggers:**
- Scheduled work hours
- Work location detected
- User declares work time

---

## 9. Open Questions

These are unresolved design questions that can be explored through speculative scenarios:

| ID | Question | Notes |
|----|----------|-------|
| OQ-1 | Mode collision handling | What when two modes have equal confidence? |
| OQ-2 | Intent inheritance | Do intents survive mode transitions? |
| OQ-3 | Constitutional conflict | How to handle contradicting values? |
| OQ-4 | Urgency determination | What pierces Silence? Who decides? |
| OQ-5 | Learning from overrides | How much should system adapt? |
| OQ-6 | Multi-user contexts | Shared spaces, conflicting modes |
| OQ-7 | Onboarding flow | How do users articulate initial values? |
| OQ-8 | Trust calibration | How does system earn more autonomy over time? |
| OQ-9 | Provider resistance | How do providers adapt to losing direct access? |
| OQ-10 | Edge cases | What scenarios break the model? |

---

## 10. Research Grounding

### AI Safety Concepts Applied

| Concept | LifeOS Application |
|---------|-------------------|
| Alignment | Constitutional framework aligns system with user-stated values |
| Corrigibility | Always-available exit, override patterns as learning signals |
| Transparency | Plain-language explanations, dashboard audit trail |
| Bounded autonomy | Modes constrain (automated), intents execute (user-chosen) |

### Interaction Design Principles Applied

| Principle | LifeOS Application |
|-----------|-------------------|
| Calm technology | Three-layer attention respects attention spectrum |
| Friction as feature | Exit friction surfaces trade-offs without obstruction |
| Progressive disclosure | Information available at appropriate attention levels |
| User control | Agency preserved at action level (intents) |

---

## 11. Design Constraints

### Current Stance [LOCKED FOR RESEARCH PHASE]

**LifeOS is single-mode: low agency, high automation.**

- No configurable agency levels
- No user-adjustable automation intensity
- System makes context decisions; users make action decisions

**Rationale:** This constraint exists to surface the risks of fully agentic operating systems through speculative design. The provocative research phase uses this to force users to confront what they're trading for convenience.

### Plausibility Constraint

All elements must feel achievable by 2030:
- Technology exists or is clearly emerging
- No hand-waving about "AI will figure it out"
- Social/adoption dynamics considered

---

## 12. Changelog

| Date | Change |
|------|--------|
| Feb 2025 | Initial WORLD.md created, synthesizing thesis context and world state |

---

## Using This Document

**For scenario generation:**
- Reference locked sections as constraints
- Explore open questions through scenarios
- Ensure scenarios respect the mode-intent separation
- Test constitutional conflicts

**For PKG generation:**
- Persona values must map to constitutional framework
- Persona behaviors should create interesting mode interactions
- Relationships should span different triage tiers

**For design exploration:**
- Use open questions as starting points
- Propose resolutions through concrete scenarios
- Flag anything that contradicts locked decisions
