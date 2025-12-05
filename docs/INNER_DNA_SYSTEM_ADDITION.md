# INNER DNA SYSTEM - MASTER PLAN ADDITION
**To be added to PROJECT_MASTER_PLAN.md**  
**Based on:** Complete Inner DNA Export (5,319 lines) + Multi-Language AI Export (926 lines)  
**Source:** Live PHP Server + New Sophisticated System  
**Date:** December 6, 2025

---

## 📋 EXECUTIVE SUMMARY

The Inner DNA System is a **complete personality assessment platform** that determines:
- **Enneagram Type** (1-9) via RHETI questionnaire
- **Wing Influence** (adjacent type modifier)
- **5 Emotional States** (Very Good → Destructive)
- **3 Subtypes/Instincts** (SP/SX/SO)
- **AI-Generated Reports** (10 domains)
- **Coaching Chat Service** (4-phase discovery)

**CRITICAL:** This system will be **built into the IYCT platform** using our established dark theme design system (#0a1628 background). Any design specifications from the Inner DNA exports that conflict with our UI/UX must be adapted to match.

---

## 🎯 INTEGRATION WITH MASTER PLAN PHASES

| Master Plan Phase | Inner DNA Components |
|------------------|---------------------|
| Phase 4 (Week 7) | Core assessment (RHETI, Hero Moments, type determination) |
| Phase 5 (Week 8-10) | AI reports (6 sections), personality insights |
| Phase 6 (Week 11-12) | Chat coaching service, advanced features |
| Future | Corporate features, multi-language, team dynamics |

---

## 📊 SYSTEM ARCHITECTURE

### 7-Stage Assessment Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    INNER DNA ASSESSMENT FLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. RHETI (36 questions)                                        │
│     └─→ Initial type screening, column-to-type scoring          │
│                                                                  │
│  2. QUICK CHECK                                                  │
│     └─→ Contrastive statements to disambiguate top types        │
│                                                                  │
│  3. HERO MOMENTS (5-25 scenarios)                               │
│     └─→ Bayesian adaptive algorithm, 90% confidence threshold   │
│                                                                  │
│  4. BUILDING BLOCKS                                              │
│     └─→ Wing discovery (adjacent type influence)                │
│                                                                  │
│  5. COLOR STATES                                                 │
│     └─→ Select primary + secondary emotional states             │
│                                                                  │
│  6. DETAIL TOKENS                                                │
│     └─→ Distribute 10 tokens across SP/SX/SO subtypes           │
│                                                                  │
│  7. RESULTS                                                      │
│     └─→ AI-generated report with 6 synthesized sections         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🧬 THE 9 PERSONALITY TYPES

| Type | Name | Core Motivation | Fear |
|------|------|-----------------|------|
| 1 | REFORMER | To be right, improve things | Being corrupt, defective |
| 2 | HELPER | To be loved, needed | Being unwanted, unloved |
| 3 | ACHIEVER | To be successful, admired | Being worthless, failing |
| 4 | INDIVIDUALIST | To be unique, authentic | Having no identity |
| 5 | INVESTIGATOR | To be capable, competent | Being useless, helpless |
| 6 | SENTINEL | To be secure, supported | Being without guidance |
| 7 | ENTHUSIAST | To be satisfied, happy | Being deprived, trapped |
| 8 | CHALLENGER | To be strong, in control | Being controlled, harmed |
| 9 | PEACEMAKER | To be at peace, harmonious | Loss, fragmentation |

### Wings (Adjacent Type Influence)
Each type is influenced by one of its neighbors:
- Type 1: 1w9 or 1w2
- Type 2: 2w1 or 2w3
- Type 3: 3w2 or 3w4
- Type 4: 4w3 or 4w5
- Type 5: 5w4 or 5w6
- Type 6: 6w5 or 6w7
- Type 7: 7w6 or 7w8
- Type 8: 8w7 or 8w9
- Type 9: 9w8 or 9w1

---

## 🎨 5 EMOTIONAL STATES (Per Type)

Each type experiences 5 distinct states of health:

| State | Description | Color Indicator |
|-------|-------------|-----------------|
| Very Good | Peak integration, highest functioning | Green |
| Good | Healthy daily functioning | Blue |
| Average | Normal autopilot state | Yellow |
| Below Average | Stress response, reactive | Orange |
| Destructive | Disintegration, crisis mode | Red |

**UI Implementation:**
- User selects PRIMARY state (most time spent)
- User selects SECONDARY state
- Each state has intensity percentage (0-100%)
- State descriptions are type-specific (45 unique descriptions)

---

## 🔺 3 SUBTYPES (Instincts)

| Subtype | Code | Focus Area | Behavior Pattern |
|---------|------|------------|------------------|
| Self-Preservation | SP | Resources, health, security | "Protecting resources and staying solo" |
| Sexual/One-to-One | SX | Intense connection, passion | "Going all-in on one person at a time" |
| Social | SO | Groups, belonging, recognition | "Fitting in with groups" |

### Blind Spot Consequences
- **SP Blind:** Burns out - health, money, rest don't register
- **SX Blind:** Misses real connection - surface-level everything
- **SO Blind:** Locks everyone out - lone-wolf when needing backup

### Detail Tokens UI
- 10 tokens to distribute across 3 containers
- Drag-and-drop or click to allocate
- Determines dominant subtype and stacking order

---

## 📝 RHETI QUESTIONNAIRE (36 Questions)

### Question Format
```typescript
interface RHETIQuestion {
  id: number;           // 1-36
  left: string;         // Statement A
  right: string;        // Statement B
  colLeft: Column;      // A-I
  colRight: Column;     // A-I
}
```

### Column-to-Type Scoring
```typescript
const COLUMN_TO_TYPE = {
  A: 9,  // Peacemaker
  B: 6,  // Sentinel
  C: 3,  // Achiever
  D: 1,  // Reformer
  E: 4,  // Individualist
  F: 2,  // Helper
  G: 8,  // Challenger
  H: 5,  // Investigator
  I: 7   // Enthusiast
};
```

### Scoring Algorithm
1. Tally answers by column (A-I)
2. Convert column counts to type scores using mapping
3. Normalize to probabilities (sum = 1)
4. Identify top 3 types for next phase

---

## 🎯 HERO MOMENTS ALGORITHM

### Configuration Constants
```typescript
const CONFIDENCE_THRESHOLDS = {
  MIN_CONFIDENCE: 0.9,       // 90% required to complete
  HIGH_CONFIDENCE: 0.95,
  ADAPTIVE_THRESHOLD: 0.7,   // Enter adaptive phase at 70%
  LOW_CONFIDENCE: 0.5
};

const SCENARIO_LIMITS = {
  MIN_SCENARIOS: 5,          // Minimum before checking confidence
  MAX_SCENARIOS: 25,         // Maximum per assessment
  MAX_ADAPTIVE_SCENARIOS: 10
};

const ALGORITHM_CONSTANTS = {
  BASE_RESPONSE_WEIGHT: 0.20,
  CONSISTENCY_BONUS_MULTIPLIER: 1.2,
  EVIDENCE_STRENGTH_MULTIPLIER: 1.1,
  CONFIDENCE_DECAY_FACTOR: 0.99,
  CONFIDENCE_SMOOTHING_FACTOR: 0.25
};
```

### Scenario Structure
```typescript
interface HeroMomentScenario {
  id: string;                    // "general_001"
  title: string;                 // "Family Budget Emergency"
  description: string;           // Brief description
  context: string;               // Setup context
  scenario: string;              // Full scenario text
  options: HeroMomentOption[];   // 9 options (one per type)
  category: "general" | "targeted";
  targetTypes?: number[];        // For targeted scenarios
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

interface HeroMomentOption {
  id: string;              // "g001_opt1"
  text: string;            // Response option
  personalityType: number; // 1-9
  confidence: number;      // 0.8-0.95
}
```

### Algorithm Flow
1. Start with 15 general scenarios (random order)
2. Track Bayesian confidence per type
3. When confidence plateaus → switch to 12 targeted scenarios
4. Target scenarios chosen based on top-2 competing types
5. Complete when one type reaches 90%+ confidence
6. Typical completion: 8-12 scenarios

---

## 🤖 AI REPORT GENERATION (Claude Sonnet 4.5)

### 6 AI-Synthesized Sections
1. **Brutal Truth** - Raw pattern reality
2. **Core Pattern** - Fundamental personality driver
3. **States Control** - How states affect behavior
4. **Subtype Focus** - Instinctual priorities
5. **What Matters Now** - Current focus areas
6. **Real Life Impact** - Practical manifestations

### 10 Domain-Specific Reports
| Domain | Category | Focus |
|--------|----------|-------|
| General | Individual | Overall personality patterns |
| Love | Individual | Relationship dynamics |
| Wealth | Individual | Money & financial behaviors |
| Health | Individual | Physical & energy patterns |
| Leadership | Individual | Leadership style |
| Parenting | Individual | Parenting approach |
| Corporate | Corporate | Workplace dynamics |
| Team Dynamics | Team | Group performance |
| Wellness | Individual | Self-care patterns |
| Broke | Individual | Money blocks |

### Domain-Specific Prompts
Each domain has tailored AI prompts that focus on specific life areas while incorporating the user's type, states, and subtypes.

---

## 💬 AI CHAT COACHING SERVICE

### 4-Phase Discovery Flow
```
Phase 1 (Messages 1-3):  Understand WHY they're failing
Phase 2 (Messages 4-6):  Explore CONSEQUENCES
Phase 3 (Messages 7-8):  Uncover WHAT THEY WANT
Phase 4 (Messages 9+):   Position THE PROGRAM + Offer Call
```

### 5 Probing Questions (In Order)
1. **Desired Result** - "What result do you actually want here?"
2. **Current Situation** - "Where are you at right now with this?"
3. **Main Obstacles** - "What's blocking you from getting there?"
4. **Biggest Pain** - "What's the hardest part about this for you?"
5. **Willingness to Change** - "On a scale of 1-10, how ready are you to fix this?"

### Chat Rules
- ONE question per response maximum
- Under 100 words per message
- Never use technical jargon (SP, SX, SO, Enneagram)
- Use personality name directly (e.g., "As a Challenger...")
- 15 messages max per session

### Booking Integration
- Detect buying signals ("book a call", "sign me up", etc.)
- Collect date → time → confirm email
- Send confirmation emails via SendGrid

---

## 🌐 MULTI-LANGUAGE SUPPORT

### 4 Supported Languages
| Code | Language | Direction | Font |
|------|----------|-----------|------|
| en | English | LTR | IBM Plex Sans |
| hi-G4 | Hindi (Devanagari) | LTR | Noto Sans Devanagari |
| hi-Latn | Hinglish | LTR | IBM Plex Sans |
| ur-G4 | Urdu | RTL | Noto Nastaliq Urdu |

### Translation Coverage
- 45 State Descriptions (9 types × 5 states × 4 languages)
- 36 RHETI Questions (all languages)
- All UI strings
- AI-generated content adapts to language

---

## 💾 DATABASE SCHEMA

### Core Tables
```sql
-- Users with assessment data
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone_number TEXT,
  password_hash TEXT,
  assessment_data JSONB,  -- All assessment results
  started_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP
);

-- Generated Reports
CREATE TABLE reports (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  report_type TEXT NOT NULL,  -- 'standard', 'corporate', etc.
  personality_type TEXT NOT NULL,
  report_url TEXT NOT NULL,
  report_data JSONB,
  generated_at TIMESTAMP DEFAULT NOW()
);

-- Chat Transcripts
CREATE TABLE chat_transcripts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  session_id TEXT NOT NULL,
  report_slug TEXT NOT NULL,
  personality_name TEXT,
  wing INTEGER,
  dominant_state TEXT,
  messages JSONB NOT NULL,
  did_book BOOLEAN DEFAULT FALSE,
  locale TEXT DEFAULT 'en'
);

-- Corporate Clients
CREATE TABLE corporate_clients (
  id SERIAL PRIMARY KEY,
  company_name TEXT NOT NULL,
  access_code TEXT UNIQUE NOT NULL,
  employee_count INTEGER,
  report_delivery_route TEXT DEFAULT 'employee',
  is_active BOOLEAN DEFAULT TRUE
);

-- Corporate Employees
CREATE TABLE corporate_employees (
  id SERIAL PRIMARY KEY,
  corporate_client_id INTEGER REFERENCES corporate_clients(id),
  user_id INTEGER REFERENCES users(id),
  employee_name TEXT NOT NULL,
  employee_email TEXT NOT NULL,
  personality_type INTEGER,
  wing INTEGER,
  dominant_state TEXT,
  subtypes TEXT[],
  assessment_completed BOOLEAN DEFAULT FALSE
);
```

### Assessment Data Structure (JSONB)
```typescript
type AssessmentData = {
  rhetiAnswers?: string[];      // 36 A-I answers
  rhetiScores?: number[];       // 9 type scores
  
  state?: {
    isComplete: boolean;
    scenariosCompleted: number;
    typeConfidences: Record<number, { confidence: number }>;
    finalPersonalityType: number | null;
    finalConfidence: number;
  };
  
  buildingBlocks?: { type: number; wing?: string }[];
  
  colorStates?: {
    primaryState: { stateId: string; intensity: number };
    secondaryState: { stateId: string; intensity: number };
  };
  
  detailTokens?: {
    selfPreservation: number;
    sexual: number;
    social: number;
  };
  
  result?: {
    personalityType: number;
    confidence: number;
    typeName: string;
  };
};
```

---

## 🎨 DESIGN ADAPTATION

### CRITICAL: Use IYCT Platform Design System

**DO NOT USE** any design from Inner DNA exports. Adapt ALL UI to match:

```css
/* IYCT Platform Design System */
--background: #0a1628;
--nav-background: #0d1829;
--card-background: #1a2332;
--card-border: #2a3b52;
--accent-cyan: #5dade2;
--success-green: #34c38f;
--warning-orange: #f0ad4e;
--error-red: #dc3545;
--text-primary: #ffffff;
--text-secondary: #a0a0a0;
```

### UI Component Mapping
| Inner DNA Component | IYCT Adaptation |
|--------------------|--------------------|
| Assessment screens | Dark cards with cyan accents |
| Progress indicators | Cyan progress bars |
| Type selection | Dark buttons with hover states |
| Token containers | Dark glass-effect containers |
| Results page | Dark theme report cards |
| Chat interface | Dark chat bubbles |

---

## 📅 IMPLEMENTATION TIMELINE

### Phase 4 Extended (Week 7-8): Core Assessment

**Week 7: Assessment Flow**
- Day 1-2: RHETI questionnaire UI (36 questions)
- Day 3-4: Quick Check contrastive statements
- Day 5-7: Hero Moments scenario presentation

**Week 8: Type Determination**
- Day 1-2: Building Blocks (Wing discovery)
- Day 3-4: Color States (5 levels selection)
- Day 5-6: Detail Tokens (Subtype distribution)
- Day 7: Results page with basic personality display

### Phase 5 (Week 9-10): AI Reports

**Week 9: Report Generation**
- Day 1-3: Claude AI service integration
- Day 4-5: 6 AI-synthesized sections
- Day 6-7: Domain-specific report variations

**Week 10: Report Polish**
- Day 1-3: Multi-language support
- Day 4-5: PDF generation
- Day 6-7: Email delivery

### Phase 6 (Week 11-12): Advanced Features

**Week 11: Chat Service**
- Day 1-3: Chat UI (dark theme)
- Day 4-5: 4-phase coaching flow
- Day 6-7: Booking integration

**Week 12: Corporate Features**
- Day 1-3: Access code system
- Day 4-5: Bulk employee import
- Day 6-7: HR delivery routes

---

## 🔗 API ENDPOINTS

### Assessment Flow
```
POST /api/inner-dna/start
     Body: { email, firstName, lastName }
     Returns: { userId, firstQuestion }

POST /api/inner-dna/rheti/answer
     Body: { userId, questionId, answer }
     Returns: { nextQuestion | completed }

POST /api/inner-dna/hero-moments/respond
     Body: { userId, scenarioId, optionId }
     Returns: { nextScenario | completed, confidence }

POST /api/inner-dna/building-blocks/save
     Body: { userId, wing }

POST /api/inner-dna/color-states/save
     Body: { userId, primary, secondary }

POST /api/inner-dna/subtypes/save
     Body: { userId, sp, sx, so }

GET  /api/inner-dna/result/:userId
     Returns: { type, wing, states, subtypes }
```

### AI Reports
```
POST /api/inner-dna/report/generate
     Body: { userId, domain, language }
     Returns: { reportId, sections[] }

GET  /api/inner-dna/report/:reportId
     Returns: { html, pdf_url }
```

### Chat Service
```
POST /api/inner-dna/chat/init
     Body: { userId, domain }
     Returns: { sessionId, openingMessage }

POST /api/inner-dna/chat/message
     Body: { sessionId, message }
     Returns: { response, messageCount }

POST /api/inner-dna/chat/book
     Body: { sessionId, date, time, email }
     Returns: { confirmed }
```

---

## 📂 FILE REFERENCES

| Document | Purpose |
|----------|---------|
| COMPLETE_INNER_DNA_EXPORT.md | Full system specification (5,319 lines) |
| MULTI_LANGUAGE_AND_AI_COMPLETE.md | i18n and AI details (926 lines) |
| PROJECT_MASTER_PLAN.md | Overall platform plan |
| ADMIN_PANEL_MASTER_PLAN_ADDITION.md | Admin panel specification |

---

## ⚠️ CRITICAL IMPLEMENTATION RULES

1. **Design System:** Use IYCT dark theme (#0a1628) - NO exceptions
2. **Activity Type:** Inner DNA Test = Activity Type 1 in step system
3. **Integration:** Inner DNA is a Practice Tool, accessible from programs
4. **Data Storage:** Store results in user's assessment_data JSONB field
5. **AI Costs:** Track tokens and costs per user for budgeting
6. **Languages:** English first, add others in Phase 6+

---

**END OF INNER DNA SYSTEM ADDITION**

*This document supplements PROJECT_MASTER_PLAN.md and should be read in conjunction with all other master plan additions.*
