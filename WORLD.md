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

### 2.1 Multi-Model Cooperation Stack [LOCKED]

LifeOS operates as a **multi-model cooperation stack** where specialized subsystems handle perception, cognition, memory, safety, and information integrity. No single model does everything — intelligence is distributed across specialized layers coordinated by the Orchestrator.

> **Full technical specification:** `backend/data/world/system-architecture.yaml`

#### The Orchestrator (Central Hub)

The traffic controller and the **only component that touches everything**. It does not "think" deeply on its own — it routes tasks to the right specialist.

**Flow:** All inputs (user voice, video, external news) arrive here → routed to specialists → validated by Safety → checked against Constitution → outputs delivered to user.

#### Perception Layer ("The Senses")

Gives LifeOS eyes and ears to understand the user's immediate physical reality.

| Component | Function |
|-----------|----------|
| **VLM (Vision-Language Models)** | Converts raw data streams (video, audio, screen) into text descriptions and embeddings |
| **World Models** | System's "intuition" about physics and time — predicts what happens next in the user's environment |
| **Perception & Grounding** | The Bridge — synthesizes VLM output and World Model predictions into a coherent "current state" for the Orchestrator |

#### Cognition & Safety Stack ("The Brain")

Splits thinking into two speeds, modeled after System 1 vs. System 2 in psychology.

| Component | Speed | Location | Purpose |
|-----------|-------|----------|---------|
| **Decision Making** | Fast (System 1) | On-device | Quick tasks — lights, reminders, simple lookups. Prioritizes speed and privacy. |
| **Large-scale Reasoning** | Slow (System 2) | Cloud | Complex planning, research synthesis, multi-step reasoning with tool use. |
| **Safety, Governance, Verification** | — | Both | The Kill Switch — every plan must pass constraint checking, red-teaming, and audit logging before execution. |

**Invariant:** No plan reaches execution without passing through Safety.

#### Personal Context ("Memory & Values")

What makes the OS *yours* rather than a generic chatbot.

| Component | Role | Key Feature |
|-----------|------|-------------|
| **Personal Knowledge Graph** | Long-term Memory | Provenance chips — the system remembers *where* it learned each fact |
| **Personal Constitution** | Moral Compass | Explicit user-articulated rules that actively constrain system behavior |
| **Privacy** | The Vault | Data retention (TTLs), redaction, deletion policies, access control |

#### Information Integrity Stack ("The Library")

Ingests the chaotic external world and cleans it before it touches personal data.

| Component | Role | Function |
|-----------|------|----------|
| **External Provider Data** | Raw Feed | Social media, news, messaging, navigation, commerce — providers have agendas and cannot directly reach users |
| **Verification & Provenance** | The Filter | Deepfake detection, source authentication, fact verification |
| **Constitutional Filtering** | Alignment Check | Filters verified data against Personal Constitution values |
| **Information Augmentation (RAG)** | The Synthesis | Matches current query with verified external data, augmented by personal context |

#### Data Flow Example

```
User: "Plan a dinner for my anniversary"

1. Perception    → VLM sees kitchen; World Model knows it's evening
2. Context       → PKG recalls anniversary date and partner's allergies
3. External      → Search restaurants → Verify (remove fake reviews) → Constitutional Filter (dietary values)
4. Reasoning     → System 2 creates plan: "Book table at X, order flowers from Y"
5. Safety        → Verify plan (budget limits, authorization)
6. Execution     → System 1 executes booking tool
7. Output        → Confirmation displayed on phone
```

### 2.2 Domain–Mode–Intent Framework [LOCKED]

This is the fundamental interaction-level architectural decision of LifeOS. The framework follows a four-stage flow:

```
Life Domain → Mode → Intent → UI
     ↓          ↓        ↓       ↓
  Category   Stance   Action  Interface
```

| Concept | Definition | Who Controls | Key Characteristic |
|---------|------------|--------------|-------------------|
| **Life Domain** | Category of human activity | User-defined | Foundation for mode generation |
| **Mode** | Fluid, contextual stance within a domain | Orchestrator (auto-entry) | Constrains available intents |
| **Intent** | Bounded action within current mode | User (explicit selection) | User-chosen execution |
| **UI** | Dynamically generated interface | Orchestrator | Purpose-built for intent |

**Key Principles:**
- **Modes are fluid** — They emerge from the intersection of domain and situation, not from a fixed list
- **Modes are never user-selected** (though users can always exit)
- **Intents are always user-selected** (never auto-executed)
- **Available intents are constrained by current mode**
- **Mode = "contextual stance within a domain"; Intent = "what I want to do in this moment"**

**Why this matters:** This separation is the core mechanism for preserving agency. Life Domains provide stable organization, Modes handle context assessment (reducing cognitive load), while humans retain action authority through Intent selection (preserving agency). The UI is generated per-intent, not as a generic app.

### 2.3 Three-Layer Attention Model [LOCKED]

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

### 2.4 Provider-Orchestrator-Intent Flow [LOCKED]

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

### 2.5 Dashboard: The Neutral Clearing [LOCKED]

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

## 5. Provider Integration Model

> **Full specification:** `backend/data/world/provider-integration.yaml`

### 5.1 The Paradigm Shift [LOCKED]

**Traditional computing:** User → App Selection → App Interface → Service

**LifeOS computing:** Provider → Information Integrity → Orchestrator → Intent → User

The critical difference: **Providers cannot directly reach users.** All information flows through integrity verification and constitutional filtering before the Orchestrator decides what reaches the user and how.

### 5.2 The Three-Stage Flow [LOCKED]

Every piece of external information follows this path. No shortcuts, no direct access, no bypassing the integrity layer.

#### Stage 1: External Providers Supply Raw Data

Brands and services (Spotify, NYT, WhatsApp, Maps, etc.) provide data, APIs, and capabilities. They have business models and agendas, but **cannot directly reach the user**.

**Provider Categories:**
- Social Media (Instagram, TikTok, LinkedIn)
- Messaging (WhatsApp, Telegram, Signal)
- News (NYT, WSJ, Reuters)
- Navigation (Google Maps, Waze)
- Commerce (Amazon, Uber, DoorDash)
- Entertainment (Spotify, Netflix, YouTube)
- Productivity (Google Calendar, Notion, GitHub)
- Health & Fitness (Strava, Oura, Headspace)

#### Stage 2: Information Integrity Stack Filters & Verifies

Before external data reaches you, it passes through verification and constitutional filtering. **This is the trust mechanism** that protects users from manipulation.

| Component | Function | Purpose |
|-----------|----------|---------|
| **Verification & Provenance** | Deepfake detection, source authentication, fact checking | Validates information reliability |
| **Constitutional Filtering** | Aligns verified data with Personal Constitution | Ensures provider data matches user values |
| **Information Augmentation (RAG)** | Matches query with verified data + personal context | Synthesizes personalized, trustworthy responses |

#### Stage 3: Orchestrator Generates Contextual UI & Intents

The Orchestrator has **final authority** over what reaches users and how. It:

- Determines current mode (context-aware stance)
- Surfaces relevant intents (available actions for this moment)
- Triages information into Center/Periphery/Silence
- Generates UI that serves the selected intent
- Synthesizes data from multiple providers in one experience

### 5.3 Why Apps Become Obsolete [LOCKED]

When the orchestrator can determine context (mode), surface relevant capabilities (available intents), generate purpose-built interfaces (intent experiences), and filter manipulation (constitutional validation)—**the app as intermediary is no longer necessary**.

| Traditional App | LifeOS Provider |
|-----------------|-----------------|
| User selects app, then figures out task | User selects intent based on goal |
| General-purpose tool | Specific goal accomplishment |
| Business model may conflict with user goals | Orchestrator filters for user goals, blocks manipulation |
| Persistent, always demanding attention | Available based on context (mode), not persistent |
| Infinite engagement possible | Bounded with completion designed in |
| Context lives in user's head | Context maintained by system |

### 5.4 Provider Integration Requirements

For a service to integrate as a provider:

**Technical Requirements:**
- Provider API specification (data query, action execution)
- Secure authentication (OAuth 2.0)
- Rate limiting and quotas
- Structured data schema (JSON/GraphQL)

**Integrity Requirements:**
- Provenance metadata (source, timestamp, author)
- Content authenticity indicators (C2PA, cryptographic signatures)
- Real-time update mechanism (webhooks)

**Governance Requirements:**
- Data minimization (collect minimum viable data)
- Explicit user consent (clear purpose, revocable)
- Audit trail (all actions logged)

### 5.5 User Benefits

| Benefit | Description |
|---------|-------------|
| **No Context Switching** | System maintains context—no mental overhead of app selection |
| **Protected from Manipulation** | Information Integrity blocks dark patterns and engagement optimization |
| **Constitutional Alignment** | Information filtered through Personal Constitution, not provider incentives |
| **Attention-Aware Triage** | Center/Periphery/Silence based on mode and values, not notification counts |
| **Purpose-Built Interfaces** | UI generated for specific intent, with clear completion |
| **Multi-Provider Synthesis** | Combine data from multiple providers in single coherent experience |

---

## 6. Constitutional Framework

### 6.1 How It Works [LOCKED]

1. Users articulate values through natural conversation and structured prompts
2. System probes with scenarios to clarify value boundaries
3. Values translated into operational rules
4. Rules inform triage decisions, mode behavior, provider filtering
5. Conflicts between values surfaced for user resolution
6. Values refined through real-world testing and feedback

### 6.2 Value-to-Rule Translation

**Example value:** "I want to be present with people when I'm with them"

**Derived rules:**
- Social context detected → increase notification hold threshold
- Co-located contacts detected → reduce periphery visibility
- Social mode available when social signals strong
- Work content during social time → Silence unless emergency

### 6.3 Constitutional Conflict [OPEN]

**Unresolved:** How does the system handle values that contradict in specific scenarios?

**Example conflict:**
- Value A: "I don't want to miss actually important things"
- Value B: "Work shouldn't bleed into everything"
- Scenario: Important work message arrives during family dinner

**Likely approach:** Surface conflict to user with options rather than system deciding autonomously.

---

## 7. Device Ecosystem

### 7.1 Two-Tier Model [LOCKED]

**Architecture:** LifeOS operates through a two-tier device ecosystem. Information Interfaces handle orchestration and primary interaction; Peripheral Interfaces provide sensing and ambient output. Each device occupies a specific role in the attention spectrum.

**Key principle:** Peripheral devices sense and output; they never orchestrate.

### 7.2 Information Interface

**Foldable Tablet** — Core Information Interface

| Characteristic | Description |
|----------------|-------------|
| Role | Primary orchestration device and interaction surface |
| Properties | Immersive, Authoritative, Persistent |
| Capabilities | Supports attention-heavy tasks and full workflows |
| Form Factor | Dual mode: folded (phone-scale portability) / unfolded (tablet-scale workspace) |
| Attention Layers | Center (full display), Periphery (glanceable sections) |

The foldable tablet is the canonical information interface—it runs the orchestrator, synthesizes mode confidence signals, and provides the immersive surface for Center-layer content.

### 7.3 Peripheral Interfaces

**Neural Smartwatch** — Core Contextual Interface

| Characteristic | Description |
|----------------|-------------|
| UI Modality | Spatial UI, Haptic-First Interaction |
| Role | Real-time state detection and non-interrupting context control |
| Sensing | Physiological state (HRV, skin conductance), usage patterns, location dynamics |
| Ecosystems Integration | Temporal mapping (circadian rhythms), biometric fusion, movement patterns |
| Health Domain | Stress indicators, energy levels, recovery state, sleep quality |
| Output | Haptic notifications, peripheral awareness indicators (counts, not content) |
| Attention Layers | Periphery (indicated presence), Silence (no indication) |

The "neural" designation refers to advanced biometric sensing that captures physiological state for mode confidence signals. The watch is the primary sensing hub for contextual awareness.

**Glass (AR Glasses)** — Core Contextual Interface

| Characteristic | Description |
|----------------|-------------|
| UI Modality | Visual UI, Just-in-Time Ambient Perception |
| Role | Visual situated intelligence and context-aware information overlays |
| Sensing | Visual context (scene understanding), auditory gestures, environmental awareness |
| Output | Location-aware AR overlays, micro-alerts that dissolve into periphery, facial recognition |
| Embedded Knowledge | Just-in-time information as part of real-world interaction |
| Attention Layers | Periphery (ambient overlays, subtle indicators), Silence (no display) |

Glass provides ambient information augmentation without demanding attention. Overlays appear contextually and fade when not relevant. Never shows Center-layer content—that requires the primary interface.

**Earphones** — Secondary Interface

| Characteristic | Description |
|----------------|-------------|
| UI Modality | Audio UI, Secondary Conversational Perception |
| Role | Audio-based awareness and voice interaction |
| Sensing | Ambient interceptions (voice transcriptions, sentiment analysis), conversational input |
| Output | Whispered summaries, bias alerts, fragmented sound reproduction, contextual audio cues |
| Coupling | Ultra-loose (least orchestration dependency) |
| Attention Layers | Periphery (subtle audio cues), Silence (no audio) |

"Ultra-loose" coupling means earphones operate semi-independently for audio playback while respecting mode-based attention triage for notifications.

### 7.4 Device Interaction Principles [LOCKED]

1. **No Peripheral Orchestration**
   - Peripheral devices never make mode decisions or orchestrate system state
   - Only information interfaces have sufficient context for safe orchestration

2. **Distributed Sensing**
   - Multiple devices contribute different signal types for mode confidence
   - Watch: biometrics; Glass: environmental; Earphones: audio; Tablet: interaction patterns

3. **Output Appropriateness**
   - Information delivered through most contextually appropriate device
   - Haptic for non-interrupting awareness, visual for environmental context, audio for hands-free, immersive for attention-heavy work

4. **Graceful Degradation**
   - System functions with any subset of devices
   - Reduced sensing → higher confirmation thresholds for mode activation

### 7.5 Attention Layer Mapping [LOCKED]

| Attention Layer | Peripheral Display | Rationale |
|-----------------|-------------------|-----------|
| Center | Not shown on peripherals | Center content requires immersive attention (tablet only) |
| Periphery | Indicated on watch/glass/earphones | Awareness without demanding attention |
| Silence | No indication on any device | Invisible until contextually appropriate |

---

## 8. Core Design Principles [LOCKED]

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

## 9. Life Domains

### 9.1 Domain Overview [LOCKED]

LifeOS organizes human experience across **seven fundamental life domains**. These domains represent the major categories of human activity and attention. The system uses domain awareness to inform mode activation, triage decisions, and attention management.

> **Full domain specifications:** `backend/data/world/domains/`

### 9.2 The Seven Domains

| Domain | Description | Key Characteristics |
|--------|-------------|-------------------|
| **Navigation & Mobility** | Getting from place to place, spatial awareness, movement through physical world | Safety-critical, time-sensitive, attention must remain on environment |
| **Communication & Connection** | Personal relationships, staying in touch, social coordination, meaningful connection | Quality over quantity, presence matters, relationship-specific norms |
| **Entertainment & Media** | Content consumption, news, games, entertainment, staying informed, cultural participation | Infinite feeds, engagement optimization, boundary-setting critical |
| **Life Management** | Life logistics, household tasks, finances, scheduling, admin work, keeping things running | High cognitive overhead, many small decisions, coordination complexity |
| **Work & Career** | Professional responsibilities, collaboration, career development, workplace dynamics | Deep work requires focus, work-life boundaries, urgency vs. importance |
| **Health & Wellness** | Physical health, mental wellbeing, rest, recovery, body awareness | Physiological state affects everything, rest is productive, highly personal |
| **Personal Fulfillment** | Creative expression, hobbies, interests, learning for curiosity, personal projects, skill development, self-reflection, personal growth, meaning-making | Easily deprioritized, requires protected time, intrinsic value, critical for wellbeing |

### 9.3 Domain-Mode Relationship [LOCKED]

**Domains are the foundation; Modes are fluid stances that emerge from them.**

| Concept | Definition | Example |
|---------|------------|---------|
| **Domain** | Stable category of human activity | "Work & Career" is a domain |
| **Mode** | Fluid, contextual stance within a domain | "Thesis Discussion", "Focus Work", "Creative Session"—all emerge from domains |

**Critical understanding: Modes are NOT fixed categories.**

Traditional systems treat modes like fixed states: "Focus Mode", "Do Not Disturb", etc. In LifeOS, mode names **emerge naturally** from the intersection of a Life Domain and the user's current situation:

| Domain | Example Fluid Modes |
|--------|--------------------|
| Communication & Connection | Thesis Discussion, Critique, Catch-up, Messaging, Deep Conversation, Quick Check-in |
| Work & Career | Focus Work, Meeting, Planning, Creative Session, Review, Brainstorming |
| Health & Wellness | Workout, Meditation, Recovery, Sleep Prep, Active Recovery, Health Check |
| Navigation & Mobility | Commute, Exploration, Errand Run, Travel, Walking Meeting, Transit |
| Entertainment & Media | Movie Night, Gaming, Reading, Music Discovery, Podcast, Browsing |
| Life Management | Weekly Review, Financial Check, Home Maintenance, Planning, Admin Tasks, Organizing |
| Personal Fulfillment | Learning, Creative Project, Skill Practice, Reflection, Journaling, Side Project |

**Key architectural points:**
- Each domain can spawn **countless contextual modes** based on the user's specific situation
- A single mode can span multiple domains (Focus Mode applies to both Work and Personal Fulfillment)
- Mode names are descriptive and contextual, not generic labels
- The Orchestrator determines mode based on context signals, not a fixed list selection

**Example:** When Marcus is having a deep conversation with a colleague about his thesis:
- Active domain: Communication & Connection
- Current mode: "Thesis Discussion" (emerged from context, not selected from a list)
- Triage rule: Work/academic communications → Center; other domains → Periphery or Silence

### 9.4 Constitutional Mapping

Users articulate values that map to domains. The constitutional framework uses domain awareness to apply values correctly.

**Example value mapping:**
- User value: "I want to be present with people when I'm with them"
- Domain: Communication & Connection
- Derived rule: When Social Mode active + Communication domain → suppress all non-emergency notifications from other domains

---

## 10. Defined Modes

### 10.1 Navigation Mode

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

### 10.2 Focus Mode

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

### 10.3 Social Mode

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

### 10.4 Rest Mode

**Purpose:** Downtime and recovery periods.

**Activation triggers:**
- Time-based (evening hours)
- User declares rest
- Health signals (fatigue indicators)

### 10.5 Work Mode

**Purpose:** Professional tasks and communications.

**Activation triggers:**
- Scheduled work hours
- Work location detected
- User declares work time

---

## 11. Open Questions

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

## 12. Research Grounding

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

## 13. Design Constraints

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

## 14. Changelog

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
