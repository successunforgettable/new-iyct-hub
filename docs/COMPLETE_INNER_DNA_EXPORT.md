# COMPLETE Inner DNA System Export for Claude AI

**Compiled: 2025-12-05**
**This is the COMPLETE export including Database, APIs, Algorithms, AI Prompts, and all Logic**

---

# TABLE OF CONTENTS

1. [Database Schema](#1-database-schema)
2. [API Endpoints](#2-api-endpoints)  
3. [Hero Moments Algorithm](#3-hero-moments-algorithm)
4. [AI Report Service & Prompts](#4-ai-report-service--prompts)
5. [AI Chat Service & Coaching Prompts](#5-ai-chat-service--coaching-prompts)
6. [Chat Domain Configuration](#6-chat-domain-configuration)
7. [Booking Service](#7-booking-service)
8. [Frontend Assessment Library](#8-frontend-assessment-library)
9. [Multi-Language Support](#9-multi-language-support)
10. [Report Factory System](#10-report-factory-system)
11. [AI Synthesis Service](#11-ai-synthesis-service)
12. [Email Service](#12-email-service)
13. [Environment Variables](#13-environment-variables)
14. [Hero Moments Scenarios (27 NEW System)](#14-hero-moments-scenarios-new-built-system)
15. [RHETI Questions (36-Question Assessment)](#15-rheti-questions-36-question-assessment)
16. [Wing Discovery Algorithm](#16-wing-discovery-algorithm)
17. [Quick Check Data](#17-quick-check-data)
18. [Building Blocks System](#18-building-blocks-system)
19. [Subtype Calculation (Detail Tokens)](#19-subtype-calculation-detail-tokens)
20. [State Selection (Color Phase)](#20-state-selection-color-phase)
21. [Inner DNA Context (Central State Management)](#21-inner-dna-context-central-state-management)

---

# 1. DATABASE SCHEMA

## PostgreSQL Tables (Drizzle ORM)

```typescript
// FILE: apps/api/src/modules/inner-dna/schema/schema.ts

import { pgTable, text, serial, timestamp, jsonb, integer, boolean, uniqueIndex } from "drizzle-orm/pg-core";

// USERS TABLE - Main user data
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  phoneNumber: text("phone_number"),
  passwordHash: text("password_hash"),
  emailVerified: timestamp("email_verified"),
  phoneVerified: timestamp("phone_verified"),
  verificationCode: text("verification_code"),
  resetToken: text("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  startedAt: timestamp("started_at").notNull(),
  completedAt: timestamp("completed_at"),
  assessmentData: jsonb("assessment_data"), // Stores all assessment results
});

// SESSIONS TABLE - JWT sessions
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// REPORTS TABLE - Generated reports
export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  reportType: text("report_type").notNull(), // 'standard', 'corporate', 'wealth', 'career', 'health', 'love', 'leadership'
  personalityType: text("personality_type").notNull(),
  reportUrl: text("report_url").notNull(),
  reportData: jsonb("report_data"),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
});

// CONTACT REQUESTS TABLE
export const contactRequests = pgTable("contact_requests", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phoneNumber: text("phone_number").notNull(),
  personalityType: text("personality_type"),
  heartPercentage: text("heart_percentage"),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  contacted: timestamp("contacted"),
});

// CORPORATE CLIENTS TABLE
export const corporateClients = pgTable("corporate_clients", {
  id: serial("id").primaryKey(),
  companyName: text("company_name").notNull(),
  industry: text("industry"),
  contactPerson: text("contact_person").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone"),
  accessCode: text("access_code").notNull().unique(),
  employeeCount: integer("employee_count"),
  licenseType: text("license_type"),
  isActive: boolean("is_active").notNull().default(true),
  reportDeliveryRoute: text("report_delivery_route").notNull().default("employee"),
  reportPackages: text("report_packages").array().default([]),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  notes: text("notes"),
});

// CORPORATE EMPLOYEES TABLE
export const corporateEmployees = pgTable("corporate_employees", {
  id: serial("id").primaryKey(),
  corporateClientId: integer("corporate_client_id").notNull().references(() => corporateClients.id),
  userId: integer("user_id").references(() => users.id),
  employeeName: text("employee_name").notNull(),
  employeeEmail: text("employee_email").notNull(),
  personalityType: integer("personality_type").notNull(),
  personalityName: text("personality_name").notNull(),
  wing: integer("wing"),
  dominantState: text("dominant_state"),
  secondaryState: text("secondary_state"),
  primaryStatePercentage: integer("primary_state_percentage"),
  secondaryStatePercentage: integer("secondary_state_percentage"),
  subtypes: text("subtypes").array(),
  department: text("department"),
  position: text("position"),
  assessmentData: jsonb("assessment_data"),
  assessmentCompleted: boolean("assessment_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  importedAt: timestamp("imported_at"),
});

// USER REPORT PURCHASES TABLE
export const userReportPurchases = pgTable("user_report_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  reportSlug: text("report_slug").notNull(),
  purchaseDate: timestamp("purchase_date").notNull().defaultNow(),
  paymentStatus: text("payment_status").notNull().default("completed"),
  paymentMethod: text("payment_method"),
  transactionId: text("transaction_id"),
  amount: integer("amount"),
  currency: text("currency").default("USD"),
});

// GENERATED REPORTS TABLE (cached HTML)
export const generatedReports = pgTable("generated_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  reportSlug: text("report_slug").notNull(),
  locale: text("locale").notNull().default('en'),
  htmlContent: text("html_content").notNull(),
  generatedAt: timestamp("generated_at").notNull().defaultNow(),
});

// CHAT TRANSCRIPTS TABLE (for marketing intelligence)
export const chatTranscripts = pgTable("chat_transcripts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  sessionId: text("session_id").notNull(),
  reportSlug: text("report_slug").notNull(),
  personalityName: text("personality_name"),
  wing: integer("wing"),
  dominantState: text("dominant_state"),
  statePercentage: integer("state_percentage"),
  blindSubtype: text("blind_subtype"),
  messages: jsonb("messages").notNull(),
  messageCount: integer("message_count").notNull().default(0),
  detectedIntents: text("detected_intents").array(),
  emotionalTone: text("emotional_tone"),
  conversionSignals: text("conversion_signals").array(),
  didBook: boolean("did_book").notNull().default(false),
  clickedCTA: boolean("clicked_cta").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  sessionDuration: integer("session_duration_seconds"),
  locale: text("locale").notNull().default('en'),
});

// REPORT CATALOG TABLE
export const reportCatalog = pgTable("report_catalog", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  shockLevel: integer("shock_level").notNull(),
  tierRequired: text("tier_required").notNull().default("basic"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// USER SUBSCRIPTIONS TABLE
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  tier: text("tier").notNull().default("basic"),
  status: text("status").notNull().default("active"),
  startedAt: timestamp("started_at").notNull().defaultNow(),
  expiresAt: timestamp("expires_at"),
  cancelledAt: timestamp("cancelled_at"),
  billingCycle: text("billing_cycle"),
  amount: integer("amount"),
  currency: text("currency").notNull().default("USD"),
  notes: text("notes"),
});
```

## Assessment Data Structure (stored in users.assessmentData)

```typescript
export type AssessmentData = {
  // RHETI results
  rhetiAnswers?: string[];  // Array of 36 A-I answers
  rhetiScores?: number[];   // Array of 9 type scores
  
  // Hero Moments algorithm state
  state?: {
    isComplete: boolean;
    scenariosCompleted: number;
    usedScenarioIds: string[];
    typeConfidences: Record<number, { confidence: number; evidenceCount: number }>;
    responseHistory: Record<string, any>;
    leadingTypes: number[];
    isInAdaptivePhase: boolean;
    adaptiveScenariosUsed: number;
    finalPersonalityType: number | null;
    finalConfidence: number;
  };
  
  // Final results
  result?: {
    personalityType: number;  // 1-9
    confidence: number;       // 0-100
    typeName: string;
  };
  
  // Building Blocks (wing)
  buildingBlocks?: Array<{
    type: number;
    name: string;
    description: string;
    wing?: string;
  }>;
  
  // Color States (emotional states)
  colorStates?: Array<{
    state: string;  // 'veryGood', 'good', 'average', 'belowAverage', 'destructive'
    title: string;
  }>;
  colorStateDetails?: {
    distribution: { primary: number; secondary: number };
  };
  
  // Subtypes (instincts)
  subtypes?: string[];  // ['sp', 'sx', 'so'] in order of dominance
  detailTokens?: {
    instincts?: string[];
    distribution?: { self: number; oneToOne: number; social: number };
  };
  
  // Derived fields
  personalityType?: number;
  currentPhase?: number;
};
```

---

# 2. API ENDPOINTS

## Report Catalog
```
GET  /api/inner-dna/catalog
     Returns: { success: true, reports: [...] }

GET  /api/inner-dna/access/:slug
     Returns: { success: true, hasAccess: boolean, reason: string, report: {...} }
```

## Assessment Flow
```
POST /api/inner-dna/assessment/start
     Body: { email, firstName, lastName, phoneNumber }
     Returns: { success: true, userId, scenario, progress }

POST /api/inner-dna/assessment/respond
     Body: { userId, scenarioId, selectedOptionId, responseTime }
     Returns: { success: true, isComplete, scenario?, result?, progress }

GET  /api/inner-dna/assessment/:userId/status
     Returns: { success: true, status: 'not_started'|'in_progress'|'completed', result?, progress? }

POST /api/inner-dna/assessment/:userId/resume
     Returns: { success: true, isComplete, scenario?, result? }
```

## AI Reports
```
POST /api/inner-dna/generate-ai-report
     Body: { assessmentData: { primaryType, confidence, wing?, colorStates?, detailTokens? } }
     Returns: { personalityOverview, strengthsAndChallenges, relationshipInsights, careerGuidance, growthRecommendations, dailyPractices }

POST /api/inner-dna/quick-insight
     Body: { assessmentData }
     Returns: { insight: string }
```

## AI Chat
```
POST /api/inner-dna/chat/:domain/init
     Body: { profileId }
     Returns: { suggestedQuestions, openingMessage, userData }

POST /api/inner-dna/chat/:domain
     Body: { sessionId, message, profileId }
     Returns: { message, messageCount, messagesRemaining, limitReached, suggestedQuestions? }
```

## Report Generation
```
POST /api/inner-dna/reports/:userId/generate/:slug
     Returns: { success: true, html: string }

GET  /api/inner-dna/reports/:userId
     Returns: { success: true, reports: [...] }
```

---

# 3. HERO MOMENTS ALGORITHM

## Core Algorithm Constants
```typescript
export const CONFIDENCE_THRESHOLDS = {
  MIN_CONFIDENCE: 0.9,      // 90% confidence required to complete
  HIGH_CONFIDENCE: 0.95,
  ADAPTIVE_THRESHOLD: 0.7,  // Enter adaptive phase at 70%
  LOW_CONFIDENCE: 0.5
};

export const SCENARIO_LIMITS = {
  MIN_SCENARIOS: 5,         // Minimum before checking confidence
  MAX_SCENARIOS: 25,        // Maximum per assessment
  MAX_ADAPTIVE_SCENARIOS: 10
};

export const ALGORITHM_CONSTANTS = {
  BASE_RESPONSE_WEIGHT: 0.20,
  CONSISTENCY_BONUS_MULTIPLIER: 1.2,
  EVIDENCE_STRENGTH_MULTIPLIER: 1.1,
  CONFIDENCE_DECAY_FACTOR: 0.99,
  MINIMUM_EVIDENCE_THRESHOLD: 2,
  CONFIDENCE_SMOOTHING_FACTOR: 0.25,
  ADAPTIVE_CONFIDENCE_GAP: 0.20
};
```

## Algorithm Flow
```typescript
class AdaptiveHeroMomentsAlgorithm {
  // 1. Initialize with empty confidences for all 9 types
  constructor() {
    this.state = this.initializeState();
    this.generalScenarios = getGeneralScenarios();
  }
  
  // 2. Get current scenario for user
  getCurrentScenario(): HeroMomentScenario | null {
    if (this.state.isComplete) return null;
    if (!this.state.currentScenario) {
      this.state.currentScenario = this.selectNextScenario();
    }
    return this.state.currentScenario;
  }
  
  // 3. Record user's response and update confidences
  recordResponse(scenarioId: string, selectedOptionId: string, responseTime: number): boolean {
    // Find scenario and selected option
    const scenario = this.allScenarios.find(s => s.id === scenarioId);
    const selectedOption = scenario.options.find(o => o.id === selectedOptionId);
    
    // Calculate updated confidences
    const result = this.calculateUpdatedConfidences({
      scenarioId,
      selectedOptionId,
      personalityType: selectedOption.personalityType,
      confidence: selectedOption.confidence,
      responseTime
    });
    
    // Check if should enter adaptive phase
    if (result.shouldEnterAdaptivePhase) {
      this.enterAdaptivePhase();
    }
    
    // Check if can complete
    if (result.canComplete && this.canCompleteAssessment()) {
      this.completeAssessment();
    }
    
    return true;
  }
  
  // 4. Confidence calculation
  calculateUpdatedConfidences(response) {
    const selectedType = response.personalityType;
    const currentConf = this.state.typeConfidences.get(selectedType);
    
    // Calculate increase
    const baseIncrease = BASE_RESPONSE_WEIGHT * response.confidence;
    const totalIncrease = baseIncrease * EVIDENCE_STRENGTH_MULTIPLIER * CONSISTENCY_BONUS_MULTIPLIER;
    
    // Apply with smoothing
    const newConfidence = Math.min(1.0, 
      currentConf.confidence + (totalIncrease * (1 - currentConf.confidence * CONFIDENCE_SMOOTHING_FACTOR))
    );
    
    // Decay non-selected types
    this.state.typeConfidences.forEach((conf, type) => {
      if (type !== selectedType) {
        conf.confidence = Math.max(0, conf.confidence - totalIncrease * 0.1 * CONFIDENCE_DECAY_FACTOR);
      }
    });
    
    return { maxConfidence, canComplete, shouldEnterAdaptivePhase };
  }
  
  // 5. Get final results
  getFinalResults() {
    return {
      personalityType: this.state.finalPersonalityType,
      personalityTypeName: TYPE_NAMES[this.state.finalPersonalityType],
      confidence: Math.round(this.state.finalConfidence * 100),
      allTypeConfidences: [...],
      wasAdaptivePhaseUsed: this.state.adaptivePhaseStarted !== null
    };
  }
}
```

## Scenario Structure
```typescript
interface HeroMomentScenario {
  id: string;           // "general_001"
  title: string;        // "Family Budget Emergency"
  description: string;  // "Financial Crisis Management"
  context: string;      // Brief context
  scenario: string;     // Full scenario text
  options: HeroMomentOption[];  // 9 options (one per type)
  category: "general" | "targeted";
  targetTypes?: number[];
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

interface HeroMomentOption {
  id: string;           // "g001_opt1"
  text: string;         // Option text
  personalityType: number;  // 1-9
  confidence: number;   // 0.8-0.95
  reasoning?: string;   // Why this indicates this type
}
```

---

# 4. AI REPORT SERVICE & PROMPTS

## Report Generation System Prompt
```typescript
const systemPrompt = `You are an expert personality assessment analyst specializing in the Inner DNA methodology. You create highly personalized, insightful reports that help individuals understand their unique personality patterns and grow.

Your task is to analyze the user's complete assessment data and generate a comprehensive, personalized report with specific insights based on their exact combination of traits.

Guidelines:
- Write in a warm, encouraging, yet professional tone
- Provide specific, actionable insights rather than generic descriptions
- Connect different aspects of their assessment (type, wing, states, subtypes) to show patterns
- Include concrete examples and practical applications
- Avoid clinical language - make it accessible and engaging
- Each section should be 150-250 words for depth while maintaining readability
- Base insights on the specific combination of their traits, not just their primary type

Return your response as a JSON object with these exact keys:
{
  "personalityOverview": "A comprehensive overview of their unique personality pattern",
  "strengthsAndChallenges": "Specific strengths they can leverage and challenges to be aware of",
  "relationshipInsights": "How they show up in relationships and what others experience with them",
  "careerGuidance": "Career environments and roles that would suit their specific pattern",
  "growthRecommendations": "Specific development areas and approaches for growth",
  "dailyPractices": "Practical daily habits and practices tailored to their profile"
}`;
```

## AI Section Generation (Brutal Truth Report)
```typescript
// Example prompt for "Brutal Truth" section
const prompt = `You are writing the opening "The Brutal Truth About Your Pattern" section for a ${domain} personality report.

USER DATA:
- Personality: ${personalityName}
- Dominant State: ${dominantState} at ${primaryStatePercentage}%
- Dominant Subtype: ${dominantSubtype.toUpperCase()}

TASK:
Write 2-3 paragraphs of brutally honest truth about how their personality pattern creates their current reality in ${domain}. Be uncomfortably specific about:
- The EXACT mechanism of how their pattern operates
- Why they keep getting the same results
- What they're unable to see about themselves

NO emojis, NO section headings. Just raw truth in second person ("You...").`;
```

## Domain-Specific Prompts

### Wealth Domain
```typescript
const wealthPrompt = `Write 5 brutally specific examples showing how their personality pattern BLOCKS WEALTH and DESTROYS FINANCIAL SUCCESS. Focus ONLY on money, wealth, income, savings, spending, investing, and financial decisions.

REQUIRED STRUCTURE - ALL ABOUT MONEY:
💸 INCOME SABOTAGE:
[How ${dominantState} at ${primaryStatePercentage}% blocks them from earning more money.]

🚫 SPENDING DYSFUNCTION:
[How ${dominantSubtype} subtype + ${dominantState} creates destructive spending patterns.]

🏦 SAVINGS FAILURE:
[Why they cannot build wealth or save money.]

📉 INVESTMENT PARALYSIS:
[How ${primaryStatePercentage}% ${dominantState} blocks smart money moves.]

💰 MONEY BLIND SPOT:
[What they CANNOT SEE about their finances because of ${blindSubtype} blind spot.]`;
```

### Love Domain
```typescript
const lovePrompt = `Write 5 brutally specific examples showing how their personality pattern DESTROYS RELATIONSHIPS and BLOCKS LOVE. Focus ONLY on romantic relationships, intimacy, connection, and partnership dynamics.

REQUIRED STRUCTURE - ALL ABOUT LOVE:
💔 INTIMACY SABOTAGE:
[How ${dominantState} at ${primaryStatePercentage}% blocks real emotional connection.]

🚧 RELATIONSHIP PATTERNS:
[How ${dominantSubtype} subtype + ${dominantState} creates toxic relationship cycles.]

💏 VULNERABILITY FAILURE:
[Why they cannot be emotionally available.]

🔥 PASSION KILLER:
[How ${primaryStatePercentage}% ${dominantState} destroys romance and desire.]

👤 LOVE BLIND SPOT:
[What they CANNOT SEE about relationship destruction because of ${blindSubtype} blind spot.]`;
```

---

# 5. AI CHAT SERVICE & COACHING PROMPTS

## Chat System Prompt Structure
```typescript
function buildSystemPrompt(userData: UserPersonalityData, messageCount: number): string {
  const { personalityName, dominantState, statePercentage, allStates, dominantSubtype, blindSubtype, reportSlug, reportInsights } = userData;
  
  // Translate subtypes to human language
  const dominantFocus = dominantSubtype === 'SP' 
    ? 'protecting your resources and staying solo' 
    : dominantSubtype === 'SX' 
    ? 'going all-in on one person at a time' 
    : 'fitting in with groups and what they think';
    
  const blindConsequence = blindSubtype === 'SP' 
    ? "you burn yourself out - health, money, rest don't even register" 
    : blindSubtype === 'SX' 
    ? "you miss real connection - surface-level everything" 
    : "you lock everyone out and go lone-wolf when you need backup";

  return `You are an Inner DNA coach having a CONVERSATIONAL discovery session.

🚨 CRITICAL: ALWAYS ANSWER USER QUESTIONS FIRST 🚨

IF THE USER ASKS YOU TO EXPLAIN SOMETHING:
- ANSWER THEIR QUESTION using their report data
- Use their personality type and states to explain the pattern
- NEVER ignore their question to push for booking
- After explaining, continue the conversation naturally

COACHING DISCOVERY FLOW - 5 PROBING QUESTIONS (IN ORDER):
1. DESIRED RESULT - "What result do you actually want here?"
2. CURRENT SITUATION - "Where are you at right now with this?"
3. MAIN OBSTACLES - "What's blocking you from getting there?"
4. BIGGEST PAIN - "What's the hardest part about this for you?"
5. WILLINGNESS TO CHANGE - "On a scale of 1-10, how ready are you to actually fix this?"

DO NOT offer a call until you have explored at least 3-4 of these questions.

🚫 NEVER SAY OR OUTPUT:
- SP, SX, SO (say "protecting resources", "deep connection", "asking for help")
- "Enneagram" (say "Inner DNA" or "pattern")
- "Type 1-9" (use "${personalityName}")
- Technical jargon or therapy-speak
- ANY URLs or links

📅 BOOKING CALLS:
When offering a call, just ask: "What date works best for you?"
DO NOT provide any calendar links or URLs.
Example: "Wanna grab a 15-min call? What date works best for you?"

📊 THEIR EXACT DATA:
**Pattern:** ${personalityName}
**States:** ${allStates.map(s => \`\${s.percentage}% \${s.state}\`).join(', ')}
**Dominant focus:** ${dominantFocus}
**Blind consequence:** ${blindConsequence}
**Context:** ${reportSlug}

🎯 COACHING DISCOVERY SESSION (Message ${messageCount}/15):

**Phase 1: Messages 1-3 - Understand WHY They're Failing**
Help them see the pattern that's running their life.

**Phase 2: Messages 4-6 - Explore CONSEQUENCES**
Help them feel what this pattern is costing them.

**Phase 3: Messages 7-8 - Uncover WHAT THEY WANT**
Get clear on their desired outcome.

**Phase 4: Messages 9+: Position THE PROGRAM**
After you've covered situation thoroughly - THEN offer the call.

🚨 CRITICAL RULE - ONE QUESTION AT A TIME:
Your response can only contain ONE question mark (?).

Keep it under 100 words. One question. Conversational coaching style.`;
}
```

## Personality-Specific Language Patterns
```typescript
// Type 1 - REFORMER
"**REFORMER - Talk about standards and doing things right:**
- Use words: \"right way\", \"should\", \"standards\", \"fixing things\", \"doing it properly\"
- Example: \"I'm seeing you hold yourself to really high standards. Help me understand - what are you NOT doing right now because you're worried it won't be perfect?\""

// Type 2 - HELPER
"**HELPER - Talk about giving and being needed:**
- Use words: \"helping others\", \"being there\", \"needed\", \"taking care of people\"
- Example: \"Sounds like you're always there for everyone else. So who's actually helping YOU right now?\""

// Type 3 - ACHIEVER
"**ACHIEVER - Talk about results and winning:**
- Use words: \"winning\", \"success\", \"results\", \"achieving goals\", \"performing\"
- Example: \"You're crushing it in some areas. But what result do you actually want that you're not getting yet?\""

// ... (patterns for Types 4-9)
```

---

# 6. CHAT DOMAIN CONFIGURATION

```typescript
export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  general: {
    slug: 'general',
    name: 'General Personality',
    category: 'individual',
    openingQuestion: "What's the ONE thing you wanna change about your life right now?",
    coachingStyle: 'personal empathetic coaching'
  },
  
  love: {
    slug: 'love',
    name: 'Love & Relationships',
    category: 'individual',
    openingQuestion: "What's the ONE thing you wanna change about your relationships?",
    coachingStyle: 'empathetic relationship coaching'
  },
  
  wealth: {
    slug: 'wealth',
    name: 'Wealth & Money',
    category: 'individual',
    openingQuestion: "What's the ONE money problem you're trying to fix right now?",
    coachingStyle: 'direct wealth coaching'
  },
  
  health: {
    slug: 'health',
    name: 'Health Patterns',
    category: 'individual',
    openingQuestion: "What's the ONE health or energy issue driving you crazy right now?",
    coachingStyle: 'supportive health coaching'
  },
  
  leadership: {
    slug: 'leadership',
    name: 'Leadership Style',
    category: 'individual',
    openingQuestion: "What's the ONE leadership challenge keeping you stuck?",
    coachingStyle: 'executive coaching'
  },
  
  parenting: {
    slug: 'parenting',
    name: 'Parenting Approach',
    category: 'individual',
    openingQuestion: "What's the ONE parenting struggle you're tired of dealing with?",
    coachingStyle: 'supportive parenting coaching'
  },
  
  corporate: {
    slug: 'corporate',
    name: 'Workplace Dynamics',
    category: 'corporate',
    openingQuestion: "What's the ONE workplace dynamic that's holding your team back right now?",
    coachingStyle: 'B2B professional coaching with ROI focus'
  },
  
  'team-dynamics': {
    slug: 'team-dynamics',
    name: 'Team Performance',
    category: 'team',
    openingQuestion: "What's the ONE team challenge that's affecting your collective performance?",
    coachingStyle: 'group coaching with collective performance focus'
  }
};
```

---

# 7. BOOKING SERVICE

```typescript
export const BUYING_SIGNALS = [
  'book a call', 'schedule a call', 'sign me up', 'i want to book',
  'let\'s book', 'book it', 'i want to join', 'join the program',
  'enroll me', 'how do i sign up', 'ready to start', 'let\'s do the call'
];

export const CANCEL_SIGNALS = [
  'nevermind', 'cancel', 'go back', 'not now', 'maybe later',
  'forget it', 'changed my mind', 'not interested', 'no thanks'
];

// Booking Flow Phases
type BookingPhase = 'collecting_date' | 'collecting_time' | 'confirming_email' | 'completed';

function processBookingInput(sessionId, input, registeredName?, registeredEmail?) {
  switch (session.phase) {
    case 'collecting_date':
      // Parse date from input
      session.preferredDate = input;
      session.phase = 'collecting_time';
      return "Got it, {date}. What time works best for you?";

    case 'collecting_time':
      // Parse time from input  
      session.preferredTime = input;
      session.phase = 'confirming_email';
      return "Got it - {date} at {time}. I'll send the invite to {email}. That the right email?";

    case 'confirming_email':
      // Confirm or get new email
      session.phase = 'completed';
      return "Done! Your call is booked. You'll get a calendar invite shortly.";
  }
}
```

---

# 8. FRONTEND ASSESSMENT LIBRARY

## File Structure
```
apps/web/src/lib/inner-dna/
├── api.ts                     # API endpoints for assessment
├── assessmentStorage.ts       # localStorage persistence
├── assessmentTypes.ts         # TypeScript interfaces
├── heroMomentsAlgorithm.ts    # Bayesian adaptive algorithm
├── heroMomentsData.ts         # Scenarios and options
├── personality-types.ts       # 9 type definitions
├── quickCheckData.ts          # Contrastive statements
├── reportService.ts           # Report generation
├── rhetiQuestions.ts          # 36 RHETI questions
├── rhetiQuestionsEnhanced.ts  # Shortened UX version
├── stateDescriptionsPart1.ts  # Types 1-3 states
├── stateDescriptionsPart2.ts  # Types 4-6 states
├── stateDescriptionsPart3.ts  # Types 7-9 states
├── stateOptions.ts            # 5 state definitions
├── stoneData.ts               # Building blocks + foundation
├── subtypeCalculation.ts      # Instinct stacking
└── wingDiscovery.ts           # Wing algorithm + statements
```

## RHETI Column Mapping
```typescript
const COLUMN_TO_TYPE: Record<string, number> = {
  'A': 9, 'B': 6, 'C': 3, 'D': 1, 'E': 4, 'F': 2, 'G': 8, 'H': 5, 'I': 7
};

// Scoring: Count each column letter, then map to type scores
export function scoreRheti(answers: string[]): number[] {
  const MAP = {A:0, B:1, C:2, D:3, E:4, F:5, G:6, H:7, I:8};
  const INDEX_TO_TYPE = {0:9, 1:6, 2:3, 3:1, 4:4, 5:2, 6:8, 7:5, 8:7};
  
  const columnTally = Array(9).fill(0);
  answers.forEach(ch => columnTally[MAP[ch]]++);
  
  const typeScores = Array(9).fill(0);
  for (let i = 0; i < 9; i++) {
    typeScores[INDEX_TO_TYPE[i] - 1] = columnTally[i];
  }
  return typeScores;
}
```

---

# 9. MULTI-LANGUAGE SUPPORT

## Supported Languages
- **en** - English (default)
- **hi-G4** - Hindi Devanagari (हिंदी)
- **hi-Latn** - Hinglish (Hindi-English mix in Latin script)
- **ur-G4** - Urdu (اردو)

## Language Instructions for AI
```typescript
const languageInstructions = {
  'en': 'Write all content in English.',

  'hi-G4': `Write all content in Hindi using Devanagari script (हिंदी में लिखें).
- Grade 4 reading level - ऐसे सरल शब्द जो 9 साल का बच्चा समझ सके
- छोटे वाक्य (10-15 शब्द maximum)
- बातचीत की भाषा (दोस्त से बात करते हुए)
- हमेशा "आप" (formal respectful you) use करें
- NO English words - pure Hindi only`,

  'hi-Latn': `Write all content in Hinglish using Latin script.
- Grade 4 reading level
- Short sentences (10-15 words maximum)
- Conversational tone (like talking to a friend in urban India)
- ALWAYS use "Aap" (formal respectful you) - NEVER use "tum", "tu"
- Natural Hindi-English mix as commonly spoken`,

  'ur-G4': `Write all content in Urdu using Arabic script (اردو میں لکھیں).
- Grade 4 reading level
- مختصر جملے (10-15 الفاظ maximum)
- بات چیت کی زبان
- ہمیشہ "آپ" (formal respectful you) استعمال کریں
- Avoid heavy Farsi/Arabic vocabulary`
};
```

---

# 10. REPORT FACTORY SYSTEM

## Report Types (10 domains)
1. **general** - Free personality overview
2. **love** - Love & Relationships ($29.99)
3. **wealth** - Wealth & Money ($29.99)
4. **health** - Health Patterns ($29.99)
5. **leadership** - Leadership Style ($39.99)
6. **parenting** - Parenting Approach ($29.99)
7. **wellness** - Wellness & Self-Care ($29.99)
8. **broke** - Money Blocks ($29.99)
9. **corporate** - Workplace Dynamics (B2B)
10. **team-dynamics** - Team Performance (B2B)

## Report Factory Structure
```
apps/api/src/modules/inner-dna/report-factory/
├── core/
│   ├── factory.ts          # Main report generator
│   ├── registry.ts         # Report type registry
│   ├── baseReport.ts       # Base report class
│   ├── contentStore.ts     # Content management
│   └── types.ts            # Type definitions
├── packs/
│   ├── general/            # General report templates
│   ├── love/               # Love report templates
│   ├── wealth/             # Wealth report templates
│   ├── health/             # Health report templates
│   ├── leadership/         # Leadership report templates
│   ├── parenting/          # Parenting report templates
│   ├── wellness/           # Wellness report templates
│   ├── broke/              # Money blocks report
│   ├── corporate/          # Corporate report
│   ├── team-dynamics/      # Team dynamics report
│   └── shared/             # Shared templates
└── reports/
    ├── general.ts          # General report logic
    └── registry.ts         # Report registry
```

---

# 11. AI SYNTHESIS SERVICE (Complete Code)

This is the full AI synthesis service that generates dynamic report sections.

```typescript
// FILE: apps/api/src/modules/inner-dna/lib/ai-synthesis.ts

import Anthropic from '@anthropic-ai/sdk';

// Replit AI Integrations requires BOTH baseURL and apiKey
const baseURL = process.env.AI_INTEGRATIONS_ANTHROPIC_BASE_URL;
const apiKey = process.env.AI_INTEGRATIONS_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY;

const anthropic = (baseURL && apiKey) ? new Anthropic({ baseURL, apiKey }) : null;

function getLanguageInstructions(language: string): string {
  const languageMap: Record<string, string> = {
    'en': 'Write all content in English.',

    'hi-G4': `Write all content in Hindi using Devanagari script (हिंदी में लिखें).
CRITICAL WRITING RULES:
- Grade 4 reading level - ऐसे सरल शब्द जो 9 साल का बच्चा समझ सके
- छोटे वाक्य (10-15 शब्द maximum)
- बातचीत की भाषा (दोस्त से बात करते हुए)
- हमेशा "आप" (formal you) use करें - कभी "तुम", "तू" नहीं
- NO English words - pure Hindi only`,

    'hi-Latn': `Write all content in Hinglish using Latin script.
CRITICAL WRITING RULES:
- Grade 4 reading level
- Short sentences (10-15 words maximum)
- Conversational tone (like talking to a friend)
- ALWAYS use "Aap" - NEVER use "tum", "tu"
- Natural Hindi-English mix as commonly spoken`,

    'ur-G4': `Write all content in Urdu using Arabic script (اردو میں لکھیں).
CRITICAL WRITING RULES:
- Grade 4 reading level
- مختصر جملے (10-15 الفاظ maximum)
- بات چیت کی زبان
- ہمیشہ "آپ" استعمال کریں - کبھی "تم", "تو" نہیں
- Avoid heavy Farsi/Arabic vocabulary`
  };
  
  return languageMap[language || 'en'] || languageMap['en'];
}

async function callClaude(systemPrompt: string, userPrompt: string, maxTokens: number = 400): Promise<string> {
  if (!anthropic) {
    throw new Error('Anthropic client not configured');
  }
  
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: userPrompt }],
    system: systemPrompt
  });

  const content = response.content[0];
  return content.type === 'text' ? content.text.trim() : '';
}

// WEALTH Domain Prompt
const wealthPrompt = (dominantState, primaryStatePercentage, dominantSubtype, blindSubtype) => `
Write 5 brutally specific examples showing how their personality pattern BLOCKS WEALTH:

💸 INCOME SABOTAGE:
[How ${dominantState} at ${primaryStatePercentage}% blocks earning more money.]

🚫 SPENDING DYSFUNCTION:
[How ${dominantSubtype} + ${dominantState} creates destructive spending.]

🏦 SAVINGS FAILURE:
[Why they cannot build wealth.]

📉 INVESTMENT PARALYSIS:
[How ${primaryStatePercentage}% ${dominantState} blocks smart money moves.]

💰 MONEY BLIND SPOT:
[What they CANNOT SEE because of ${blindSubtype} blind spot.]`;

// LOVE Domain Prompt
const lovePrompt = (dominantState, primaryStatePercentage, dominantSubtype, blindSubtype) => `
Write 5 brutally specific examples showing how their pattern DESTROYS LOVE:

💔 INTIMACY SABOTAGE:
[How ${dominantState} at ${primaryStatePercentage}% blocks connection.]

🚧 RELATIONSHIP PATTERNS:
[How ${dominantSubtype} + ${dominantState} creates toxic cycles.]

💏 VULNERABILITY FAILURE:
[Why they cannot be emotionally available.]

🔥 PASSION KILLER:
[How ${primaryStatePercentage}% ${dominantState} destroys romance.]

👤 LOVE BLIND SPOT:
[What they CANNOT SEE because of ${blindSubtype} blind spot.]`;

// HEALTH Domain Prompt  
const healthPrompt = (dominantState, primaryStatePercentage, dominantSubtype, blindSubtype) => `
Write 5 brutally specific examples showing how their pattern SABOTAGES HEALTH:

🏃 EXERCISE SABOTAGE:
[How ${dominantState} at ${primaryStatePercentage}% blocks fitness consistency.]

🍔 EATING DYSFUNCTION:
[How ${dominantSubtype} + ${dominantState} creates harmful food patterns.]

😴 REST FAILURE:
[Why they cannot get quality sleep/recovery.]

💊 STRESS DAMAGE:
[How ${primaryStatePercentage}% ${dominantState} harms their body.]

🩺 HEALTH BLIND SPOT:
[What they CANNOT SEE because of ${blindSubtype} blind spot.]`;

// LEADERSHIP Domain Prompt
const leadershipPrompt = (dominantState, primaryStatePercentage, dominantSubtype, blindSubtype) => `
Write 5 brutally specific examples showing how their pattern LIMITS LEADERSHIP:

👔 AUTHORITY SABOTAGE:
[How ${dominantState} at ${primaryStatePercentage}% undermines their leadership presence.]

🗣️ COMMUNICATION DYSFUNCTION:
[How ${dominantSubtype} + ${dominantState} creates leadership communication failures.]

👥 TEAM BLIND SPOT:
[Why they fail to build strong teams.]

📈 DECISION PARALYSIS:
[How ${primaryStatePercentage}% ${dominantState} slows critical decisions.]

🎯 VISION BLIND SPOT:
[What they CANNOT SEE because of ${blindSubtype} blind spot.]`;

// PARENTING Domain Prompt
const parentingPrompt = (dominantState, primaryStatePercentage, dominantSubtype, blindSubtype) => `
Write 5 brutally specific examples showing how their pattern AFFECTS PARENTING:

👨‍👩‍👧 CONNECTION SABOTAGE:
[How ${dominantState} at ${primaryStatePercentage}% blocks parent-child bonding.]

😤 TRIGGER PATTERNS:
[How ${dominantSubtype} + ${dominantState} creates overreaction patterns.]

🎯 EXPECTATION DYSFUNCTION:
[Why their expectations harm their children.]

💔 EMOTIONAL DAMAGE:
[How ${primaryStatePercentage}% ${dominantState} affects their kids.]

👪 PARENTING BLIND SPOT:
[What they CANNOT SEE because of ${blindSubtype} blind spot.]`;

export async function generateAISynthesizedSections(
  typeId: number, 
  assessmentData: AssessmentData, 
  language: string = 'en', 
  domain: string = 'general'
) {
  const { dominantState, secondaryState, primaryStatePercentage, secondaryStatePercentage, subtypeProfile } = assessmentData;
  const dominantSubtype = subtypeProfile?.subtypes?.[0] || 'sp';
  const blindSubtype = subtypeProfile?.blindSubtype || subtypeProfile?.subtypes?.[2] || 'so';
  
  // Generate all sections in parallel
  const [brutalTruth, corePattern, statesControl, subtypeFocus, whatMattersNow, realLifeImpact] = await Promise.all([
    synthesizeBrutalTruth(typeId, assessmentData, language, domain),
    synthesizeCorePattern(typeId, assessmentData, language, domain),
    synthesizeStatesControl(typeId, assessmentData, language, domain),
    synthesizeSubtypeFocus(typeId, assessmentData, language, domain),
    synthesizeWhatMattersNow(typeId, assessmentData, language, domain),
    synthesizeCurrentStateReality(typeId, assessmentData, language, domain)
  ]);

  return { brutalTruth, corePattern, statesControl, subtypeFocus, whatMattersNow, realLifeImpact };
}
```

---

# 12. EMAIL SERVICE (SendGrid Integration)

```typescript
// FILE: apps/api/src/modules/inner-dna/services/email-service.ts

import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@innerdna.app';
const COACH_EMAIL = process.env.COACH_EMAIL || 'coach@innerdna.app';
const COACH_NAME = process.env.COACH_NAME || 'Inner DNA Coach';

if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

interface BookingConfirmationData {
  clientName: string;
  clientEmail: string;
  coachName: string;
  coachEmail: string;
  bookingDate: string;
  bookingTime: string;
  timezone: string;
  personalityType?: string;
  reportSlug?: string;
  meetingLink?: string;
}

// Sends emails to BOTH client and coach
async function sendBookingConfirmationEmails(data: BookingConfirmationData) {
  // Send to client
  await sgMail.send({
    to: data.clientEmail,
    from: FROM_EMAIL,
    subject: `Your Inner DNA Coaching Call is Confirmed - ${data.bookingDate}`,
    html: generateBookingEmailHtml(data, false),
    text: generateBookingEmailText(data, false)
  });

  // Send to coach
  await sgMail.send({
    to: data.coachEmail,
    from: FROM_EMAIL,
    subject: `New Coaching Call Booked - ${data.clientName} (${data.bookingDate})`,
    html: generateBookingEmailHtml(data, true),
    text: generateBookingEmailText(data, true)
  });
}

// Email template uses SENTINEL dark theme matching Inner DNA reports
// Colors: #0B0B0D background, #dc2626 accent, linear-gradient(135deg, #dc2626 0%, #f59e0b 100%)
```

---

# 13. ENVIRONMENT VARIABLES

Required environment variables for the system:

```bash
# Database (PostgreSQL)
DATABASE_URL=postgresql://user:pass@host:5432/database
PGHOST=
PGPORT=5432
PGUSER=
PGPASSWORD=
PGDATABASE=

# AI Integration (Replit AI Integrations)
AI_INTEGRATIONS_ANTHROPIC_BASE_URL=  # Provided by Replit
AI_INTEGRATIONS_ANTHROPIC_API_KEY=   # Provided by Replit

# Email Service (SendGrid)
SENDGRID_API_KEY=                    # From SendGrid
SENDGRID_FROM_EMAIL=noreply@innerdna.app
COACH_EMAIL=coach@innerdna.app
COACH_NAME=Arfeen Khan

# Payments (Stripe)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_BASIC=               # $29.99 reports
STRIPE_PRICE_ID_PREMIUM=             # $39.99 reports

# JWT Authentication
JWT_SECRET=                          # 256-bit secret
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_EXPIRES_IN=30d

# Application
NEXT_PUBLIC_API_URL=                 # Backend API URL
NEXT_PUBLIC_SITE_URL=                # Frontend URL
```

---

# USAGE INSTRUCTIONS

When implementing the Inner DNA system:

1. **Database Setup**: Use the PostgreSQL schema above with Drizzle ORM
2. **Assessment Flow**: RHETI → Quick Check → Hero Moments → Building Blocks → Color States → Subtypes → Results
3. **Hero Moments Algorithm**: Use Bayesian confidence tracking with 90% threshold
4. **AI Integration**: Use Claude Sonnet 4.5 with the system prompts provided
5. **Chat Flow**: 4-phase coaching discovery with in-chat booking integration
6. **Multi-Language**: Support 4 languages with grade-4 reading level
7. **Report Types**: 10 domain-specific reports with AI-generated sections
8. **Email Notifications**: SendGrid for booking confirmations to both client and coach

---

# QUICK REFERENCE

## 9 Personality Types
| Type | Name | Core Pattern |
|------|------|--------------|
| 1 | REFORMER | Standards, perfection, right/wrong |
| 2 | HELPER | Giving, being needed, relationships |
| 3 | ACHIEVER | Success, image, achievement |
| 4 | INDIVIDUALIST | Identity, authenticity, emotions |
| 5 | INVESTIGATOR | Knowledge, analysis, competence |
| 6 | SENTINEL | Security, loyalty, preparation |
| 7 | ENTHUSIAST | Options, adventure, positivity |
| 8 | CHALLENGER | Control, strength, protection |
| 9 | PEACEMAKER | Harmony, peace, comfort |

## 5 Emotional States (per type)
1. **Very Good** - Peak integration
2. **Good** - Healthy functioning
3. **Average** - Normal daily state
4. **Below Average** - Stress response
5. **Destructive** - Disintegration

## 3 Subtypes (Instincts)
- **SP** (Self-Preservation) - Focus on resources, health, security
- **SX** (Sexual/One-to-One) - Focus on intense connection, passion
- **SO** (Social) - Focus on groups, belonging, recognition

## Algorithm Thresholds
- **90%** confidence required to complete Hero Moments
- **70%** threshold to enter adaptive phase
- **5-25** scenarios depending on clarity
- **PRIOR_WEIGHT = 3** for RHETI blending

---

# COMPANION DOCUMENTS

## Multi-Language & AI Complete Export
For COMPLETE multi-language support and AI integration details, see:
**[MULTI_LANGUAGE_AND_AI_COMPLETE.md](./MULTI_LANGUAGE_AND_AI_COMPLETE.md)**

This companion document includes:
- **i18n Configuration**: All 4 languages (English, Hindi Devanagari, Hinglish, Urdu RTL)
- **Complete State Translations**: All 45 states (9 types × 5 states) in all 4 languages
- **RHETI Questions**: All 36 questions with translation framework
- **AI Synthesis Engine**: Claude Sonnet 4.5 integration with 6 report sections
- **AI Chat Service**: Complete 4-phase coaching discovery flow
- **Language Writing Rules**: Grade 4 reading level rules per language
- **Complete Translation Matrix**: 109 placeholders × 9 types × 3 languages
- **Chat Domain Configuration**: All 10 report domains
- **Content Atoms Structure**: Domain-specific content organization

---

This is the **COMPLETE** Inner DNA system export. Use this as the authoritative reference for implementation.

---

---

# 14. HERO MOMENTS SCENARIOS (NEW BUILT SYSTEM)

**Source File:** `apps/api/src/modules/inner-dna/data/heroMomentsData.ts`
**Total Scenarios:** 27 (15 General + 12 Targeted)
**Algorithm:** Bayesian confidence tracking with 90% threshold

## Configuration

```typescript
export const CONFIDENCE_THRESHOLDS = {
  MIN_CONFIDENCE: 0.9,  // 90% confidence required to complete
  HIGH_CONFIDENCE: 0.95,
  PERFECT_CONFIDENCE: 1.0,
  ADAPTIVE_THRESHOLD: 0.7,
  LOW_CONFIDENCE: 0.5
};
```

## Scenario Structure

Each scenario follows this interface:
```typescript
interface HeroMomentScenario {
  id: string;
  title: string;
  description: string;
  context: string;
  scenario: string;
  options: HeroMomentOption[];  // 9 options, one per type
  category: "general" | "targeted";
  targetTypes?: number[];  // For targeted scenarios
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
}

interface HeroMomentOption {
  id: string;
  text: string;
  personalityType: number;  // 1-9
  confidence: number;  // 0.8-0.9 typically
  reasoning?: string;
}
```

## General Scenarios (15)
1. **Family Budget Emergency** - Financial crisis response
2. **Crisis Leadership** - Decision making under pressure
3. **The Difficult Conversation** - Conflict resolution
4. **Career Crossroads** - Major life decision
5. **Team Conflict** - Workplace dynamics
6. **Personal Betrayal** - Trust broken response
7. **Opportunity Knocks** - Unexpected chance
8. **Family Tension** - Holiday gathering dynamics
9. **Recognition Moment** - Success acknowledgment
10. **Resource Scarcity** - Limited resources handling
11. **Moral Dilemma** - Ethics vs practicality
12. **Vulnerability Required** - Opening up emotionally
13. **Legacy Question** - What you leave behind
14. **Unexpected Help** - Receiving assistance
15. **Group Decision** - Collective choice making

## Targeted Scenarios (12)
Disambiguate between commonly confused types:
- **1v2** - Reformer vs Helper
- **1v6** - Reformer vs Sentinel
- **1v8** - Reformer vs Challenger
- **2v8** - Helper vs Challenger
- **3v7** - Achiever vs Enthusiast
- **3v8** (5 scenarios) - Achiever vs Challenger disambiguation
- **6v8** - Sentinel vs Challenger

## How Algorithm Works

1. Start with general scenarios (random order)
2. Track Bayesian confidence per type
3. When confidence plateaus, switch to targeted scenarios
4. Target scenarios chosen based on top-2 competing types
5. Complete when one type reaches 90%+ confidence
6. Maximum 27 scenarios, minimum ~8-12 typically

---

# 15. RHETI QUESTIONS (36-Question Assessment)

**Source File:** `apps/web/src/lib/inner-dna/rhetiQuestions.ts`
**Purpose:** Initial personality type screening before Hero Moments

export type Question = { 
  id: number; 
  left: string; 
  right: string; 
  colLeft: "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"; 
  colRight: "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I" 
};

export const RQ: Question[] = [
  // First loop (Questions 1-9)
  { id: 1, left: "I've been romantic and imaginative.", right: "I've been pragmatic and down to earth.", colLeft: "A", colRight: "B" },
  { id: 2, left: "I have tended to take on confrontations.", right: "I have tended avoid confrontations.", colLeft: "C", colRight: "D" },
  { id: 3, left: "I have typically been diplomatic, charming, and ambitious.", right: "I have typically been direct, formal, and idealistic.", colLeft: "E", colRight: "F" },
  { id: 4, left: "I have tended to be focused and intense.", right: "I have tended to be spontaneous and fun-loving.", colLeft: "G", colRight: "H" },
  { id: 5, left: "I have been a hospitable person and have enjoyed welcoming new friends into my life.", right: "I have been a private person and have not mixed much with others.", colLeft: "I", colRight: "A" },
  { id: 6, left: "Generally, it's been easy to \"get a rise\" out of me.", right: "Generally, it's been difficult to \"get a rise\" out of me.", colLeft: "B", colRight: "C" },
  { id: 7, left: "I've been more of a \"street-smart\" survivor.", right: "I've been more of a \"high-minded\" idealist.", colLeft: "D", colRight: "E" },
  { id: 8, left: "I have needed to show affection to people.", right: "I have preferred to maintain a certain distance with people.", colLeft: "F", colRight: "G" },
  { id: 9, left: "When presented with a new experience, I've usually asked myself if it would be useful to me.", right: "When presented with a new experience, I've usually asked myself if it would be enjoyable.", colLeft: "H", colRight: "I" },

  // Second loop (Questions 10-18)
  { id: 10, left: "I have tended to focus too much on myself.", right: "I have tended to focus too much on others.", colLeft: "A", colRight: "B" },
  { id: 11, left: "Others have depended on my insight and knowledge.", right: "Others have depended on my strength and decisiveness.", colLeft: "C", colRight: "D" },
  { id: 12, left: "I have come across as being too unsure of myself.", right: "I have come across as being too sure of myself.", colLeft: "E", colRight: "F" },
  { id: 13, left: "I have been more relationship-oriented than goal-oriented.", right: "I have been more goal-oriented than relationship-oriented.", colLeft: "G", colRight: "H" },
  { id: 14, left: "I have not been able to speak up for myself very well.", right: "I have been outspoken—I've said what others wished they had the nerve to say.", colLeft: "I", colRight: "A" },
  { id: 15, left: "It's been difficult for me to stop considering alternatives and do something definite.", right: "It's been difficult for me to take it easy and be more flexible.", colLeft: "B", colRight: "C" },
  { id: 16, left: "I have tended to be hesitant and procrastinating.", right: "I have tended to be bold and domineering.", colLeft: "D", colRight: "E" },
  { id: 17, left: "My reluctance to get too involved has gotten me into trouble with people.", right: "My eagerness to have people depend on me has gotten me into trouble with them.", colLeft: "F", colRight: "G" },
  { id: 18, left: "Usually, I have been able to put my feelings aside to get the job done.", right: "Usually, I have needed to work through my feelings before I could act.", colLeft: "H", colRight: "I" },

  // Third loop (Questions 19-27)
  { id: 19, left: "Generally, I have been methodical and cautious.", right: "Generally, I have been adventurous and taken risks.", colLeft: "A", colRight: "B" },
  { id: 20, left: "I have tended to be a supportive, giving person who enjoys the company of others.", right: "I have tended to be a serious, reserved person who likes discussing issues.", colLeft: "C", colRight: "D" },
  { id: 21, left: "I've often felt the need to be a \"pillar of strength.\"", right: "I've often felt the need to perform perfectly.", colLeft: "E", colRight: "F" },
  { id: 22, left: "I've typically been interested in asking tough questions and maintaining my independence.", right: "I've typically been interested in maintaining my stability and peace of mind.", colLeft: "G", colRight: "H" },
  { id: 23, left: "I've been too hard-nosed and sceptical.", right: "I've been too soft-hearted and sentimental.", colLeft: "I", colRight: "A" },
  { id: 24, left: "I've often worried that I'm missing out on something better.", right: "I've often worried that if I let down my guard, someone will take advantage of me.", colLeft: "B", colRight: "C" },
  { id: 25, left: "My habit of being \"stand-offish\" has annoyed people.", right: "My habit of telling people what to do has annoyed people.", colLeft: "D", colRight: "E" },
  { id: 26, left: "Usually, when troubles have gotten to me, I have been able to \"tune them out.\"", right: "Usually, when troubles have gotten to me, I have treated myself to something I've enjoyed.", colLeft: "F", colRight: "G" },
  { id: 27, left: "I have depended upon my friends and they have known that they can depend on me.", right: "I have not depended on people; I have done things on my own.", colLeft: "H", colRight: "I" },

  // Fourth loop (Questions 28-36)
  { id: 28, left: "I have tended to be detached and preoccupied.", right: "I have tended to be moody and self-absorbed.", colLeft: "A", colRight: "B" },
  { id: 29, left: "I have liked to challenge people and \"shake them up.\"", right: "I have liked to comfort people and calm them down.", colLeft: "C", colRight: "D" },
  { id: 30, left: "I have generally been an outgoing, sociable person.", right: "I have generally been an earnest, self-disciplined person.", colLeft: "E", colRight: "F" },
  { id: 31, left: "I've usually been shy about showing my abilities.", right: "I've usually liked to let people know what I can do well.", colLeft: "G", colRight: "H" },
  { id: 32, left: "Pursuing my personal interests has been more important to me than having comfort and security.", right: "Having comfort and security has been more important to me than pursuing my personal interests.", colLeft: "I", colRight: "A" },
  { id: 33, left: "When I've had conflict with others, I've tended to withdraw.", right: "When I've had conflict with others, I've rarely backed down.", colLeft: "B", colRight: "C" },
  { id: 34, left: "I have given in too easily and let others push me around.", right: "I have been too uncompromising and demanding with others.", colLeft: "D", colRight: "E" },
  { id: 35, left: "I've been appreciated for my unsinkable spirit and great sense of humour.", right: "I've been appreciated for my quiet strength and exceptional generosity.", colLeft: "F", colRight: "G" },
  { id: 36, left: "Much of my success has been due to my talent for making a favourable impression.", right: "Much of my success has been achieved despite my lack of interest in developing \"interpersonal skills.\"", colLeft: "H", colRight: "I" }
];

// RHETI Scorer - converts 36 answers to 9 type scores
// EXACT SYSTEM from TechSpec/bayes/rhetiScorer.ts - DO NOT MODIFY
export function scoreRheti(answers: string[]): number[] {
  const MAP = {A:0, B:1, C:2, D:3, E:4, F:5, G:6, H:7, I:8} as const;
  
  // INDEX_TO_TYPE mapping from TechSpec established test system
  const INDEX_TO_TYPE: Record<number, number> = {
    0: 9, 1: 6, 2: 3, 3: 1, 4: 4, 5: 2, 6: 8, 7: 5, 8: 7
  };
  
  if (answers.length !== 36) {
    console.warn("RHETI: Expected 36 answers, got", answers.length);
    return Array(9).fill(0);
  }
  
  // Count column tallies using original MAP
  const columnTally = Array(9).fill(0);
  answers.forEach(ch => {
    if (ch && MAP[ch as keyof typeof MAP] !== undefined) {
      columnTally[MAP[ch as keyof typeof MAP]]++;
    }
  });
  
  // Convert to personality type scores using INDEX_TO_TYPE
  const typeScores = Array(9).fill(0);
  for (let colIndex = 0; colIndex < 9; colIndex++) {
    const personalityType = INDEX_TO_TYPE[colIndex];
    const arrayIndex = personalityType - 1; // Convert to 0-based index
    typeScores[arrayIndex] = columnTally[colIndex];
  }
  
  return typeScores;
}

// Get top 3 types from scores
export function getTop3Types(scores: number[]): number[] {
  return scores
    .map((score, index) => ({ score, type: index + 1 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.type);
}

// Normalize scores to probabilities (sum to 1)
export function normalizeToPriors(scores: number[]): number[] {
  const total = scores.reduce((sum, s) => sum + s, 0);
  if (total === 0) return scores.map(() => 1/9);
  return scores.map(s => s / total);
}

Enhanced version:
/**
 * Enhanced RHETI Questions
 * 
 * Same proven column-mapping system, shortened statements for faster UX.
 * Each statement is max 10 words while preserving meaning.
 */

export type Question = { 
  id: number; 
  left: string; 
  right: string; 
  colLeft: "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"; 
  colRight: "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I" 
};

export const RQ: Question[] = [
  // Round 1 (Questions 1-6)
  { id: 1, left: "I'm romantic and imaginative.", right: "I'm pragmatic and down to earth.", colLeft: "A", colRight: "B" },
  { id: 2, left: "I take on confrontations.", right: "I avoid confrontations.", colLeft: "C", colRight: "D" },
  { id: 3, left: "I'm diplomatic, charming, and ambitious.", right: "I'm direct, formal, and idealistic.", colLeft: "E", colRight: "F" },
  { id: 4, left: "I'm focused and intense.", right: "I'm spontaneous and fun-loving.", colLeft: "G", colRight: "H" },
  { id: 5, left: "I welcome new friends into my life.", right: "I'm private and don't mix much.", colLeft: "I", colRight: "A" },
  { id: 6, left: "It's easy to get a rise out of me.", right: "It's hard to get a rise out of me.", colLeft: "B", colRight: "C" },

  // Round 2 (Questions 7-12)
  { id: 7, left: "I'm a street-smart survivor.", right: "I'm a high-minded idealist.", colLeft: "D", colRight: "E" },
  { id: 8, left: "I need to show affection to people.", right: "I prefer distance with people.", colLeft: "F", colRight: "G" },
  { id: 9, left: "I ask if things will be useful.", right: "I ask if things will be enjoyable.", colLeft: "H", colRight: "I" },
  { id: 10, left: "I focus too much on myself.", right: "I focus too much on others.", colLeft: "A", colRight: "B" },
  { id: 11, left: "Others depend on my insight.", right: "Others depend on my strength.", colLeft: "C", colRight: "D" },
  { id: 12, left: "I come across as unsure.", right: "I come across as too sure.", colLeft: "E", colRight: "F" },

  // Round 3 (Questions 13-18)
  { id: 13, left: "I'm more relationship-oriented.", right: "I'm more goal-oriented.", colLeft: "G", colRight: "H" },
  { id: 14, left: "I haven't spoken up for myself.", right: "I've been outspoken and direct.", colLeft: "I", colRight: "A" },
  { id: 15, left: "I consider alternatives too long.", right: "I find it hard to be flexible.", colLeft: "B", colRight: "C" },
  { id: 16, left: "I'm hesitant and procrastinating.", right: "I'm bold and domineering.", colLeft: "D", colRight: "E" },
  { id: 17, left: "Not getting involved causes trouble.", right: "People depending on me causes trouble.", colLeft: "F", colRight: "G" },
  { id: 18, left: "I put feelings aside to get things done.", right: "I work through feelings before acting.", colLeft: "H", colRight: "I" },

  // Round 4 (Questions 19-24)
  { id: 19, left: "I'm methodical and cautious.", right: "I'm adventurous and take risks.", colLeft: "A", colRight: "B" },
  { id: 20, left: "I'm supportive and enjoy company.", right: "I'm reserved and discuss issues.", colLeft: "C", colRight: "D" },
  { id: 21, left: "I need to be a pillar of strength.", right: "I need to perform perfectly.", colLeft: "E", colRight: "F" },
  { id: 22, left: "I ask tough questions, stay independent.", right: "I maintain stability and peace.", colLeft: "G", colRight: "H" },
  { id: 23, left: "I've been hard-nosed and skeptical.", right: "I've been soft-hearted and sentimental.", colLeft: "I", colRight: "A" },
  { id: 24, left: "I worry I'm missing something better.", right: "I worry someone will take advantage.", colLeft: "B", colRight: "C" },

  // Round 5 (Questions 25-30)
  { id: 25, left: "Being standoffish annoys people.", right: "Telling people what to do annoys them.", colLeft: "D", colRight: "E" },
  { id: 26, left: "When troubled, I tune things out.", right: "When troubled, I treat myself.", colLeft: "F", colRight: "G" },
  { id: 27, left: "I depend on friends, they depend on me.", right: "I don't depend on people.", colLeft: "H", colRight: "I" },
  { id: 28, left: "I'm detached and preoccupied.", right: "I'm moody and self-absorbed.", colLeft: "A", colRight: "B" },
  { id: 29, left: "I like to challenge and shake people up.", right: "I like to comfort and calm people.", colLeft: "C", colRight: "D" },
  { id: 30, left: "I'm outgoing and sociable.", right: "I'm earnest and self-disciplined.", colLeft: "E", colRight: "F" },

  // Round 6 (Questions 31-36)
  { id: 31, left: "I'm shy about showing my abilities.", right: "I like showing what I can do.", colLeft: "G", colRight: "H" },
  { id: 32, left: "Personal interests over comfort.", right: "Comfort and security over interests.", colLeft: "I", colRight: "A" },
  { id: 33, left: "In conflict, I withdraw.", right: "In conflict, I rarely back down.", colLeft: "B", colRight: "C" },
  { id: 34, left: "I give in too easily.", right: "I'm too demanding with others.", colLeft: "D", colRight: "E" },
  { id: 35, left: "I'm appreciated for my spirit and humor.", right: "I'm appreciated for strength and generosity.", colLeft: "F", colRight: "G" },
  { id: 36, left: "Success came from making good impressions.", right: "Success came despite lacking social skills.", colLeft: "H", colRight: "I" }
];

// Round labels for the 6-chunk structure
export const ROUND_LABELS = [
  "Your Natural Style",
  "How You Connect",
  "Your Inner Drive",
  "Your Approach",
  "Under Pressure", 
  "Your Strengths"
];

// Micro-celebrations between rounds
export const ROUND_CELEBRATIONS = [
  "Great start! Your patterns are emerging...",
  "Interesting! I'm seeing something unique...",
  "Halfway there! Your profile is taking shape...",
  "Fascinating insights coming through...",
  "Almost done! Just one more round...",
  "Complete! Let's see what we discovered..."
];

// RHETI Scorer - converts 36 answers to 9 type scores
// EXACT SYSTEM from TechSpec - DO NOT MODIFY
export function scoreRheti(answers: string[]): number[] {
  const MAP = {A:0, B:1, C:2, D:3, E:4, F:5, G:6, H:7, I:8} as const;
  
  const INDEX_TO_TYPE: Record<number, number> = {
    0: 9, 1: 6, 2: 3, 3: 1, 4: 4, 5: 2, 6: 8, 7: 5, 8: 7
  };
  
  if (answers.length !== 36) {
    console.warn("RHETI: Expected 36 answers, got", answers.length);
    return Array(9).fill(0);
  }
  
  const columnTally = Array(9).fill(0);
  answers.forEach(ch => {
    if (ch && MAP[ch as keyof typeof MAP] !== undefined) {
      columnTally[MAP[ch as keyof typeof MAP]]++;
    }
  });
  
  const typeScores = Array(9).fill(0);
  for (let colIndex = 0; colIndex < 9; colIndex++) {
    const personalityType = INDEX_TO_TYPE[colIndex];
    const arrayIndex = personalityType - 1;
    typeScores[arrayIndex] = columnTally[colIndex];
  }
  
  return typeScores;
}

// Get top 3 types from scores
export function getTop3Types(scores: number[]): number[] {
  return scores
    .map((score, index) => ({ score, type: index + 1 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.type);
}

// Normalize scores to probabilities (sum to 1)
export function normalizeToPriors(scores: number[]): number[] {
  const total = scores.reduce((sum, s) => sum + s, 0);
  if (total === 0) return scores.map(() => 1/9);
  return scores.map(s => s / total);
}

// Response time thresholds for confidence weighting
export const RESPONSE_TIME = {
  FAST: 2000,      // Under 2s = confident choice
  NORMAL: 5000,    // 2-5s = normal
  SLOW: 10000      // Over 10s = uncertain
};

// Calculate confidence weight from response time
export function getResponseConfidence(responseTimeMs: number): number {
  if (responseTimeMs < RESPONSE_TIME.FAST) return 1.2;  // Boost
  if (responseTimeMs < RESPONSE_TIME.NORMAL) return 1.0; // Normal
  if (responseTimeMs < RESPONSE_TIME.SLOW) return 0.9;   // Slight penalty
  return 0.7; // Significant hesitation
}

---

# 16. WING DISCOVERY ALGORITHM

**Source File:** `apps/web/src/lib/inner-dna/wingDiscovery.ts`
**Purpose:** Determine wing influence after core type identified

/**
 * Wing Discovery Algorithm
 * 
 * Calculates wing (adjacent type influence) using:
 * 1. RHETI column scores for adjacent types
 * 2. Hero Moments vote spillover
 * 3. User's behavioral choice confirmation
 * 
 * Output uses naming like "Challenger 7" or "Challenger 9"
 */

import { TYPE_NAMES } from './heroMomentsData';

// Column to Type mapping (from RHETI)
const COLUMN_TO_TYPE: Record<string, number> = {
  'A': 9, 'B': 6, 'C': 3, 'D': 1, 'E': 4, 'F': 2, 'G': 8, 'H': 5, 'I': 7
};

// Reverse mapping: Type to Column
const TYPE_TO_COLUMN: Record<number, string> = {
  9: 'A', 6: 'B', 3: 'C', 1: 'D', 4: 'E', 2: 'F', 8: 'G', 5: 'H', 7: 'I'
};

export interface WingPriorData {
  coreType: number;
  wingA: number;  // Lower adjacent (or wraparound)
  wingB: number;  // Higher adjacent (or wraparound)
  wingAPrior: number;  // 0-1 probability for wing A
  wingBPrior: number;  // 0-1 probability for wing B
  priorStrength: number;  // 0=balanced, 1=one-sided
  userWeight: number;  // How much to weight user choice vs algorithm
  coreTypeName: string;
  wingAName: string;
  wingBName: string;
}

export interface WingResult {
  wing: number;
  wingName: string;
  fullName: string;  // e.g., "Challenger 7"
  confidence: number;
  userChoice: 'wingA' | 'wingB' | 'balanced';
  priorData: WingPriorData;
}

export interface WingContrastiveStatement {
  coreType: number;
  scenario: string;  // The situation/question
  optionA: {
    text: string;
    wing: number;
  };
  optionB: {
    text: string;
    wing: number;
  };
}

/**
 * Get adjacent wings for a given core type with wraparound
 */
export function getAdjacentWings(coreType: number): { wingA: number; wingB: number } {
  const wingA = coreType === 1 ? 9 : coreType - 1;
  const wingB = coreType === 9 ? 1 : coreType + 1;
  return { wingA, wingB };
}

/**
 * Calculate wing priors from existing assessment data
 */
export function calculateWingPriors(
  coreType: number,
  rhetiScores: number[],  // Array of 9 scores (index 0 = Type 1)
  heroMomentsVotes?: number[],  // Optional: votes per type from Hero Moments
  quickCheckBoosts?: number[]   // Optional: boosts from Quick Check
): WingPriorData {
  const { wingA, wingB } = getAdjacentWings(coreType);
  
  // Get scores for adjacent types
  const rhetiA = rhetiScores[wingA - 1] || 0;
  const rhetiB = rhetiScores[wingB - 1] || 0;
  
  const heroA = heroMomentsVotes ? (heroMomentsVotes[wingA - 1] || 0) : 0;
  const heroB = heroMomentsVotes ? (heroMomentsVotes[wingB - 1] || 0) : 0;
  
  const qcA = quickCheckBoosts ? (quickCheckBoosts[wingA - 1] || 0) : 0;
  const qcB = quickCheckBoosts ? (quickCheckBoosts[wingB - 1] || 0) : 0;
  
  // Weighted signal calculation
  // RHETI is most reliable (0.7), Hero Moments is weaker (0.2), Quick Check is minimal (0.1)
  const signalA = 0.7 * rhetiA + 0.2 * heroA + 0.1 * qcA;
  const signalB = 0.7 * rhetiB + 0.2 * heroB + 0.1 * qcB;
  
  const totalSignal = signalA + signalB;
  
  let wingAPrior: number;
  let wingBPrior: number;
  let userWeight: number;
  
  if (totalSignal < 2) {
    // Insufficient data - rely almost entirely on user choice
    wingAPrior = 0.5;
    wingBPrior = 0.5;
    userWeight = 0.9;
  } else {
    wingAPrior = signalA / totalSignal;
    wingBPrior = signalB / totalSignal;
    
    // Adaptive weighting based on prior strength
    const priorStrength = Math.abs(wingAPrior - 0.5) * 2;
    userWeight = priorStrength > 0.3 ? 0.5 : 0.7;
  }
  
  const priorStrength = Math.abs(wingAPrior - 0.5) * 2;
  
  return {
    coreType,
    wingA,
    wingB,
    wingAPrior,
    wingBPrior,
    priorStrength,
    userWeight,
    coreTypeName: TYPE_NAMES[coreType as keyof typeof TYPE_NAMES] || `Type ${coreType}`,
    wingAName: TYPE_NAMES[wingA as keyof typeof TYPE_NAMES] || `Type ${wingA}`,
    wingBName: TYPE_NAMES[wingB as keyof typeof TYPE_NAMES] || `Type ${wingB}`
  };
}

/**
 * Resolve final wing based on user choice and prior data
 */
export function resolveWing(
  priorData: WingPriorData,
  userChoice: 'wingA' | 'wingB' | 'balanced'
): WingResult {
  const { wingA, wingB, wingAPrior, wingBPrior, userWeight, priorStrength, coreTypeName } = priorData;
  
  let finalWing: number;
  let confidence: number;
  
  if (userChoice === 'balanced') {
    // User is uncertain - trust the algorithm
    finalWing = wingAPrior >= wingBPrior ? wingA : wingB;
    confidence = 0.5 + (priorStrength * 0.2);  // 50-70%
  } else {
    const userPickedA = (userChoice === 'wingA');
    const algorithmPreferredA = (wingAPrior > wingBPrior);
    const userAgrees = (userPickedA === algorithmPreferredA);
    
    if (userAgrees) {
      // User and algorithm agree - high confidence
      finalWing = userPickedA ? wingA : wingB;
      confidence = 0.7 + (priorStrength * 0.2);  // 70-90%
    } else {
      // User disagrees with algorithm - still trust user but note lower confidence
      finalWing = userPickedA ? wingA : wingB;
      confidence = 0.55 + (userWeight * 0.1);  // 55-65%
    }
  }
  
  // Edge case: truly balanced prior and user says balanced
  if (Math.abs(wingAPrior - 0.5) < 0.05 && userChoice === 'balanced') {
    finalWing = Math.min(wingA, wingB);  // Default to lower wing number
    confidence = 0.45;  // Low confidence flag
  }
  
  const wingName = TYPE_NAMES[finalWing as keyof typeof TYPE_NAMES] || `Type ${finalWing}`;
  const fullName = `${coreTypeName} ${finalWing}`;  // e.g., "Challenger 7"
  
  return {
    wing: finalWing,
    wingName,
    fullName,
    confidence,
    userChoice,
    priorData
  };
}

/**
 * Behavioral contrastive statements for wing discovery
 * Each statement discriminates between the two possible wings for a core type
 */
export const wingContrastiveStatements: WingContrastiveStatement[] = [
  // Type 1: Wings are 9 and 2
  {
    coreType: 1,
    scenario: "When you notice something isn't being done correctly...",
    optionA: {
      text: "I take a step back and consider if it's worth the conflict to address it",
      wing: 9
    },
    optionB: {
      text: "I step in to help fix it or guide others to do it the right way",
      wing: 2
    }
  },
  
  // Type 2: Wings are 1 and 3
  {
    coreType: 2,
    scenario: "When you help someone and they don't appreciate it...",
    optionA: {
      text: "I feel frustrated that they're not doing the right thing by acknowledging help",
      wing: 1
    },
    optionB: {
      text: "I shift my focus to helping others who will better appreciate my efforts",
      wing: 3
    }
  },
  
  // Type 3: Wings are 2 and 4
  {
    coreType: 3,
    scenario: "When you achieve a major success...",
    optionA: {
      text: "I immediately think about sharing it and celebrating with my team",
      wing: 2
    },
    optionB: {
      text: "I privately reflect on what this achievement means about who I am",
      wing: 4
    }
  },
  
  // Type 4: Wings are 3 and 5
  {
    coreType: 4,
    scenario: "When you feel misunderstood by others...",
    optionA: {
      text: "I channel that energy into creating something that proves my worth",
      wing: 3
    },
    optionB: {
      text: "I withdraw to analyze and understand the deeper meaning of what happened",
      wing: 5
    }
  },
  
  // Type 5: Wings are 4 and 6
  {
    coreType: 5,
    scenario: "When exploring a new area of knowledge...",
    optionA: {
      text: "I'm drawn to unconventional or aesthetically rich perspectives",
      wing: 4
    },
    optionB: {
      text: "I focus on practical applications and potential problems to solve",
      wing: 6
    }
  },
  
  // Type 6: Wings are 5 and 7
  {
    coreType: 6,
    scenario: "When you're worried about a potential problem...",
    optionA: {
      text: "I research extensively and prepare detailed contingency plans",
      wing: 5
    },
    optionB: {
      text: "I try to stay positive and find ways to make the situation more fun",
      wing: 7
    }
  },
  
  // Type 7: Wings are 6 and 8
  {
    coreType: 7,
    scenario: "When an exciting opportunity comes up but has risks...",
    optionA: {
      text: "I carefully consider the downsides before committing",
      wing: 6
    },
    optionB: {
      text: "I dive in boldly and figure out the details as I go",
      wing: 8
    }
  },
  
  // Type 8: Wings are 7 and 9
  {
    coreType: 8,
    scenario: "When you can't solve a problem immediately...",
    optionA: {
      text: "I get restless and look for a new angle or adventure",
      wing: 7
    },
    optionB: {
      text: "I steady myself and wait for the right moment to act",
      wing: 9
    }
  },
  
  // Type 9: Wings are 8 and 1
  {
    coreType: 9,
    scenario: "When someone is being treated unfairly...",
    optionA: {
      text: "I feel a surge of protective anger and want to confront the situation",
      wing: 8
    },
    optionB: {
      text: "I feel upset about the wrongness and think about the right way to handle it",
      wing: 1
    }
  }
];

/**
 * Get the contrastive statement for a specific core type
 */
export function getWingContrastiveStatement(coreType: number): WingContrastiveStatement | null {
  return wingContrastiveStatements.find(s => s.coreType === coreType) || null;
}

/**
 * Get micro-celebration message after wing selection
 */
export function getWingCelebration(userChoice: 'wingA' | 'wingB' | 'balanced'): string {
  const celebrations = {
    wingA: [
      "Interesting! That tells us a lot about how you express your core...",
      "Noted! Your natural style is becoming clearer...",
      "That choice reveals something meaningful about your approach...",
    ],
    wingB: [
      "That's revealing! Your unique expression is taking shape...",
      "Interesting pattern! Your inner compass is showing through...",
      "Noted! That says something important about how you operate...",
    ],
    balanced: [
      "That's perfectly valid! Some people naturally balance both influences...",
      "Interesting! You seem to draw from both sides equally...",
      "Noted! A balanced approach has its own unique strengths...",
    ]
  };
  
  const options = celebrations[userChoice];
  return options[Math.floor(Math.random() * options.length)];
}

/**
 * Convert RHETI answers (A-I) to scores per type
 * This is needed to extract wing signals from RHETI data
 */
export function rhetiAnswersToTypeScores(answers: string[]): number[] {
  const typeScores = Array(9).fill(0);
  
  for (const answer of answers) {
    if (answer && COLUMN_TO_TYPE[answer]) {
      const type = COLUMN_TO_TYPE[answer];
      typeScores[type - 1]++;
    }
  }
  
  return typeScores;
}

/**
 * Extract Hero Moments vote counts from algorithm state
 */
export function extractHeroMomentsVotes(algorithmState: any): number[] {
  if (!algorithmState?.voteTally) {
    return Array(9).fill(0);
  }
  return algorithmState.voteTally;
}

---

# 17. QUICK CHECK DATA

**Source File:** `apps/web/src/lib/inner-dna/quickCheckData.ts`
**Purpose:** Fast personality screening questions

// Quick Check Phase - Contrastive Statements for Type Pair Disambiguation
// These statements are specifically designed to resolve ambiguity between common type pairs

export interface ContrastiveStatement {
  id: string;
  statementA: string;
  statementB: string;
  typeA: number;
  typeB: number;
  weight: number; // How discriminating this question is (1-3)
}

export interface TypePairContrastives {
  typePair: [number, number];
  statements: ContrastiveStatement[];
}

// Micro-celebration messages (shown after Hero Moment answers)
// These don't reveal the type but make users feel "seen"
export const microCelebrations = {
  // Category-based celebrations (based on the choice pattern, not specific type)
  emotional: [
    "Interesting! That tells us a lot about how you process emotions...",
    "Your emotional landscape is becoming clearer...",
    "That's revealing - you have a distinctive way of handling feelings...",
  ],
  action: [
    "Noted! You seem to have strong instincts about taking action...",
    "That response shows your natural approach to getting things done...",
    "Interesting pattern - you have a clear action style...",
  ],
  thinking: [
    "Your thought process is fascinating...",
    "That choice reveals something about how you analyze situations...",
    "Interesting! Your mental approach is becoming clearer...",
  ],
  social: [
    "That tells us something about how you navigate relationships...",
    "Your social instincts are showing through...",
    "Noted! You have a distinctive way of connecting with others...",
  ],
  identity: [
    "That's revealing - you seem to have strong self-awareness...",
    "Interesting choice - it says a lot about what matters to you...",
    "Your authentic preferences are emerging...",
  ],
  stress: [
    "That tells us how you naturally handle pressure...",
    "Your stress response patterns are becoming clear...",
    "Interesting! You have a distinctive coping style...",
  ],
  values: [
    "That choice reveals your core priorities...",
    "Noted! Your values are shaping your responses...",
    "That's telling - you know what matters to you...",
  ],
  general: [
    "Interesting choice! Your pattern is becoming clearer...",
    "Noted! That response is quite telling...",
    "That's revealing - we're learning a lot about you...",
    "Your authentic self is emerging with each answer...",
    "Interesting! You have distinctive instincts...",
    "That choice says something meaningful about you...",
  ],
};

// Function to get a random celebration based on response category
export function getMicroCelebration(category?: keyof typeof microCelebrations): string {
  const cat = category || 'general';
  const messages = microCelebrations[cat] || microCelebrations.general;
  return messages[Math.floor(Math.random() * messages.length)];
}

// Contrastive statements organized by type pairs
// These target the most common ambiguous combinations
export const typePairContrastives: TypePairContrastives[] = [
  // Type 1 (Reformer) vs Type 9 (Peacemaker) - Both can seem calm and principled
  {
    typePair: [1, 9],
    statements: [
      {
        id: '1v9_a',
        statementA: "When something is wrong, I feel compelled to fix it or speak up",
        statementB: "When something is wrong, I often let it go to keep the peace",
        typeA: 1,
        typeB: 9,
        weight: 3,
      },
      {
        id: '1v9_b',
        statementA: "I have strong opinions about how things should be done",
        statementB: "I'm usually flexible and can see merit in different approaches",
        typeA: 1,
        typeB: 9,
        weight: 2,
      },
      {
        id: '1v9_c',
        statementA: "My inner critic is loud and I hold myself to high standards",
        statementB: "I tend to be easygoing with myself and others",
        typeA: 1,
        typeB: 9,
        weight: 3,
      },
    ],
  },
  
  // Type 2 (Helper) vs Type 6 (Loyalist) - Both focused on relationships and support
  {
    typePair: [2, 6],
    statements: [
      {
        id: '2v6_a',
        statementA: "I naturally move toward people to help and connect",
        statementB: "I carefully evaluate people before fully trusting them",
        typeA: 2,
        typeB: 6,
        weight: 3,
      },
      {
        id: '2v6_b',
        statementA: "I feel most valuable when others need me",
        statementB: "I feel most secure when I have reliable people and systems",
        typeA: 2,
        typeB: 6,
        weight: 3,
      },
      {
        id: '2v6_c',
        statementA: "I rarely worry about worst-case scenarios",
        statementB: "I often think about what could go wrong to prepare for it",
        typeA: 2,
        typeB: 6,
        weight: 2,
      },
    ],
  },
  
  // Type 3 (Achiever) vs Type 7 (Enthusiast) - Both energetic and optimistic
  {
    typePair: [3, 7],
    statements: [
      {
        id: '3v7_a',
        statementA: "I'm driven to achieve specific goals and be recognized for success",
        statementB: "I'm driven to experience variety and avoid missing out on anything",
        typeA: 3,
        typeB: 7,
        weight: 3,
      },
      {
        id: '3v7_b',
        statementA: "I adapt my image based on what will help me succeed in each situation",
        statementB: "I stay true to my enthusiastic nature regardless of the situation",
        typeA: 3,
        typeB: 7,
        weight: 2,
      },
      {
        id: '3v7_c',
        statementA: "Failure feels deeply personal and affects my self-worth",
        statementB: "Failure is just a reason to pivot to something more exciting",
        typeA: 3,
        typeB: 7,
        weight: 3,
      },
    ],
  },
  
  // Type 4 (Individualist) vs Type 5 (Investigator) - Both withdrawn and introspective
  {
    typePair: [4, 5],
    statements: [
      {
        id: '4v5_a',
        statementA: "I want to be understood for my unique emotional depth",
        statementB: "I want to be respected for my knowledge and competence",
        typeA: 4,
        typeB: 5,
        weight: 3,
      },
      {
        id: '4v5_b',
        statementA: "I often feel like something is missing that others seem to have",
        statementB: "I often feel like I need more information before I'm ready to act",
        typeA: 4,
        typeB: 5,
        weight: 3,
      },
      {
        id: '4v5_c',
        statementA: "My emotions are rich and I don't want to minimize them",
        statementB: "Strong emotions can feel overwhelming so I prefer to analyze them",
        typeA: 4,
        typeB: 5,
        weight: 2,
      },
    ],
  },
  
  // Type 5 (Investigator) vs Type 9 (Peacemaker) - Both withdrawn and can seem detached
  {
    typePair: [5, 9],
    statements: [
      {
        id: '5v9_a',
        statementA: "I withdraw to conserve energy and focus on what interests me",
        statementB: "I withdraw to avoid conflict and maintain inner peace",
        typeA: 5,
        typeB: 9,
        weight: 3,
      },
      {
        id: '5v9_b',
        statementA: "I have strong opinions but keep them private",
        statementB: "I genuinely see many perspectives and struggle to pick one",
        typeA: 5,
        typeB: 9,
        weight: 2,
      },
      {
        id: '5v9_c',
        statementA: "I pursue knowledge intensely, sometimes forgetting basic needs",
        statementB: "I often neglect my own priorities while accommodating others",
        typeA: 5,
        typeB: 9,
        weight: 3,
      },
    ],
  },
  
  // Type 6 (Loyalist) vs Type 9 (Peacemaker) - Both can be accommodating and doubt themselves
  {
    typePair: [6, 9],
    statements: [
      {
        id: '6v9_a',
        statementA: "My mind is often busy scanning for potential problems",
        statementB: "My mind tends to go blank or numb when things get stressful",
        typeA: 6,
        typeB: 9,
        weight: 3,
      },
      {
        id: '6v9_b',
        statementA: "I question authority but also seek reliable structures",
        statementB: "I usually go along with what others want to avoid friction",
        typeA: 6,
        typeB: 9,
        weight: 2,
      },
      {
        id: '6v9_c',
        statementA: "Anxiety drives me to prepare and plan carefully",
        statementB: "I tend to procrastinate and distract myself from priorities",
        typeA: 6,
        typeB: 9,
        weight: 3,
      },
    ],
  },
  
  // Type 1 (Reformer) vs Type 6 (Loyalist) - Both rule-following and anxious
  {
    typePair: [1, 6],
    statements: [
      {
        id: '1v6_a',
        statementA: "I follow rules because they're the right thing to do",
        statementB: "I follow rules because they provide security and predictability",
        typeA: 1,
        typeB: 6,
        weight: 3,
      },
      {
        id: '1v6_b',
        statementA: "My inner voice criticizes me for not being good enough",
        statementB: "My inner voice worries about what might go wrong",
        typeA: 1,
        typeB: 6,
        weight: 3,
      },
      {
        id: '1v6_c',
        statementA: "I'm confident in my own judgment of right and wrong",
        statementB: "I often second-guess myself and seek reassurance from others",
        typeA: 1,
        typeB: 6,
        weight: 2,
      },
    ],
  },
  
  // Type 2 (Helper) vs Type 9 (Peacemaker) - Both accommodating and merge with others
  {
    typePair: [2, 9],
    statements: [
      {
        id: '2v9_a',
        statementA: "I actively reach out to help even when not asked",
        statementB: "I help when asked but don't usually initiate",
        typeA: 2,
        typeB: 9,
        weight: 3,
      },
      {
        id: '2v9_b',
        statementA: "I know exactly what others need, sometimes before they do",
        statementB: "I'm often unsure what I need, let alone what others need",
        typeA: 2,
        typeB: 9,
        weight: 3,
      },
      {
        id: '2v9_c',
        statementA: "I can feel resentful when my help isn't appreciated",
        statementB: "I rarely feel strong emotions like resentment",
        typeA: 2,
        typeB: 9,
        weight: 2,
      },
    ],
  },
  
  // Type 3 (Achiever) vs Type 8 (Challenger) - Both assertive and success-focused
  {
    typePair: [3, 8],
    statements: [
      {
        id: '3v8_a',
        statementA: "I care deeply about how others perceive my success",
        statementB: "I care about being strong, not about others' opinions",
        typeA: 3,
        typeB: 8,
        weight: 3,
      },
      {
        id: '3v8_b',
        statementA: "I adjust my approach to win people over",
        statementB: "I'm direct and confrontational, take it or leave it",
        typeA: 3,
        typeB: 8,
        weight: 3,
      },
      {
        id: '3v8_c',
        statementA: "I avoid conflict if it would hurt my image",
        statementB: "I don't avoid conflict - I often create it to clear the air",
        typeA: 3,
        typeB: 8,
        weight: 2,
      },
    ],
  },
  
  // Type 4 (Individualist) vs Type 6 (Loyalist) - Both can be anxious and self-doubting
  {
    typePair: [4, 6],
    statements: [
      {
        id: '4v6_a',
        statementA: "I feel different from others and sometimes defective",
        statementB: "I feel anxious about threats and seek security in groups",
        typeA: 4,
        typeB: 6,
        weight: 3,
      },
      {
        id: '4v6_b',
        statementA: "My suffering feels unique and misunderstood",
        statementB: "My worries are often about practical worst-case scenarios",
        typeA: 4,
        typeB: 6,
        weight: 2,
      },
      {
        id: '4v6_c',
        statementA: "I'm drawn to melancholy and find beauty in sadness",
        statementB: "I actively try to anticipate and prevent problems",
        typeA: 4,
        typeB: 6,
        weight: 3,
      },
    ],
  },
  
  // Type 7 (Enthusiast) vs Type 9 (Peacemaker) - Both avoid pain and stay positive
  {
    typePair: [7, 9],
    statements: [
      {
        id: '7v9_a',
        statementA: "I actively seek new experiences and stimulation",
        statementB: "I prefer familiar routines and comfortable habits",
        typeA: 7,
        typeB: 9,
        weight: 3,
      },
      {
        id: '7v9_b',
        statementA: "I have endless energy and enthusiasm for possibilities",
        statementB: "I'm generally low-energy and prefer a steady pace",
        typeA: 7,
        typeB: 9,
        weight: 3,
      },
      {
        id: '7v9_c',
        statementA: "I escape pain by staying busy and planning exciting things",
        statementB: "I escape pain by numbing out or distracting myself passively",
        typeA: 7,
        typeB: 9,
        weight: 2,
      },
    ],
  },
  
  // Type 1 (Reformer) vs Type 3 (Achiever) - Both competent and goal-oriented
  {
    typePair: [1, 3],
    statements: [
      {
        id: '1v3_a',
        statementA: "I measure success by whether I did the right thing",
        statementB: "I measure success by achievements and recognition",
        typeA: 1,
        typeB: 3,
        weight: 3,
      },
      {
        id: '1v3_b',
        statementA: "I'd rather be right than successful",
        statementB: "I'd rather be successful than perfectly right",
        typeA: 1,
        typeB: 3,
        weight: 3,
      },
      {
        id: '1v3_c',
        statementA: "Cutting corners feels fundamentally wrong to me",
        statementB: "I'll cut corners if it helps me reach my goals faster",
        typeA: 1,
        typeB: 3,
        weight: 2,
      },
    ],
  },
  
  // Type 2 (Helper) vs Type 4 (Individualist) - Both emotionally focused
  {
    typePair: [2, 4],
    statements: [
      {
        id: '2v4_a',
        statementA: "I focus on others' feelings and needs more than my own",
        statementB: "I focus on my own feelings and often feel misunderstood",
        typeA: 2,
        typeB: 4,
        weight: 3,
      },
      {
        id: '2v4_b',
        statementA: "I feel good when I make others happy",
        statementB: "I feel good when I express my authentic self",
        typeA: 2,
        typeB: 4,
        weight: 3,
      },
      {
        id: '2v4_c',
        statementA: "I move toward people to connect and help",
        statementB: "I often withdraw to process my emotions alone",
        typeA: 2,
        typeB: 4,
        weight: 2,
      },
    ],
  },
  
  // Type 5 (Investigator) vs Type 6 (Loyalist) - Both in the head center
  {
    typePair: [5, 6],
    statements: [
      {
        id: '5v6_a',
        statementA: "I feel most capable when I have enough knowledge",
        statementB: "I feel most capable when I have support and backup plans",
        typeA: 5,
        typeB: 6,
        weight: 3,
      },
      {
        id: '5v6_b',
        statementA: "I trust my own analysis above others' opinions",
        statementB: "I often doubt my own conclusions and seek validation",
        typeA: 5,
        typeB: 6,
        weight: 3,
      },
      {
        id: '5v6_c',
        statementA: "I prefer independence and minimal obligations",
        statementB: "I value belonging to groups and institutions I can rely on",
        typeA: 5,
        typeB: 6,
        weight: 2,
      },
    ],
  },
  
  // Type 7 (Enthusiast) vs Type 8 (Challenger) - Both assertive and action-oriented
  {
    typePair: [7, 8],
    statements: [
      {
        id: '7v8_a',
        statementA: "I pursue pleasure and want everyone to have fun",
        statementB: "I pursue power and want to protect my territory",
        typeA: 7,
        typeB: 8,
        weight: 3,
      },
      {
        id: '7v8_b',
        statementA: "I reframe negatives into positives to stay upbeat",
        statementB: "I confront negatives head-on and push through them",
        typeA: 7,
        typeB: 8,
        weight: 3,
      },
      {
        id: '7v8_c',
        statementA: "I avoid commitment because it limits my options",
        statementB: "I commit fully and expect the same intensity from others",
        typeA: 7,
        typeB: 8,
        weight: 2,
      },
    ],
  },
  
  // Type 4 (Individualist) vs Type 9 (Peacemaker) - Both withdrawn
  {
    typePair: [4, 9],
    statements: [
      {
        id: '4v9_a',
        statementA: "I have intense emotions and don't want to suppress them",
        statementB: "I often feel numb or have trouble identifying my emotions",
        typeA: 4,
        typeB: 9,
        weight: 3,
      },
      {
        id: '4v9_b',
        statementA: "I want to stand out and be seen as unique",
        statementB: "I prefer to blend in and not draw attention to myself",
        typeA: 4,
        typeB: 9,
        weight: 3,
      },
      {
        id: '4v9_c',
        statementA: "I dwell on what's missing or what I've lost",
        statementB: "I focus on what's comfortable and avoid dwelling on problems",
        typeA: 4,
        typeB: 9,
        weight: 2,
      },
    ],
  },
  
  // Type 1 (Reformer) vs Type 8 (Challenger) - Both strong-willed
  {
    typePair: [1, 8],
    statements: [
      {
        id: '1v8_a',
        statementA: "I control my anger because it's not appropriate to express it",
        statementB: "I express anger freely - it's natural and clears the air",
        typeA: 1,
        typeB: 8,
        weight: 3,
      },
      {
        id: '1v8_b',
        statementA: "I lead by example and moral authority",
        statementB: "I lead by taking charge and commanding respect",
        typeA: 1,
        typeB: 8,
        weight: 2,
      },
      {
        id: '1v8_c',
        statementA: "I criticize myself harshly for my imperfections",
        statementB: "I don't waste time on self-criticism - I move forward",
        typeA: 1,
        typeB: 8,
        weight: 3,
      },
    ],
  },
  
  // Type 3 (Achiever) vs Type 1 (Reformer) already covered above
  
  // Type 2 (Helper) vs Type 8 (Challenger) - Opposites but both assertive
  {
    typePair: [2, 8],
    statements: [
      {
        id: '2v8_a',
        statementA: "I influence others through warmth and generosity",
        statementB: "I influence others through strength and directness",
        typeA: 2,
        typeB: 8,
        weight: 3,
      },
      {
        id: '2v8_b',
        statementA: "I feel vulnerable and need to be needed",
        statementB: "I refuse to show vulnerability - it's weakness",
        typeA: 2,
        typeB: 8,
        weight: 3,
      },
      {
        id: '2v8_c',
        statementA: "I give to others hoping they'll love me back",
        statementB: "I take what I need and don't expect anything from others",
        typeA: 2,
        typeB: 8,
        weight: 2,
      },
    ],
  },
];

// Function to get contrastive statements for a given type pair
export function getContrastivesForTypePair(type1: number, type2: number): ContrastiveStatement[] {
  const pair = typePairContrastives.find(
    p => (p.typePair[0] === type1 && p.typePair[1] === type2) ||
         (p.typePair[0] === type2 && p.typePair[1] === type1)
  );
  return pair?.statements || [];
}

// Function to select the best 3 contrastive statements based on RHETI top types
export function selectQuickCheckStatements(
  rhetiPriors: Map<number, number> | Record<number, number>
): ContrastiveStatement[] {
  // Convert to array for sorting
  const priorsArray: [number, number][] = rhetiPriors instanceof Map 
    ? Array.from(rhetiPriors.entries())
    : Object.entries(rhetiPriors).map(([k, v]) => [parseInt(k), v]);
  
  // Sort by probability descending
  priorsArray.sort((a, b) => b[1] - a[1]);
  
  // Get top 3 types
  const topTypes = priorsArray.slice(0, 3).map(([type]) => type);
  
  // Collect all relevant contrastive statements
  const relevantStatements: ContrastiveStatement[] = [];
  
  // Get statements for pairs among top 3 types
  for (let i = 0; i < topTypes.length; i++) {
    for (let j = i + 1; j < topTypes.length; j++) {
      const statements = getContrastivesForTypePair(topTypes[i], topTypes[j]);
      relevantStatements.push(...statements);
    }
  }
  
  // Sort by weight (most discriminating first) and take top 3
  relevantStatements.sort((a, b) => b.weight - a.weight);
  
  // Return top 3 unique statements
  const selected: ContrastiveStatement[] = [];
  const usedPairs = new Set<string>();
  
  for (const statement of relevantStatements) {
    const pairKey = `${Math.min(statement.typeA, statement.typeB)}-${Math.max(statement.typeA, statement.typeB)}`;
    if (!usedPairs.has(pairKey)) {
      selected.push(statement);
      usedPairs.add(pairKey);
      if (selected.length >= 3) break;
    }
  }
  
  return selected;
}

// Calculate Quick Check results and update priors
export interface QuickCheckResult {
  updatedPriors: Map<number, number>;
  resolvedAmbiguity: boolean;
  topType: number;
  confidence: number;
}

export function processQuickCheckResponses(
  originalPriors: Map<number, number> | Record<number, number>,
  responses: Array<{ statementId: string; chosenType: number; confidence: number }>
): QuickCheckResult {
  // Clone priors
  const updatedPriors = new Map<number, number>();
  const priorsMap = originalPriors instanceof Map 
    ? originalPriors 
    : new Map(Object.entries(originalPriors).map(([k, v]) => [parseInt(k), v]));
  
  priorsMap.forEach((v, k) => updatedPriors.set(k, v));
  
  // Apply response weights to priors
  const QUICK_CHECK_WEIGHT = 0.15; // Each quick check response adds 15% weight
  
  for (const response of responses) {
    const currentValue = updatedPriors.get(response.chosenType) || 0;
    const boost = QUICK_CHECK_WEIGHT * (response.confidence / 100);
    updatedPriors.set(response.chosenType, currentValue + boost);
  }
  
  // Normalize priors
  const total = Array.from(updatedPriors.values()).reduce((a, b) => a + b, 0);
  updatedPriors.forEach((v, k) => updatedPriors.set(k, v / total));
  
  // Check if we've resolved ambiguity
  const sortedPriors = Array.from(updatedPriors.entries()).sort((a, b) => b[1] - a[1]);
  const topType = sortedPriors[0][0];
  const topConfidence = sortedPriors[0][1];
  const secondConfidence = sortedPriors[1]?.[1] || 0;
  
  // Resolved if top type has 2x the confidence of second
  const resolvedAmbiguity = topConfidence >= secondConfidence * 2 || topConfidence >= 0.5;
  
  return {
    updatedPriors,
    resolvedAmbiguity,
    topType,
    confidence: topConfidence,
  };
}

---

# 18. BUILDING BLOCKS SYSTEM

**Purpose:** Wing influence determination phase after core type identified

## Building Block Component
**Source:** `apps/web/src/components/inner-dna/BuildingBlock.tsx`

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BuildingBlockProps {
  block: {
    id: number;
    type: number;
    wing: string;
    name: string;
    description: string;
    gradient: string;
  };
  isSelected: boolean;
  onSelect: () => void;
}

const BuildingBlock = ({ block, isSelected, onSelect }: BuildingBlockProps) => {
  return (
    <motion.div
      className={`inner-dna-block-container ${isSelected ? 'selected' : ''}`}
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        borderColor: isSelected ? 'rgba(251, 191, 36, 0.6)' : 'rgba(255, 255, 255, 0.15)',
        background: isSelected ? 'rgba(251, 191, 36, 0.1)' : 'rgba(255, 255, 255, 0.08)'
      }}
    >
      <h3 className="inner-dna-block-label">{block.name}</h3>
      <p className="inner-dna-block-description">{block.description}</p>
      {isSelected && (
        <motion.div 
          className="inner-dna-selected-indicator"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          ✓ Selected
        </motion.div>
      )}
    </motion.div>
  );
};

export default BuildingBlock;

## Building Blocks Page Logic
**Source:** `apps/web/src/app/inner-dna/building-blocks/page.tsx`

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useInnerDNA, WingDiscoveryPhase } from '@/contexts/InnerDNAContext';
import { ContinueButton, BackButton } from '@/components/inner-dna';
import {
  calculateWingPriors,
  resolveWing,
  getWingContrastiveStatement,
  getWingCelebration,
  rhetiAnswersToTypeScores,
  WingPriorData,
  WingResult
} from '@/lib/inner-dna/wingDiscovery';
import '@/styles/inner-dna.css';

type UserChoice = 'wingA' | 'wingB' | 'balanced' | null;

export default function BuildingBlocksPage() {
  const router = useRouter();
  const { state, saveWingDiscovery, setPhase } = useInnerDNA();
  const [isReady, setIsReady] = useState(false);
  const [userChoice, setUserChoice] = useState<UserChoice>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationText, setCelebrationText] = useState('');
  const [displayOrder, setDisplayOrder] = useState<['wingA' | 'wingB', 'wingA' | 'wingB']>(['wingA', 'wingB']);
  
  const personalityType = state.personalityType || 1;
  
  // Calculate wing priors from existing data
  const wingPriorData = useMemo((): WingPriorData | null => {
    if (!state.personalityType) return null;
    
    // Get RHETI scores from localStorage
    let rhetiScores: number[] = Array(9).fill(0);
    try {
      const rhetiAnswers = localStorage.getItem('inner-dna-rheti-answers');
      if (rhetiAnswers) {
        const answers = JSON.parse(rhetiAnswers);
        rhetiScores = rhetiAnswersToTypeScores(answers);
      }
    } catch (error) {
      console.error('Error loading RHETI scores:', error);
    }
    
    // Get Hero Moments votes if available
    let heroMomentsVotes: number[] | undefined;
    try {
      const algorithmState = localStorage.getItem('inner-dna-algorithm-state');
      if (algorithmState) {
        const parsed = JSON.parse(algorithmState);
        if (parsed.voteTally) {
          heroMomentsVotes = parsed.voteTally;
        }
      }
    } catch (error) {
      console.error('Error loading Hero Moments votes:', error);
    }
    
    return calculateWingPriors(state.personalityType, rhetiScores, heroMomentsVotes);
  }, [state.personalityType]);
  
  // Get the contrastive statement for this type
  const contrastiveStatement = useMemo(() => {
    if (!state.personalityType) return null;
    return getWingContrastiveStatement(state.personalityType);
  }, [state.personalityType]);
  
  // Randomize display order on mount (to prevent positional bias)
  useEffect(() => {
    const randomOrder = Math.random() > 0.5 
      ? ['wingA', 'wingB'] as ['wingA' | 'wingB', 'wingA' | 'wingB']
      : ['wingB', 'wingA'] as ['wingA' | 'wingB', 'wingA' | 'wingB'];
    setDisplayOrder(randomOrder);
  }, []);

  useEffect(() => {
    if (!state.isHydrated) return;
    
    if (!state.heroMomentsComplete && !state.personalityType) {
      router.push('/inner-dna');
      return;
    }
    setIsReady(true);
  }, [state.isHydrated, state.heroMomentsComplete, state.personalityType, router]);

  const handleWingSelect = (choice: 'wingA' | 'wingB' | 'balanced') => {
    setUserChoice(choice);
    setCelebrationText(getWingCelebration(choice));
    setShowCelebration(true);
  };

  const handleContinue = () => {
    if (!userChoice || !wingPriorData) return;
    
    // Resolve the final wing
    const wingResult = resolveWing(wingPriorData, userChoice);
    
    // Create the wing discovery data
    const wingData: WingDiscoveryPhase = {
      completed: true,
      coreType: wingPriorData.coreType,
      wing: wingResult.wing,
      wingName: wingResult.wingName,
      fullName: wingResult.fullName,
      confidence: wingResult.confidence,
      userChoice: userChoice,
      priorData: {
        wingA: wingPriorData.wingA,
        wingB: wingPriorData.wingB,
        wingAPrior: wingPriorData.wingAPrior,
        wingBPrior: wingPriorData.wingBPrior,
        priorStrength: wingPriorData.priorStrength
      }
    };
    
    saveWingDiscovery(wingData);
    setPhase('colorStates');
    router.push('/inner-dna/color-phase');
  };

  const handleBack = () => {
    router.push('/inner-dna/assessment');
  };

  if (!isReady || !wingPriorData || !contrastiveStatement) {
    return (
      <div className="inner-dna-root">
        <div className="inner-dna-loading-screen">
          <div className="inner-dna-loading-content">
            <div className="inner-dna-loading-spinner" />
            <p className="inner-dna-loading-text">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Get the options in display order
  const getOptionForDisplay = (position: 'wingA' | 'wingB') => {
    if (position === 'wingA') {
      return {
        wing: wingPriorData.wingA,
        wingName: wingPriorData.wingAName,
        text: contrastiveStatement.optionA.wing === wingPriorData.wingA 
          ? contrastiveStatement.optionA.text 
          : contrastiveStatement.optionB.text
      };
    } else {
      return {
        wing: wingPriorData.wingB,
        wingName: wingPriorData.wingBName,
        text: contrastiveStatement.optionB.wing === wingPriorData.wingB 
          ? contrastiveStatement.optionB.text 
          : contrastiveStatement.optionA.text
      };
    }
  };
  
  const firstOption = getOptionForDisplay(displayOrder[0]);
  const secondOption = getOptionForDisplay(displayOrder[1]);

  return (
    <div className="inner-dna-root">
      <div className="inner-dna-building-blocks-screen">
        <div className="inner-dna-assessment-container" style={{ maxWidth: '900px' }}>
          <motion.div 
            className="inner-dna-phase-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="inner-dna-phase-title" style={{ fontSize: '1.75rem' }}>
              Your Unique Expression
            </h1>
            <p className="inner-dna-phase-subtitle" style={{ fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              You have a natural leaning toward one of two adjacent styles. 
              Which feels more true for you?
            </p>
          </motion.div>

          {/* Scenario Question */}
          <motion.div 
            className="inner-dna-glass-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ 
              padding: '24px 32px', 
              marginBottom: '24px',
              textAlign: 'center',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px'
            }}
          >
            <p style={{ 
              color: 'rgba(255, 255, 255, 0.9)', 
              fontSize: '1.2rem',
              fontWeight: 500,
              margin: 0
            }}>
              {contrastiveStatement.scenario}
            </p>
          </motion.div>

          {/* Two Wing Cards */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '20px',
            marginBottom: '20px'
          }}>
            {/* First Option */}
            <motion.button
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleWingSelect(displayOrder[0])}
              style={{
                background: userChoice === displayOrder[0]
                  ? 'linear-gradient(135deg, rgba(17, 183, 25, 0.3), rgba(17, 183, 25, 0.15))'
                  : 'rgba(255, 255, 255, 0.06)',
                border: userChoice === displayOrder[0]
                  ? '2px solid rgba(17, 183, 25, 0.6)'
                  : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '28px 24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'left'
              }}
            >
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '1rem',
                lineHeight: 1.6,
                margin: 0,
                flex: 1
              }}>
                "{firstOption.text}"
              </p>
              <div style={{ 
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: userChoice === displayOrder[0] 
                    ? '2px solid #11b719' 
                    : '2px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: userChoice === displayOrder[0] ? '#11b719' : 'transparent'
                }}>
                  {userChoice === displayOrder[0] && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  fontSize: '0.85rem' 
                }}>
                  This feels more true
                </span>
              </div>
            </motion.button>

            {/* Second Option */}
            <motion.button
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleWingSelect(displayOrder[1])}
              style={{
                background: userChoice === displayOrder[1]
                  ? 'linear-gradient(135deg, rgba(17, 183, 25, 0.3), rgba(17, 183, 25, 0.15))'
                  : 'rgba(255, 255, 255, 0.06)',
                border: userChoice === displayOrder[1]
                  ? '2px solid rgba(17, 183, 25, 0.6)'
                  : '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                padding: '28px 24px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '180px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'left'
              }}
            >
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.9)', 
                fontSize: '1rem',
                lineHeight: 1.6,
                margin: 0,
                flex: 1
              }}>
                "{secondOption.text}"
              </p>
              <div style={{ 
                marginTop: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: userChoice === displayOrder[1] 
                    ? '2px solid #11b719' 
                    : '2px solid rgba(255, 255, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: userChoice === displayOrder[1] ? '#11b719' : 'transparent'
                }}>
                  {userChoice === displayOrder[1] && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <span style={{ 
                  color: 'rgba(255, 255, 255, 0.5)', 
                  fontSize: '0.85rem' 
                }}>
                  This feels more true
                </span>
              </div>
            </motion.button>
          </div>

          {/* "Both feel equally true" option */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            onClick={() => handleWingSelect('balanced')}
            style={{
              width: '100%',
              background: userChoice === 'balanced'
                ? 'rgba(255, 255, 255, 0.12)'
                : 'transparent',
              border: userChoice === 'balanced'
                ? '1px solid rgba(255, 255, 255, 0.3)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '12px',
              padding: '14px 20px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              marginBottom: '24px'
            }}
          >
            <span style={{ 
              color: 'rgba(255, 255, 255, 0.6)', 
              fontSize: '0.95rem' 
            }}>
              Both feel equally true to me
            </span>
          </motion.button>

          {/* Micro-celebration */}
          <AnimatePresence>
            {showCelebration && celebrationText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  background: 'rgba(17, 183, 25, 0.15)',
                  border: '1px solid rgba(17, 183, 25, 0.3)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginBottom: '24px',
                  textAlign: 'center'
                }}
              >
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.9)', 
                  fontSize: '0.95rem',
                  margin: 0,
                  fontStyle: 'italic'
                }}>
                  {celebrationText}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="inner-dna-nav-buttons" style={{ justifyContent: 'space-between' }}>
            <BackButton onClick={handleBack} label="Back" />
            <ContinueButton 
              canProceed={userChoice !== null} 
              onContinue={handleContinue}
            >
              Continue
            </ContinueButton>
          </div>
        </div>
      </div>
    </div>
  );
}

---

# 19. SUBTYPE CALCULATION (Detail Tokens)

**Purpose:** Calculate instinctual subtype via token distribution (Self-Preservation, Sexual, Social)

## Stone Data (Subtype Definitions)
**Source:** `apps/web/src/lib/inner-dna/stoneData.ts`

import stateDescriptionsPart1 from './stateDescriptionsPart1';
import stateDescriptionsPart2 from './stateDescriptionsPart2';
import stateDescriptionsPart3 from './stateDescriptionsPart3';

export interface StoneSet {
  context: string;
  stones: {
    id: string;
    statements: string[];
    gradient: string;
  }[];
}

export const stoneSets: StoneSet[] = [
  {
    context: "When making decisions,",
    stones: [
      {
        id: 'A',
        statements: [
          "I think things through",
          "I analyze the options", 
          "I gather information first"
        ],
        gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
      },
      {
        id: 'B', 
        statements: [
          "I consider how people feel",
          "I think about relationships",
          "I focus on what matters emotionally"
        ],
        gradient: "linear-gradient(135deg, #10b981, #047857)"
      },
      {
        id: 'C',
        statements: [
          "I trust my gut",
          "I go with what feels right", 
          "I act on my instincts"
        ],
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
      }
    ]
  },
  {
    context: "What motivates me is",
    stones: [
      {
        id: 'A',
        statements: [
          "staying safe",
          "I need security and preparation",
          "I want to avoid danger"
        ],
        gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)"
      },
      {
        id: 'B',
        statements: [
          "being authentic", 
          "I need to express my true self",
          "I want to be special and meaningful"
        ],
        gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
      },
      {
        id: 'C',
        statements: [
          "doing what's right",
          "I need to be strong and in control",
          "I want justice and fairness"
        ],
        gradient: "linear-gradient(135deg, #06b6d4, #0891b2)"
      }
    ]
  },
  {
    context: "I direct my energy",
    stones: [
      {
        id: 'A',
        statements: [
          "inward",
          "I prefer reflection and depth",
          "I need quiet time to recharge"
        ],
        gradient: "linear-gradient(135deg, #6366f1, #4f46e5)"
      },
      {
        id: 'B',
        statements: [
          "outward",
          "I push for impact and results", 
          "I assert myself confidently"
        ],
        gradient: "linear-gradient(135deg, #f97316, #ea580c)"
      },
      {
        id: 'C',
        statements: [
          "toward cooperation",
          "I work well with others",
          "I support and maintain harmony"
        ],
        gradient: "linear-gradient(135deg, #84cc16, #65a30d)"
      }
    ]
  },
  {
    context: "In social situations, I",
    stones: [
      {
        id: 'A',
        statements: [
          "prefer smaller groups",
          "I need meaningful conversations",
          "I value independence and space"
        ],
        gradient: "linear-gradient(135deg, #64748b, #475569)"
      },
      {
        id: 'B',
        statements: [
          "seek close connections",
          "I want intimacy and bonding",
          "I build strong personal relationships"
        ],
        gradient: "linear-gradient(135deg, #ec4899, #db2777)"
      },
      {
        id: 'C',
        statements: [
          "maintain my autonomy",
          "I stay self-reliant",
          "I don't depend on others too much"
        ],
        gradient: "linear-gradient(135deg, #06b6d4, #0891b2)"
      }
    ]
  },
  {
    context: "I process information by",
    stones: [
      {
        id: 'A',
        statements: [
          "thinking",
          "I analyze systems and concepts", 
          "I focus on ideas and frameworks"
        ],
        gradient: "linear-gradient(135deg, #6366f1, #4f46e5)"
      },
      {
        id: 'B',
        statements: [
          "feeling",
          "I pay attention to emotions and moods",
          "I trust what resonates emotionally"
        ],
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
      },
      {
        id: 'C',
        statements: [
          "being practical",
          "I focus on what works",
          "I want efficient, useful results"
        ],
        gradient: "linear-gradient(135deg, #059669, #047857)"
      }
    ]
  },
  {
    context: "When stressed, I",
    stones: [
      {
        id: 'A',
        statements: [
          "become more cautious",
          "I analyze potential problems",
          "I prepare for what could go wrong"
        ],
        gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)"
      },
      {
        id: 'B',
        statements: [
          "focus on recognition",
          "I worry about my image and identity",
          "I need to feel special and valued"
        ],
        gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
      },
      {
        id: 'C',
        statements: [
          "take charge",
          "I assert my authority and control", 
          "I become more directive and demanding"
        ],
        gradient: "linear-gradient(135deg, #0ea5e9, #0284c7)"
      }
    ]
  },
  {
    context: "In conflict, I",
    stones: [
      {
        id: 'A',
        statements: [
          "seek peace and harmony",
          "I prefer mediation and compromise",
          "I try to calm things down"
        ],
        gradient: "linear-gradient(135deg, #22c55e, #16a34a)"
      },
      {
        id: 'B',
        statements: [
          "offer support and flexibility",
          "I adapt to help resolve things",
          "I try to meet everyone's needs"
        ],
        gradient: "linear-gradient(135deg, #84cc16, #65a30d)"
      },
      {
        id: 'C',
        statements: [
          "address issues directly",
          "I challenge when necessary",
          "I speak honestly and straightforwardly"
        ],
        gradient: "linear-gradient(135deg, #f97316, #ea580c)"
      }
    ]
  },
  {
    context: "I define success by",
    stones: [
      {
        id: 'A',
        statements: [
          "high standards",
          "I measure by principles and accuracy",
          "I focus on improvement and doing things right"
        ],
        gradient: "linear-gradient(135deg, #3b82f6, #2563eb)"
      },
      {
        id: 'B',
        statements: [
          "relationships",
          "I measure by connection and acknowledgment", 
          "I value appreciation from others"
        ],
        gradient: "linear-gradient(135deg, #10b981, #059669)"
      },
      {
        id: 'C',
        statements: [
          "mastery",
          "I measure by achievement and capability",
          "I value competence and expertise"
        ],
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
      }
    ]
  },
  {
    context: "In relationships, I prioritize",
    stones: [
      {
        id: 'A',
        statements: [
          "independence",
          "I need personal space and self-sufficiency",
          "I value my autonomy"
        ],
        gradient: "linear-gradient(135deg, #8b5cf6, #7c3aed)"
      },
      {
        id: 'B',
        statements: [
          "mutuality",
          "I want sharing and give-and-take",
          "I value reciprocity and balance"
        ],
        gradient: "linear-gradient(135deg, #ec4899, #db2777)"
      },
      {
        id: 'C',
        statements: [
          "leadership",
          "I naturally give direction and guidance",
          "I take responsibility for others"
        ],
        gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
      }
    ]
  }
];

// Wing Options Data - Exact from Section 5.2 of replit_innerdna_spec.md
export const buildingBlocks: Record<number, { id: number; type: number; wing: string; name: string; description: string; gradient: string; }[]> = {
  1: [
    {
      id: 0,
      type: 1,
      wing: '9',
      name: "Block A",
      description: "I stay calm in the face of tension and seek to maintain internal balance. I want clarity and order, but without pressure or chaos.",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    },
    {
      id: 1,
      type: 1,
      wing: '2',
      name: "Block B", 
      description: "I help others grow and improve by gently guiding them. I care about people's progress and feel responsible for their success.",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    }
  ],
  2: [
    {
      id: 0,
      type: 2,
      wing: '1',
      name: "Block A",
      description: "I serve others with conviction and structure. My care is purposeful, and I believe doing what's right is part of helping.", 
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    },
    {
      id: 1,
      type: 2,
      wing: '3',
      name: "Block B",
      description: "I lift people up by being both supportive and successful. I feel fulfilled when I'm appreciated and seen as capable.",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    }
  ],
  3: [
    {
      id: 0,
      type: 3,
      wing: '2',
      name: "Block A",
      description: "I feel most accomplished when I make others shine. My success is about lifting people up and proving I can deliver results for others.",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    },
    {
      id: 1,
      type: 3,
      wing: '4',
      name: "Block B", 
      description: "I feel most fulfilled when success reflects my deeper truth. It matters more that I express who I really am through what I achieve.",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    }
  ],
  4: [
    {
      id: 0,
      type: 4,
      wing: '3',
      name: "Block A",
      description: "I want to be noticed for my originality and impact. I enjoy being visible when it comes from something meaningful I've created.",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    },
    {
      id: 1,
      type: 4,
      wing: '5',
      name: "Block B",
      description: "I'm drawn to emotional depth and inner reflection. I want to understand myself, even if I stay behind the scenes.", 
      gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
    }
  ],
  5: [
    {
      id: 0,
      type: 5,
      wing: '4',
      name: "Block A",
      description: "I take in the world through quiet observation and emotional insight. My thinking is personal, reflective, and often creative.",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    },
    {
      id: 1,
      type: 5,
      wing: '6',
      name: "Block B",
      description: "I gather facts to make sense of things and stay prepared. I prefer clear systems, structure, and practical reasoning.",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    }
  ],
  6: [
    {
      id: 0,
      type: 6,
      wing: '5',
      name: "Block A",
      description: "I seek answers and stay prepared for what could go wrong. Knowing more makes me feel safer and more capable.",
      gradient: "linear-gradient(135deg, #3b82f6, #1d4ed8)"
    },
    {
      id: 1,
      type: 6,
      wing: '7',
      name: "Block B",
      description: "I lean into positivity and possibility. I stay light and hopeful, even when things are unclear.",
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    }
  ],
  7: [
    {
      id: 0,
      type: 7,
      wing: '6',
      name: "Block A",
      description: "I crave excitement, but I feel most alive when I also have some kind of security or plan to fall back on.",
      gradient: "linear-gradient(135deg, #10b981, #059669)"
    },
    {
      id: 1,
      type: 7,
      wing: '8',
      name: "Block B",
      description: "I don't wait — I dive into life with boldness and spontaneity. I want to experience everything without limits.",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
    }
  ],
  8: [
    {
      id: 0,
      type: 8,
      wing: '7',
      name: "Block A",
      description: "I lead with energy, bold moves, and confidence. I like to keep things moving and push through resistance.", 
      gradient: "linear-gradient(135deg, #f59e0b, #d97706)"
    },
    {
      id: 1,
      type: 8,
      wing: '9',
      name: "Block B",
      description: "I lead with quiet conviction and strength. I protect what matters without needing to dominate.",
      gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)"
    }
  ],
  9: [
    {
      id: 0,
      type: 9,
      wing: '1',
      name: "Block A",
      description: "I stay calm and grounded, but I don't hesitate to stand firm for what's right. Peace doesn't mean surrender.",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
    },
    {
      id: 1,
      type: 9,
      wing: '8',
      name: "Block B", 
      description: "I ease tension by being warm but firm. I aim to unify people, even when I need to assert myself clearly.",
      gradient: "linear-gradient(135deg, #ef4444, #dc2626)"
    }
  ]
};

// State description item type
interface StateDescriptionItem {
  state: string;
  title: string;
  color: string;
  description: string;
}

// Function to get detailed state descriptions for a specific type
export const getDetailedStateDescriptions = (type: number): StateDescriptionItem[] => {
  // Combine all state descriptions
  const allStateDescriptions: Record<string, {
    veryGood: { name: string; description: string };
    good: { name: string; description: string };
    average: { name: string; description: string };
    belowAverage: { name: string; description: string };
    destructive: { name: string; description: string };
  }> = {
    ...stateDescriptionsPart1,
    ...stateDescriptionsPart2,
    ...stateDescriptionsPart3
  };
  
  const typeDescriptions = allStateDescriptions[String(type)];
  if (!typeDescriptions) {
    // Fallback to Type 1 if type not found
    const type1Descriptions = allStateDescriptions['1'];
    return [
      { state: "veryGood", title: type1Descriptions.veryGood.name, color: "bg-green-600", description: type1Descriptions.veryGood.description },
      { state: "good", title: type1Descriptions.good.name, color: "bg-blue-600", description: type1Descriptions.good.description },
      { state: "average", title: type1Descriptions.average.name, color: "bg-yellow-500", description: type1Descriptions.average.description },
      { state: "belowAverage", title: type1Descriptions.belowAverage.name, color: "bg-orange-600", description: type1Descriptions.belowAverage.description },
      { state: "destructive", title: type1Descriptions.destructive.name, color: "bg-red-600", description: type1Descriptions.destructive.description }
    ];
  }
  
  // Convert the detailed descriptions to the format expected by the UI
  return [
    {
      state: "veryGood",
      title: typeDescriptions.veryGood.name,
      color: "bg-green-600",
      description: typeDescriptions.veryGood.description
    },
    {
      state: "good", 
      title: typeDescriptions.good.name,
      color: "bg-blue-600",
      description: typeDescriptions.good.description
    },
    {
      state: "average",
      title: typeDescriptions.average.name, 
      color: "bg-yellow-500",
      description: typeDescriptions.average.description
    },
    {
      state: "belowAverage",
      title: typeDescriptions.belowAverage.name,
      color: "bg-orange-600", 
      description: typeDescriptions.belowAverage.description
    },
    {
      state: "destructive",
      title: typeDescriptions.destructive.name,
      color: "bg-red-600",
      description: typeDescriptions.destructive.description
    }
  ];
};

// Fallback universal states for cases where type isn't determined
export const colorStates = [
  { state: "healthy", title: "Healthy State", color: "bg-green-500" },
  { state: "average", title: "Average State", color: "bg-yellow-500" },
  { state: "unhealthy", title: "Stress State", color: "bg-red-500" },
  { state: "calm", title: "Calm Energy", color: "bg-blue-500" },
  { state: "growth", title: "Growth Energy", color: "bg-green-600" }
];

export const detailTokens = {
  "Communication Style": [
    { token: "direct", label: "Direct", color: "bg-blue-100 text-blue-800" },
    { token: "supportive", label: "Supportive", color: "bg-green-100 text-green-800" },
    { token: "expressive", label: "Expressive", color: "bg-orange-100 text-orange-800" },
    { token: "analytical", label: "Analytical", color: "bg-purple-100 text-purple-800" }
  ],
  "Work Approach": [
    { token: "systematic", label: "Systematic", color: "bg-red-100 text-red-800" },
    { token: "collaborative", label: "Collaborative", color: "bg-blue-100 text-blue-800" },
    { token: "innovative", label: "Innovative", color: "bg-green-100 text-green-800" },
    { token: "independent", label: "Independent", color: "bg-yellow-100 text-yellow-800" }
  ],
  "Decision Making": [
    { token: "intuitive", label: "Intuitive", color: "bg-indigo-100 text-indigo-800" },
    { token: "logical", label: "Logical", color: "bg-pink-100 text-pink-800" },
    { token: "values-based", label: "Values-Based", color: "bg-teal-100 text-teal-800" },
    { token: "consensus", label: "Consensus", color: "bg-gray-100 text-gray-800" }
  ]
};

## Detail Tokens Page Logic
**Source:** `apps/web/src/app/inner-dna/detail-tokens/page.tsx`

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useInnerDNA } from '@/contexts/InnerDNAContext';
import { ContinueButton, BackButton } from '@/components/inner-dna';
import '@/styles/inner-dna.css';

interface TokenDistribution {
  self: number;
  oneToOne: number;
  social: number;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const
    }
  },
  exit: { opacity: 0, y: -20 }
};

// Token component for drag/drop (TechSpec style)
const Token = ({ 
  id, 
  onDragStart, 
  isInContainer = false,
  onRemove
}: { 
  id: string; 
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, id: string) => void;
  isInContainer?: boolean;
  onRemove?: () => void;
}) => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(e, id);
  };

  return (
    <motion.div
      draggable
      onDragStart={handleDragStart as any}
      onClick={onRemove}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      whileHover={{ 
        scale: 1.15, 
        boxShadow: '0 4px 20px rgba(251, 191, 36, 0.6)'
      }}
      whileTap={{ scale: 0.9 }}
      title={isInContainer ? "Click or drag to remove" : "Drag to a container"}
      style={{
        width: '36px',
        height: '36px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%)',
        cursor: isInContainer ? 'pointer' : 'grab',
        boxShadow: '0 4px 12px rgba(251, 191, 36, 0.5), inset 0 2px 4px rgba(255, 255, 255, 0.3)',
        border: '2px solid rgba(255, 255, 255, 0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.4)'
      }} />
    </motion.div>
  );
};

export default function DetailTokensPage() {
  const router = useRouter();
  const { state, saveDetailTokens, setPhase } = useInnerDNA();
  const [isReady, setIsReady] = useState(false);
  const [dragOverContainer, setDragOverContainer] = useState<string | null>(null);

  const [tokenDistribution, setTokenDistribution] = useState<TokenDistribution>({
    self: 0,
    oneToOne: 0,
    social: 0
  });

  const totalTokens = tokenDistribution.self + tokenDistribution.oneToOne + tokenDistribution.social;
  const remainingTokens = Math.max(0, 10 - totalTokens);
  const isComplete = totalTokens === 10;

  const personalityType = state.personalityType || 1;

  useEffect(() => {
    if (!state.isHydrated) return;
    
    if (!state.colorStates?.completed && !state.heroMomentsComplete) {
      router.push('/inner-dna');
      return;
    }
    
    setIsReady(true);
  }, [state.isHydrated, state.colorStates, state.heroMomentsComplete, router]);

  const handleTokenDrop = (containerId: string) => {
    if (remainingTokens > 0) {
      setTokenDistribution(prev => ({
        ...prev,
        [containerId]: prev[containerId as keyof TokenDistribution] + 1
      }));
    }
  };

  const handleContainerClick = (containerId: string) => {
    if (remainingTokens > 0) {
      handleTokenDrop(containerId);
    }
  };

  const handleTokenRemove = (containerId: string) => {
    const currentCount = tokenDistribution[containerId as keyof TokenDistribution];
    if (currentCount > 0) {
      setTokenDistribution(prev => ({
        ...prev,
        [containerId]: prev[containerId as keyof TokenDistribution] - 1
      }));
    }
  };

  const handleDragOver = (e: React.DragEvent, containerId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverContainer(containerId);
  };

  const handleDragLeave = () => {
    setDragOverContainer(null);
  };

  const handleDrop = (e: React.DragEvent, containerId: string) => {
    e.preventDefault();
    setDragOverContainer(null);
    const tokenId = e.dataTransfer.getData('text/plain');
    
    // Check if dragging from another container (starts with container prefix)
    if (tokenId.startsWith('container-')) {
      const sourceContainer = tokenId.split('-')[1];
      if (sourceContainer !== containerId) {
        // Move token from one container to another
        handleTokenRemove(sourceContainer);
        handleTokenDrop(containerId);
      }
    } else {
      // Dragging from available tokens
      handleTokenDrop(containerId);
    }
  };

  const handleContainerTokenDragStart = (e: React.DragEvent, containerId: string) => {
    e.dataTransfer.setData('text/plain', `container-${containerId}`);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleContinue = () => {
    const detailTokens = {
      selfPreservation: tokenDistribution.self,
      sexual: tokenDistribution.oneToOne,
      social: tokenDistribution.social
    };

    saveDetailTokens(detailTokens);
    setPhase('results');
    
    // Build query params for SENTINEL report page
    const type = state.personalityType || 8;
    
    // Build states from color phase data
    const primaryState = state.colorStates?.primaryState;
    const secondaryState = state.colorStates?.secondaryState;
    let statesParam = 'destructive:50,good:50'; // Default
    if (primaryState && secondaryState) {
      statesParam = `${primaryState.stateId}:${primaryState.intensity},${secondaryState.stateId}:${secondaryState.intensity}`;
    } else if (primaryState) {
      statesParam = `${primaryState.stateId}:${primaryState.intensity}`;
    }
    
    // Build subtypes from token distribution (ordered by count, highest first)
    const subtypeOrder = [
      { key: 'sp', count: tokenDistribution.self },
      { key: 'sx', count: tokenDistribution.oneToOne },
      { key: 'so', count: tokenDistribution.social }
    ].sort((a, b) => b.count - a.count);
    const subtypesParam = subtypeOrder.map(s => s.key).join(',');
    
    // Navigate to SENTINEL report page with general domain
    router.push(`/inner-dna/report/general?type=${type}&states=${encodeURIComponent(statesParam)}&subtypes=${subtypesParam}`);
  };

  const handleBack = () => {
    router.push('/inner-dna/color-phase');
  };

  const containers = [
    {
      id: 'self',
      title: 'Self-Preservation Focus',
      emoji: '🔒',
      subtypeKey: 'Self-Preservation',
      descriptions: ['Focus on security and stability', 'Physical comfort and safety', 'Material resources and health']
    },
    {
      id: 'oneToOne',
      title: 'One-to-One Focus',
      emoji: '🔥',
      subtypeKey: 'Sexual',
      descriptions: ['Focus on intensity and connection', 'Deep intimate bonds', 'Chemistry and attraction']
    },
    {
      id: 'social',
      title: 'Social Focus',
      emoji: '🧱',
      subtypeKey: 'Social',
      descriptions: ['Focus on community and belonging', 'Group dynamics and status', 'Contribution to others']
    }
  ];

  if (!isReady) {
    return (
      <div className="inner-dna-root">
        <div className="inner-dna-loading-screen">
          <div className="inner-dna-loading-content">
            <div className="inner-dna-loading-spinner" />
            <p className="inner-dna-loading-text">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="inner-dna-root"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="inner-dna-detail-tokens-screen">
        <div className="inner-dna-assessment-container" style={{ maxWidth: '1000px' }}>
          <div className="inner-dna-phase-header">
            <h1 className="inner-dna-phase-title">Distribute Your Energy</h1>
            <p className="inner-dna-phase-subtitle">
              Drag or click any container to place all 10 tokens across the three areas based on where you naturally focus your energy
            </p>
          </div>
          
          <div className="inner-dna-detail-content">
            <div className="inner-dna-glass-container" style={{ marginBottom: '24px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h3 style={{ color: '#fbbf24', fontSize: '1.25rem', fontWeight: '600' }}>Available Tokens</h3>
                <span style={{ 
                  color: remainingTokens === 0 ? '#22c55e' : 'rgba(255, 255, 255, 0.7)', 
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  {remainingTokens === 0 ? '✓ All placed!' : `${remainingTokens}/10 Remaining`}
                </span>
              </div>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px', 
                flexWrap: 'wrap',
                padding: '12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                minHeight: '60px'
              }}>
                <AnimatePresence>
                  {Array.from({ length: remainingTokens }).map((_, index) => (
                    <Token
                      key={`available-token-${index}`}
                      id={`available-${index}`}
                      isInContainer={false}
                    />
                  ))}
                </AnimatePresence>
                {remainingTokens === 0 && (
                  <p style={{ color: 'rgba(255, 255, 255, 0.5)', width: '100%', textAlign: 'center' }}>
                    All tokens have been distributed. Click tokens in containers to remove them.
                  </p>
                )}
              </div>
              <p style={{ 
                color: 'rgba(255, 255, 255, 0.5)', 
                fontSize: '13px', 
                marginTop: '12px',
                textAlign: 'center'
              }}>
                Drag tokens to containers below, or click containers to add tokens
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
              {containers.map((container) => {
                const isDragOver = dragOverContainer === container.id;
                const tokenCount = tokenDistribution[container.id as keyof TokenDistribution];
                
                return (
                  <motion.div 
                    key={container.id}
                    className="inner-dna-glass-container"
                    animate={{
                      scale: isDragOver ? 1.02 : 1,
                      borderColor: isDragOver 
                        ? '#fbbf24' 
                        : tokenCount > 0 
                          ? 'rgba(251, 191, 36, 0.6)' 
                          : 'rgba(255, 255, 255, 0.1)'
                    }}
                    style={{ 
                      padding: '20px', 
                      cursor: 'pointer',
                      border: '2px solid',
                      background: isDragOver 
                        ? 'rgba(251, 191, 36, 0.1)' 
                        : 'rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.3s ease'
                    }}
                    onClick={() => handleContainerClick(container.id)}
                    onDragOver={(e) => handleDragOver(e, container.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, container.id)}
                  >
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{ color: '#fbbf24', fontSize: '1.1rem', fontWeight: '600', marginBottom: '8px' }}>
                        {container.emoji} {container.title}
                      </h4>
                      <div style={{ marginBottom: '12px' }}>
                        {container.descriptions.map((description, index) => (
                          <p key={index} style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '13px', marginBottom: '4px' }}>
                            {description}
                          </p>
                        ))}
                      </div>
                      <div style={{ 
                        color: tokenCount > 0 ? '#fbbf24' : 'white', 
                        fontWeight: '600',
                        fontSize: '1.1rem'
                      }}>
                        Tokens: {tokenCount}
                      </div>
                    </div>
                    
                    {/* Tokens inside container - with AnimatePresence for smooth animations */}
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '8px', 
                      minHeight: '50px',
                      padding: '8px',
                      borderRadius: '8px',
                      background: tokenCount > 0 ? 'rgba(251, 191, 36, 0.05)' : 'transparent',
                      border: isDragOver ? '2px dashed #fbbf24' : '2px dashed transparent'
                    }}>
                      <AnimatePresence>
                        {Array.from({ length: tokenCount }).map((_, index) => (
                          <Token 
                            key={`${container.id}-token-${index}`}
                            id={`container-${container.id}`}
                            isInContainer={true}
                            onRemove={() => handleTokenRemove(container.id)}
                            onDragStart={(e) => handleContainerTokenDragStart(e, container.id)}
                          />
                        ))}
                      </AnimatePresence>
                      {tokenCount === 0 && (
                        <p style={{ 
                          color: 'rgba(255, 255, 255, 0.3)', 
                          fontSize: '12px', 
                          width: '100%', 
                          textAlign: 'center',
                          margin: 'auto'
                        }}>
                          {isDragOver ? 'Drop here!' : 'Drop tokens here or click to add'}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="inner-dna-glass-container" style={{ padding: '20px', marginBottom: '24px' }}>
              <h3 style={{ color: '#fbbf24', textAlign: 'center', marginBottom: '16px' }}>Your Tower</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{
                    width: '120px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ color: '#000', fontSize: '0.75rem', fontWeight: '600', textAlign: 'center' }}>
                    Subtypes<br />{totalTokens}/10
                  </span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  style={{
                    width: '140px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ color: '#000', fontSize: '0.75rem', fontWeight: '600', textAlign: 'center' }}>
                    States<br />Complete
                  </span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  style={{
                    width: '160px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ color: '#000', fontSize: '0.75rem', fontWeight: '600', textAlign: 'center' }}>
                    {state.buildingBlocks?.blockA?.name || 'Building Block'}<br />
                    {state.buildingBlocks?.blockA ? 'Complete' : 'Complete'}
                  </span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  style={{
                    width: '180px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #10b981, #047857)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ color: '#000', fontSize: '0.75rem', fontWeight: '600', textAlign: 'center' }}>
                    Type {personalityType}<br />Complete
                  </span>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: -0.1 }}
                  style={{
                    width: '200px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span style={{ color: '#000', fontSize: '0.75rem', fontWeight: '600', textAlign: 'center' }}>
                    Foundation<br />Complete
                  </span>
                </motion.div>
              </div>
            </div>

            <div className="inner-dna-nav-buttons" style={{ justifyContent: 'center', gap: '32px' }}>
              <motion.button
                onClick={handleBack}
                className="inner-dna-btn-secondary"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Back to Color Phase
              </motion.button>
              
              {isComplete && (
                <ContinueButton
                  canProceed={isComplete}
                  onContinue={handleContinue}
                >
                  Continue to Results
                </ContinueButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

---

# 20. STATE SELECTION (Color Phase)

**Purpose:** Select current states (5 per type) for personalized report generation

## State Components
**Source:** `apps/web/src/components/inner-dna/StateCard.tsx`

'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface StateCardProps {
  state: {
    name: string;
    color: string;
    description: string;
  };
  isSelected: boolean;
  onSelect: () => void;
  personalityType?: number;
}

const StateCard = ({ state, isSelected, onSelect }: StateCardProps) => {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      aria-label={`${state.name} - ${state.description}. ${isSelected ? 'Selected' : 'Click to select'}`}
      aria-pressed={isSelected}
      className={`inner-dna-state-card ${isSelected ? 'selected' : ''}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div 
        className="inner-dna-state-indicator"
        style={{ backgroundColor: state.color }}
      />
      <div className="inner-dna-state-content">
        <span className="inner-dna-state-name">{state.name}</span>
        <p className="inner-dna-state-description">{state.description}</p>
      </div>
      {isSelected && (
        <motion.div 
          className="inner-dna-state-check"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          ✓
        </motion.div>
      )}
    </motion.div>
  );
};

export default StateCard;

**Source:** `apps/web/src/components/inner-dna/StateSlider.tsx`

'use client';

import React from 'react';

interface StateSliderProps {
  value: number;
  onChange: (value: number) => void;
  colors: [string, string];
  stateNames: [string, string];
  label?: string;
}

const StateSlider = ({ value, onChange, colors, stateNames, label }: StateSliderProps) => (
  <div 
    className="inner-dna-slider-container"
    style={{
      '--slider-start': colors[0],
      '--slider-end': colors[1]
    } as React.CSSProperties}
  >
    <div className="inner-dna-slider-header">
      <span className="inner-dna-slider-label" style={{ color: colors[0] }}>
        {stateNames[0]}
      </span>
      <span className="text-white">{typeof label === 'string' ? label : String(label || '')}</span>
      <span className="inner-dna-slider-label" style={{ color: colors[1] }}>
        {stateNames[1]}
      </span>
    </div>
    
    <input
      type="range"
      min="0"
      max="100"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="inner-dna-slider"
      aria-label={`Distribution between ${stateNames[0]} and ${stateNames[1]}`}
      aria-valuetext={`${100 - value}% ${stateNames[0]}, ${value}% ${stateNames[1]}`}
    />
    
    <div className="inner-dna-percentage-display">
      <span className="inner-dna-percentage-value" style={{ color: colors[0], borderColor: colors[0] }}>
        {100 - value}%
      </span>
      <span className="inner-dna-percentage-value" style={{ color: colors[1], borderColor: colors[1] }}>
        {value}%
      </span>
    </div>
  </div>
);

export default StateSlider;

## Color Phase Page Logic
**Source:** `apps/web/src/app/inner-dna/color-phase/page.tsx`

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useInnerDNA } from '@/contexts/InnerDNAContext';
import { StateCard, StateSlider, ContinueButton, BackButton, TowerVisualization } from '@/components/inner-dna';
import { getDetailedStateDescriptions } from '@/lib/inner-dna/stoneData';
import '@/styles/inner-dna.css';

interface StateOption {
  state: string;
  title: string;
  color: string;
  description: string;
}

export default function ColorPhasePage() {
  const router = useRouter();
  const { state, saveColorStates, setPhase } = useInnerDNA();
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [stateOptions, setStateOptions] = useState<StateOption[]>([]);
  const [showSlider, setShowSlider] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!state.isHydrated) return;
    
    if (!state.buildingBlocks?.completed && !state.heroMomentsComplete) {
      router.push('/inner-dna');
      return;
    }

    const type = state.personalityType || 1;
    const descriptions = getDetailedStateDescriptions(type);
    setStateOptions(descriptions);
    setIsReady(true);
  }, [state.isHydrated, state.buildingBlocks, state.heroMomentsComplete, state.personalityType, router]);

  const handleStateSelect = (stateId: string) => {
    setSelectedStates(prev => {
      if (prev.includes(stateId)) {
        const newSelection = prev.filter(s => s !== stateId);
        if (newSelection.length < 2) {
          setShowSlider(false);
        }
        return newSelection;
      }
      if (prev.length >= 2) {
        return prev;
      }
      const newSelection = [...prev, stateId];
      if (newSelection.length === 2) {
        setShowSlider(true);
      }
      return newSelection;
    });
  };

  // TechSpec exact color values (from content_selection_logic_1752008149180.js)
  const stateColors: Record<string, string> = {
    veryGood: '#27ae60',    // TechSpec: deep green
    good: '#2ecc71',        // TechSpec: bright green (NOT blue!)
    average: '#f39c12',     // TechSpec: orange-gold
    belowAverage: '#e67e22', // TechSpec: orange
    destructive: '#e74c3c'  // TechSpec: red
  };

  const getSelectedStateDetails = () => {
    if (selectedStates.length < 2) return null;
    const primary = stateOptions.find(s => s.state === selectedStates[0]);
    const secondary = stateOptions.find(s => s.state === selectedStates[1]);
    return { primary, secondary };
  };

  const handleContinue = () => {
    const stateDetails = getSelectedStateDetails();
    if (selectedStates.length === 2 && stateDetails?.primary && stateDetails?.secondary) {
      const intensities: Record<string, number> = {
        [selectedStates[0]]: 100 - sliderValue,
        [selectedStates[1]]: sliderValue
      };
      
      saveColorStates(
        selectedStates,
        intensities,
        {
          stateId: selectedStates[0],
          stateName: stateDetails.primary.title,
          intensity: 100 - sliderValue,
          colorHex: stateColors[selectedStates[0]] || '#22c55e'
        },
        {
          stateId: selectedStates[1],
          stateName: stateDetails.secondary.title,
          intensity: sliderValue,
          colorHex: stateColors[selectedStates[1]] || '#ef4444'
        }
      );
      router.push('/inner-dna/detail-tokens');
    }
  };

  const handleBack = () => {
    router.push('/inner-dna/building-blocks');
  };

  const stateDetails = getSelectedStateDetails();

  if (!isReady) {
    return (
      <div className="inner-dna-root">
        <div className="inner-dna-loading-screen">
          <div className="inner-dna-loading-content">
            <div className="inner-dna-loading-spinner" />
            <p className="inner-dna-loading-text">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const personalityType = state.personalityType || 1;

  return (
    <div className="inner-dna-root">
      <div className="inner-dna-color-phase-screen">
        <div className="inner-dna-assessment-container" style={{ maxWidth: '1200px' }}>
          <motion.div 
            className="inner-dna-phase-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="inner-dna-phase-title">Color Phase</h1>
            <p className="inner-dna-phase-subtitle">
              Select two states that best describe your current life experience
            </p>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px', marginTop: '8px' }}>
              Selected: {selectedStates.length}/2
            </p>
          </motion.div>

          <div className="inner-dna-two-column-layout">
            <div className="inner-dna-selection-column">
              <div className="inner-dna-states-grid">
                {stateOptions.map((stateOption, index) => (
                  <motion.div
                    key={stateOption.state}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <StateCard
                      state={{
                        name: stateOption.title,
                        color: stateColors[stateOption.state] || '#6366f1',
                        description: stateOption.description
                      }}
                      isSelected={selectedStates.includes(stateOption.state)}
                      onSelect={() => handleStateSelect(stateOption.state)}
                      personalityType={personalityType}
                    />
                  </motion.div>
                ))}
              </div>

              {showSlider && stateDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  style={{ marginTop: '32px' }}
                >
                  <StateSlider
                    value={sliderValue}
                    onChange={setSliderValue}
                    colors={[
                      stateColors[selectedStates[0]] || '#22c55e',
                      stateColors[selectedStates[1]] || '#ef4444'
                    ]}
                    stateNames={[
                      stateDetails.primary?.title || 'Primary',
                      stateDetails.secondary?.title || 'Secondary'
                    ]}
                    label="Adjust your balance"
                  />
                </motion.div>
              )}

              <div className="inner-dna-nav-buttons" style={{ marginTop: '32px' }}>
                <BackButton onClick={handleBack} />
                <ContinueButton 
                  canProceed={selectedStates.length === 2} 
                  onContinue={handleContinue}
                >
                  Continue to Detail Tokens
                </ContinueButton>
              </div>
            </div>

            <div className="inner-dna-visualization-column">
              <TowerVisualization 
                title="Your State Distribution"
                selectedStates={selectedStates}
                distribution={{ primary: 100 - sliderValue, secondary: sliderValue }}
                stateOptions={stateOptions.map(s => ({
                  id: s.state,
                  name: s.title,
                  color: stateColors[s.state] || '#6366f1'
                }))}
              />

              {state.buildingBlocks?.blockA && (
                <div className="inner-dna-glass-container" style={{ marginTop: '1rem', padding: '1rem', textAlign: 'center' }}>
                  <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px', marginBottom: '8px' }}>
                    Selected Building Block
                  </p>
                  <p style={{ color: 'white', fontSize: '1.25rem', fontWeight: '600' }}>
                    {state.buildingBlocks.blockA.name}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

---

# 21. INNER DNA CONTEXT (Central State Management)

**Purpose:** React context managing entire assessment flow and data persistence

**Source:** `apps/web/src/contexts/InnerDNAContext.tsx`

'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect, useRef } from 'react';
import { 
  AdaptiveHeroMomentsAlgorithm, 
  createHeroMomentsAlgorithm,
  HeroMomentsAssessmentState
} from '@/lib/inner-dna/heroMomentsAlgorithm';
import { HeroMomentScenario, TYPE_NAMES, PersonalityType } from '@/lib/inner-dna/heroMomentsData';
import {
  AssessmentData,
  AssessmentPhase,
  HeroMomentsOutcome,
  BuildingBlocksPhase,
  ColorStatesPhase,
  DetailTokensPhase,
  QuickCheckPhase,
  InnerDNAUser,
  BuildingBlockData,
  ColorStateSelection,
  WingDiscoveryPhase
} from '@/lib/inner-dna/assessmentTypes';
import * as storage from '@/lib/inner-dna/assessmentStorage';

// Context State
interface InnerDNAState {
  phase: AssessmentPhase;
  user: InnerDNAUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isHydrated: boolean;
  
  // RHETI Phase
  rhetiAnswers: string[];
  rhetiPriors: Record<number, number>;
  rhetiTop3: number[];
  rhetiComplete: boolean;
  
  // Quick Check Phase
  quickCheck: QuickCheckPhase | null;
  
  // Hero Moments
  currentScenario: HeroMomentScenario | null;
  scenariosCompleted: number;
  estimatedRemaining: number;
  currentConfidence: number;
  leadingTypeName: string | null;
  heroMomentsComplete: boolean;
  
  // Results
  personalityType: PersonalityType | null;
  typeName: string | null;
  confidence: number;
  heroMomentsOutcome: HeroMomentsOutcome | null;
  
  // Building Blocks
  buildingBlocks: BuildingBlocksPhase | null;
  
  // Color States
  colorStates: ColorStatesPhase | null;
  
  // Detail Tokens
  detailTokens: DetailTokensPhase | null;
  
  // Complete assessment data
  assessmentData: AssessmentData | null;
}

interface SessionCheckResult {
  hasSession: boolean;
  isComplete: boolean;
  shouldNavigateTo: AssessmentPhase;
}

interface StartAssessmentResult {
  success: boolean;
  hasScenario: boolean;
}

interface InnerDNAContextType {
  state: InnerDNAState;
  algorithm: AdaptiveHeroMomentsAlgorithm | null;
  
  // Phase navigation
  setPhase: (phase: AssessmentPhase) => void;
  
  // Authentication
  startNewAssessment: (email: string, firstName: string, lastName: string) => Promise<StartAssessmentResult>;
  loginAndResume: (email: string) => Promise<SessionCheckResult>;
  checkExistingSession: () => SessionCheckResult;
  
  // RHETI
  setRhetiPriors: (answers: string[], priors: Record<number, number>, top3: number[]) => void;
  
  // Quick Check
  saveQuickCheckResults: (results: Omit<QuickCheckPhase, 'completed'>) => void;
  
  // Hero Moments
  answerQuestion: (optionId: string) => void;
  getCurrentScenario: () => HeroMomentScenario | null;
  
  // Building Blocks / Wing Discovery
  saveBuildingBlocks: (blockA: BuildingBlockData | null, blockB: BuildingBlockData | null) => void;
  saveWingDiscovery: (wingData: WingDiscoveryPhase) => void;
  
  // Color States  
  saveColorStates: (selectedStates: string[], intensities: Record<string, number>, primary?: ColorStateSelection, secondary?: ColorStateSelection) => void;
  
  // Detail Tokens
  saveDetailTokens: (containers: { selfPreservation: number; sexual: number; social: number }) => void;
  
  // Reset
  reset: () => void;
}

const initialState: InnerDNAState = {
  phase: 'welcome',
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  isHydrated: false,
  
  // RHETI
  rhetiAnswers: [],
  rhetiPriors: {},
  rhetiTop3: [],
  rhetiComplete: false,
  
  // Quick Check
  quickCheck: null,
  
  // Hero Moments
  currentScenario: null,
  scenariosCompleted: 0,
  estimatedRemaining: 10,
  currentConfidence: 0,
  leadingTypeName: null,
  heroMomentsComplete: false,
  
  personalityType: null,
  typeName: null,
  confidence: 0,
  heroMomentsOutcome: null,
  
  buildingBlocks: null,
  colorStates: null,
  detailTokens: null,
  assessmentData: null
};

const InnerDNAContext = createContext<InnerDNAContextType | undefined>(undefined);

export function InnerDNAProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<InnerDNAState>(initialState);
  const algorithmRef = useRef<AdaptiveHeroMomentsAlgorithm | null>(null);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const resumeInfo = storage.getResumeInfo();
    const algorithmState = storage.getAlgorithmState();
    const assessmentData = storage.getAssessmentData();
    
    if (resumeInfo.hasProgress && resumeInfo.user) {
      // Restore algorithm if we have saved state
      if (algorithmState && !assessmentData.heroMoments?.completed) {
        const algorithm = createHeroMomentsAlgorithm();
        algorithm.importData(algorithmState);
        algorithmRef.current = algorithm;
        
        const progress = algorithm.getProgress();
        const scenario = algorithm.getCurrentScenario();
        
        setState(prev => ({
          ...prev,
          user: resumeInfo.user,
          isAuthenticated: true,
          isHydrated: true,
          phase: resumeInfo.currentPhase,
          currentScenario: scenario,
          scenariosCompleted: progress.scenariosCompleted,
          estimatedRemaining: progress.estimatedRemaining,
          currentConfidence: progress.currentConfidence,
          leadingTypeName: progress.leadingTypeName,
          heroMomentsComplete: assessmentData.heroMoments?.completed || false,
          personalityType: assessmentData.personalityType || null,
          typeName: assessmentData.heroMoments?.data?.typeName || null,
          confidence: assessmentData.heroMoments?.data?.confidence || 0,
          heroMomentsOutcome: assessmentData.heroMoments || null,
          buildingBlocks: assessmentData.buildingBlocks || null,
          colorStates: assessmentData.colorStates || null,
          detailTokens: assessmentData.detailTokens || null,
          assessmentData
        }));
      } else {
        // Restore from assessment data only
        setState(prev => ({
          ...prev,
          user: resumeInfo.user,
          isAuthenticated: true,
          isHydrated: true,
          phase: resumeInfo.currentPhase,
          heroMomentsComplete: assessmentData.heroMoments?.completed || false,
          personalityType: assessmentData.personalityType || null,
          typeName: assessmentData.heroMoments?.data?.typeName || null,
          confidence: assessmentData.heroMoments?.data?.confidence || 0,
          heroMomentsOutcome: assessmentData.heroMoments || null,
          buildingBlocks: assessmentData.buildingBlocks || null,
          colorStates: assessmentData.colorStates || null,
          detailTokens: assessmentData.detailTokens || null,
          assessmentData
        }));
      }
    } else {
      setState(prev => ({ ...prev, isHydrated: true }));
    }
  }, []);

  const setPhase = useCallback((phase: AssessmentPhase) => {
    setState(prev => ({ ...prev, phase }));
    storage.setCurrentPhase(phase);
  }, []);

  const checkExistingSession = useCallback((): SessionCheckResult => {
    const resumeInfo = storage.getResumeInfo();
    
    if (!resumeInfo.hasProgress || !resumeInfo.user) {
      return { hasSession: false, isComplete: false, shouldNavigateTo: 'welcome' };
    }
    
    const assessmentData = storage.getAssessmentData();
    
    // Check completion status
    if (assessmentData.completedAt) {
      return { hasSession: true, isComplete: true, shouldNavigateTo: 'results' };
    }
    
    // Return the appropriate phase to resume
    return { 
      hasSession: true, 
      isComplete: false, 
      shouldNavigateTo: resumeInfo.currentPhase 
    };
  }, []);

  const loginAndResume = useCallback(async (email: string): Promise<SessionCheckResult> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // Check local storage for existing session with this email
    const user = storage.getUser();
    
    if (user && user.email.toLowerCase() === email.toLowerCase()) {
      const result = checkExistingSession();
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        user,
        isAuthenticated: true
      }));
      
      return result;
    }
    
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: 'No assessment found for this email. Please start a new assessment.'
    }));
    
    return { hasSession: false, isComplete: false, shouldNavigateTo: 'welcome' };
  }, [checkExistingSession]);

  const startNewAssessment = useCallback(async (
    email: string, 
    firstName: string, 
    lastName: string
  ): Promise<StartAssessmentResult> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    // Clear any existing session
    storage.clearSession();
    
    // Also clear RHETI data
    try {
      localStorage.removeItem('inner-dna-rheti-answers');
      localStorage.removeItem('inner-dna-rheti-priors');
      localStorage.removeItem('inner-dna-rheti-top3');
    } catch (error) {
      console.error('Error clearing RHETI data:', error);
    }
    
    // Create new user
    const user: InnerDNAUser = {
      id: Date.now(), // Local ID
      email,
      firstName,
      lastName,
      createdAt: new Date().toISOString()
    };
    
    storage.setUser(user);
    
    // Don't create Hero Moments algorithm yet - that happens after RHETI
    // Navigate to RHETI phase first (TWO-STAGE ASSESSMENT)
    storage.setCurrentPhase('rheti');
    
    setState(prev => ({
      ...prev,
      isLoading: false,
      user,
      isAuthenticated: true,
      phase: 'rheti',
      rhetiAnswers: [],
      rhetiPriors: [],
      rhetiTop3: [],
      rhetiComplete: false,
      error: null
    }));
    
    return { success: true, hasScenario: true };
  }, []);

  const answerQuestion = useCallback((optionId: string) => {
    const algorithm = algorithmRef.current;
    if (!algorithm || !state.currentScenario) return;
    
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // Record the response
      const responseTime = 5000; // Default response time
      algorithm.recordResponse(state.currentScenario.id, optionId, responseTime);
      
      // Check if complete
      if (algorithm.isComplete()) {
        const results = algorithm.getFinalResults();
        
        // Create hero moments outcome
        const heroMomentsOutcome: HeroMomentsOutcome = {
          completed: true,
          data: {
            personalityType: results.personalityType as PersonalityType,
            typeName: results.personalityTypeName || '',
            confidence: results.confidence,
            scenariosCompleted: results.scenariosCompleted,
            timeToComplete: results.timeToComplete,
            allTypeConfidences: results.allTypeConfidences,
            wasAdaptivePhaseUsed: results.wasAdaptivePhaseUsed,
            adaptiveScenariosUsed: results.adaptiveScenariosUsed,
            completedAt: new Date().toISOString(),
            version: results.assessmentMetadata.version
          }
        };
        
        // Save to storage
        storage.saveHeroMomentsOutcome(heroMomentsOutcome);
        storage.saveAlgorithmState(algorithm.exportData());
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          heroMomentsComplete: true,
          currentScenario: null,
          personalityType: results.personalityType as PersonalityType,
          typeName: results.personalityTypeName,
          confidence: results.confidence,
          heroMomentsOutcome,
          phase: 'buildingBlocks'
        }));
      } else {
        // Get next scenario
        const nextScenario = algorithm.getCurrentScenario();
        const progress = algorithm.getProgress();
        
        // Save algorithm state for resume
        storage.saveAlgorithmState(algorithm.exportData());
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          currentScenario: nextScenario,
          scenariosCompleted: progress.scenariosCompleted,
          estimatedRemaining: progress.estimatedRemaining,
          currentConfidence: progress.currentConfidence,
          leadingTypeName: progress.leadingTypeName
        }));
      }
    } catch (error) {
      console.error('Error answering question:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to record response'
      }));
    }
  }, [state.currentScenario]);

  const getCurrentScenario = useCallback((): HeroMomentScenario | null => {
    return state.currentScenario;
  }, [state.currentScenario]);

  const saveQuickCheckResults = useCallback((
    results: Omit<QuickCheckPhase, 'completed'>
  ) => {
    const quickCheck: QuickCheckPhase = {
      completed: true,
      ...results
    };
    
    try {
      localStorage.setItem('inner-dna-quick-check', JSON.stringify(quickCheck));
      
      // Update RHETI priors with Quick Check results
      localStorage.setItem('inner-dna-rheti-priors', JSON.stringify(results.updatedPriors));
    } catch (error) {
      console.error('Error saving Quick Check data:', error);
    }
    
    // Create or update Hero Moments algorithm with updated priors
    const updatedPriorsArray = Object.entries(results.updatedPriors)
      .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
      .map(([, value]) => value);
    
    const top3 = Object.entries(results.updatedPriors)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([type]) => parseInt(type));
    
    const algorithm = createHeroMomentsAlgorithm({ enableDetailedLogging: false });
    algorithm.setRhetiPriors(updatedPriorsArray, top3);
    algorithmRef.current = algorithm;
    
    const firstScenario = algorithm.getCurrentScenario();
    
    setState(prev => ({
      ...prev,
      quickCheck,
      rhetiPriors: results.updatedPriors,
      currentScenario: firstScenario,
      phase: 'heroMoments'
    }));
  }, []);

  const saveBuildingBlocks = useCallback((
    blockA: BuildingBlockData | null, 
    blockB: BuildingBlockData | null
  ) => {
    const buildingBlocks: BuildingBlocksPhase = {
      completed: true,
      blockA,
      blockB
    };
    
    storage.saveBuildingBlocks(buildingBlocks);
    
    setState(prev => ({
      ...prev,
      buildingBlocks,
      phase: 'colorStates'
    }));
  }, []);

  const saveWingDiscovery = useCallback((wingData: WingDiscoveryPhase) => {
    const buildingBlocks: BuildingBlocksPhase = {
      completed: true,
      blockA: null,
      blockB: null,
      wingDiscovery: wingData
    };
    
    storage.saveBuildingBlocks(buildingBlocks);
    
    // Also save wing data separately for easy access
    try {
      localStorage.setItem('inner-dna-wing-discovery', JSON.stringify(wingData));
    } catch (error) {
      console.error('Error saving wing discovery data:', error);
    }
    
    setState(prev => ({
      ...prev,
      buildingBlocks,
      phase: 'colorStates'
    }));
  }, []);

  const saveColorStates = useCallback((
    selectedStates: string[],
    intensities: Record<string, number>,
    primary?: ColorStateSelection,
    secondary?: ColorStateSelection
  ) => {
    const colorStates: ColorStatesPhase = {
      completed: true,
      selectedStates,
      stateIntensities: intensities,
      distribution: {},
      primaryState: primary,
      secondaryState: secondary
    };
    
    storage.saveColorStates(colorStates);
    
    setState(prev => ({
      ...prev,
      colorStates,
      phase: 'detailTokens'
    }));
  }, []);

  const saveDetailTokens = useCallback((
    containers: { selfPreservation: number; sexual: number; social: number }
  ) => {
    // Determine dominant subtype
    const max = Math.max(containers.selfPreservation, containers.sexual, containers.social);
    let dominantSubtype: 'selfPreservation' | 'sexual' | 'social' = 'selfPreservation';
    if (containers.sexual === max) dominantSubtype = 'sexual';
    if (containers.social === max) dominantSubtype = 'social';
    
    // Calculate stack order
    const sortedTypes = [
      { type: 'selfPreservation' as const, value: containers.selfPreservation },
      { type: 'sexual' as const, value: containers.sexual },
      { type: 'social' as const, value: containers.social }
    ].sort((a, b) => b.value - a.value);
    
    const detailTokens: DetailTokensPhase = {
      completed: true,
      containers,
      dominantSubtype,
      stackOrder: sortedTypes.map(s => s.type)
    };
    
    storage.saveDetailTokens(detailTokens);
    
    setState(prev => ({
      ...prev,
      detailTokens,
      phase: 'results'
    }));
  }, []);

  const setRhetiPriors = useCallback((
    answers: string[],
    priors: Record<number, number>,
    top3: number[]
  ) => {
    // Save RHETI results to localStorage
    try {
      localStorage.setItem('inner-dna-rheti-answers', JSON.stringify(answers));
      localStorage.setItem('inner-dna-rheti-priors', JSON.stringify(priors));
      localStorage.setItem('inner-dna-rheti-top3', JSON.stringify(top3));
    } catch (error) {
      console.error('Error saving RHETI data:', error);
    }
    
    // Navigate to Quick Check phase (algorithm will be initialized after Quick Check)
    storage.setCurrentPhase('quickCheck');
    
    // Update state - go to Quick Check first
    setState(prev => ({
      ...prev,
      rhetiAnswers: answers,
      rhetiPriors: priors,
      rhetiTop3: top3,
      rhetiComplete: true,
      phase: 'quickCheck'
    }));
    
    console.log('🎯 RHETI completed, navigating to Quick Check with priors:', {
      top3,
      priors: Object.entries(priors).map(([t, p]) => `T${t}: ${(p*100).toFixed(1)}%`).join(', ')
    });
  }, []);

  const reset = useCallback(() => {
    storage.clearSession();
    algorithmRef.current = null;
    // Also clear RHETI and Quick Check data
    try {
      localStorage.removeItem('inner-dna-rheti-answers');
      localStorage.removeItem('inner-dna-rheti-priors');
      localStorage.removeItem('inner-dna-rheti-top3');
      localStorage.removeItem('inner-dna-quick-check');
    } catch (error) {
      console.error('Error clearing assessment data:', error);
    }
    setState({ ...initialState, isHydrated: true });
  }, []);

  return (
    <InnerDNAContext.Provider value={{ 
      state,
      algorithm: algorithmRef.current,
      setPhase,
      startNewAssessment,
      loginAndResume,
      checkExistingSession,
      setRhetiPriors,
      saveQuickCheckResults,
      answerQuestion,
      getCurrentScenario,
      saveBuildingBlocks,
      saveWingDiscovery,
      saveColorStates,
      saveDetailTokens,
      reset
    }}>
      {children}
    </InnerDNAContext.Provider>
  );
}

export function useInnerDNA() {
  const context = useContext(InnerDNAContext);
  if (context === undefined) {
    throw new Error('useInnerDNA must be used within an InnerDNAProvider');
  }
  return context;
}

// Re-export types for convenience
export type { 
  AssessmentPhase, 
  BuildingBlockData, 
  ColorStateSelection,
  HeroMomentsOutcome,
  InnerDNAUser,
  WingDiscoveryPhase
};
