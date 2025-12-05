# TWO-SYSTEM ARCHITECTURE ADDITION
## Master Plan Update - Coach Training Hub & Client Hub

**Document:** Addition to PROJECT_MASTER_PLAN.md and PROJECT_MASTER_PLAN_PART2.md  
**Date:** December 5, 2025  
**Purpose:** Define the separation between Coach Training and Client delivery systems

---

## 🎯 EXECUTIVE SUMMARY

The IYCT platform consists of **TWO DISTINCT SYSTEMS** that share common infrastructure but serve different purposes:

| Aspect | Coach Training Hub | Client Hub |
|--------|-------------------|------------|
| **Users** | People becoming coaches | Clients of certified coaches |
| **Duration** | 5 weeks | 10 weeks |
| **Purpose** | Learn to deliver the program | Experience the transformation |
| **Content** | Fixed (methodology training) | Niche-adaptable |
| **Features** | Treasures, Marketing Hub, Certification | Bonuses, Coach Dashboard |
| **Programs** | 32 training programs | 1 template × infinite niches |

---

## 📐 SYSTEM 1: COACH TRAINING HUB

### 1.1 Purpose
Train individuals to become certified Incredible You coaches who can then deliver the 10-week client program.

### 1.2 Program Structure

```
Coach Training (5 Weeks)
├── Week 1: Foundation
│   ├── Step 1: Welcome Video (Vimeo)
│   ├── Step 2: Program Overview (Text)
│   ├── Step 3: Inner DNA Introduction (Video)
│   └── Step 4: Assignment - Personal Assessment
├── Week 2: The Tools
│   ├── Step 1: Wheel of Life Training (Video)
│   ├── Step 2: Practice - Wheel of Life (Tool)
│   ├── Step 3: Baselines Training (Video)
│   └── Step 4: Practice - Baselines (Tool)
├── Week 3: The Methodology
│   ├── Step 1: N-codes & E-codes (Video)
│   ├── Step 2: Practice - N-codes (Tool)
│   ├── Step 3: Outcomes & INCRED (Video)
│   └── Step 4: Practice - Outcomes (Tool)
├── Week 4: Delivery Skills
│   ├── Step 1: Coaching Techniques (Video)
│   ├── Step 2: Role Play Exercise (Assignment)
│   ├── Step 3: Marketing Your Practice (Video)
│   └── Step 4: Marketing Hub Setup (Tool)
└── Week 5: Certification
    ├── Step 1: Review & Preparation (Video)
    ├── Step 2: Certification Requirements (Text)
    ├── Step 3: Submit Certification Video (Assignment)
    └── Step 4: Next Steps (Text)
```

### 1.3 Features

#### Treasures
Downloadable resources for coaches:
- Training manuals (PDF)
- Client scripts (PDF)
- Marketing templates (PDF)
- Audio recordings
- Ebooks

```typescript
interface Treasure {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'audio' | 'ebook' | 'video';
  fileUrl: string;
  accessRule: 'all_enrolled' | 'week_complete' | 'certified_only';
  downloadCount: number;
}
```

#### Practice Tools
Coaches learn by using the same tools their clients will use:
- Wheel of Life
- Baselines
- N-codes & E-codes
- Define My Outcomes
- Decision Making Wheel

#### Marketing Hub
Help coaches build their business:
- Personal share link generation
- Referral tracking
- Commission system
- Share limits management
- Analytics dashboard

```typescript
interface MarketingHub {
  userId: string;
  shareLink: string;
  totalShares: number;
  sharesUsed: number;
  referrals: Referral[];
  commissionsEarned: number;
  commissionsPaid: number;
}
```

#### Certification System
Requirements to become a certified coach:
1. Complete all 5 weeks
2. Complete all practice tools
3. Submit certification video (5-15 minutes)
4. Pass admin review
5. Receive certificate

```typescript
interface Certification {
  userId: string;
  videoUrl: string;
  videoDuration: number;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  reviewedBy: string;
  reviewNotes: string;
  certificateUrl: string;
  certificateNumber: string;
}
```

#### Batch System
Cohort-based learning with scheduled unlocks:

```typescript
interface Batch {
  id: string;
  name: string;
  startDate: Date;
  programId: string;
  maxCapacity: number;
  currentEnrollment: number;
  weekUnlockSchedule: {
    week: number;
    unlockDate: Date;
  }[];
}
```

### 1.4 Programs Available
All 32 programs in the admin panel are coach training programs:
- Different levels (Foundation, Full, Advanced)
- Different languages (English, Hindi)
- Different specializations (Mind Hacker, Speak to Fortune, etc.)

---

## 📐 SYSTEM 2: CLIENT HUB

### 2.1 Purpose
The actual 10-week transformation program delivered by certified coaches to their clients. Designed to be **niche-agnostic** so coaches can serve any market.

### 2.2 Program Structure

```
Client Program (10 Weeks)
├── Week 1: Discovery
│   ├── Step 1: Welcome (Video)
│   ├── Step 2: Inner DNA Test (Tool - External)
│   ├── Step 3: Personality Results (AI-Generated)
│   └── Step 4: Reflection Assignment
├── Week 2: Awareness
│   ├── Step 1: The Speech (AI Tool)
│   ├── Step 2: Wheel of Life (Tool)
│   ├── Step 3: Insights Review (AI-Generated)
│   └── Step 4: Coaching Call Prep
├── Week 3: Foundation
│   ├── Step 1: Baselines Introduction (Video)
│   ├── Step 2: Select Your Baselines (Tool)
│   ├── Step 3: Baseline Vision (AI-Generated)
│   └── Step 4: Expression Rating
├── Week 4: Limiting Beliefs
│   ├── Step 1: N-codes Explained (Video)
│   ├── Step 2: Identify Your N-codes (Tool)
│   ├── Step 3: Transform to E-codes (AI)
│   └── Step 4: 5-Year Predictions (AI)
├── Week 5: Outcomes
│   ├── Step 1: Defining Outcomes (Video)
│   ├── Step 2: My Top 3 Outcomes (Tool)
│   ├── Step 3: INCRED Breakdown (AI)
│   └── Step 4: Action Planning
├── Week 6: Challenges
│   ├── Step 1: Anticipating Obstacles (Video)
│   ├── Step 2: Challenges & Power Leaps (AI Tool)
│   ├── Step 3: Solution Strategies
│   └── Step 4: Commitment Exercise
├── Week 7: Momentum
│   ├── Step 1: Building Buzz (Video)
│   ├── Step 2: Buzz Moments (AI Tool)
│   ├── Step 3: Celebration Planning
│   └── Step 4: Progress Check-in
├── Week 8: Support
│   ├── Step 1: Mastermind Concept (Video)
│   ├── Step 2: Find Your Mastermind (AI Tool)
│   ├── Step 3: Community Connection
│   └── Step 4: Accountability Setup
├── Week 9: Integration
│   ├── Step 1: Putting It Together (Video)
│   ├── Step 2: Full Review
│   ├── Step 3: Refinement
│   └── Step 4: Coach Feedback
└── Week 10: Completion
    ├── Step 1: Celebration (Video)
    ├── Step 2: Before/After Comparison
    ├── Step 3: Testimonial (Optional)
    └── Step 4: Next Steps
```

### 2.3 Niche-Agnostic Design

#### What Stays The Same (Fixed)
- Video content (methodology explanation)
- Week structure (10 weeks, ~4 steps each)
- Core tools (Wheel of Life, Baselines, N-codes, etc.)
- AI integration points
- Progress tracking system

#### What Changes Per Niche (Variable)

```typescript
interface NicheConfiguration {
  nicheId: string;
  nicheName: string;
  nicheDescription: string;
  
  // Tool customizations
  wheelOfLifeLabels: {
    health: string;        // "Physical Health" or "Fitness Level"
    career: string;        // "Career" or "Business Revenue"
    wealth: string;        // "Finances" or "Income Streams"
    relationships: string; // "Relationships" or "Client Relationships"
    // ... etc
  };
  
  // AI context
  aiContextKeywords: string[];  // ["health", "fitness", "wellness"]
  aiPromptPrefix: string;       // "As a health and fitness coach..."
  
  // Examples
  outcomeExamples: string[];    // ["Lose 20 pounds", "Run a marathon"]
  ncodeExamples: string[];      // ["I'm too old to get fit"]
  buzzMomentExamples: string[]; // ["Complete first 5K run"]
  
  // Optional content
  nicheSpecificBonuses: Bonus[];
}
```

#### Predefined Niches

```typescript
const NICHES: NicheConfiguration[] = [
  {
    nicheId: 'personal_development',
    nicheName: 'Personal Development',
    nicheDescription: 'General life coaching and personal growth',
    wheelOfLifeLabels: {
      health: 'Health',
      career: 'Career',
      wealth: 'Wealth',
      relationships: 'Relationships',
      friendsFamily: 'Friends & Family',
      funRecreation: 'Fun & Recreation',
      learningGrowth: 'Learning & Growth',
      possessions: 'Possessions'
    },
    aiContextKeywords: ['personal growth', 'self-improvement', 'life goals'],
    outcomeExamples: ['Find my life purpose', 'Improve work-life balance'],
    // ...
  },
  {
    nicheId: 'health_fitness',
    nicheName: 'Health & Fitness',
    nicheDescription: 'Physical health, fitness, and wellness coaching',
    wheelOfLifeLabels: {
      health: 'Physical Fitness',
      career: 'Fitness Career/Goals',
      wealth: 'Energy & Vitality',
      relationships: 'Workout Partners',
      // ...
    },
    aiContextKeywords: ['health', 'fitness', 'wellness', 'nutrition', 'exercise'],
    outcomeExamples: ['Lose 30 pounds', 'Run a marathon', 'Build muscle'],
    // ...
  },
  {
    nicheId: 'business_wealth',
    nicheName: 'Business & Wealth',
    nicheDescription: 'Entrepreneurship, business growth, and financial success',
    wheelOfLifeLabels: {
      health: 'Work-Life Balance',
      career: 'Business Growth',
      wealth: 'Revenue & Profit',
      relationships: 'Business Partnerships',
      // ...
    },
    aiContextKeywords: ['business', 'entrepreneurship', 'revenue', 'profit', 'success'],
    outcomeExamples: ['Reach $1M revenue', 'Hire first employee', 'Launch new product'],
    // ...
  },
  {
    nicheId: 'relationships',
    nicheName: 'Relationships',
    nicheDescription: 'Dating, marriage, and relationship coaching',
    wheelOfLifeLabels: {
      health: 'Emotional Health',
      career: 'Life Goals Together',
      wealth: 'Shared Finances',
      relationships: 'Primary Relationship',
      // ...
    },
    aiContextKeywords: ['relationship', 'love', 'connection', 'communication', 'intimacy'],
    outcomeExamples: ['Find life partner', 'Improve communication', 'Rekindle romance'],
    // ...
  }
];
```

### 2.4 Features

#### Bonuses
Unlockable content for clients (different from coach Treasures):

```typescript
interface Bonus {
  id: string;
  title: string;
  description: string;
  fileType: 'pdf' | 'video' | 'audio' | 'ebook';
  fileUrl: string;
  unlockTrigger: 'enrollment' | 'week_3_complete' | 'week_5_complete' | 'program_complete';
  nicheSpecific: boolean;
  nicheId?: string;
}
```

#### Coach-Client Relationship

```typescript
interface CoachClientRelationship {
  coachId: string;
  clientId: string;
  programId: string;
  nicheId: string;
  enrolledAt: Date;
  
  // Coach visibility
  coachCanView: {
    progressPercentage: boolean;
    completedSteps: boolean;
    toolResults: boolean;
    assignmentSubmissions: boolean;
  };
  
  // Coach actions
  coachCanDo: {
    unlockWeeksManually: boolean;
    sendMessages: boolean;
    addNotes: boolean;
    extendAccess: boolean;
  };
}
```

#### Coach Dashboard
What coaches see about their clients:

```typescript
interface CoachDashboard {
  totalClients: number;
  activeClients: number;
  completedClients: number;
  
  clients: {
    clientId: string;
    clientName: string;
    programProgress: number;
    currentWeek: number;
    lastActivity: Date;
    nextCoachingCall: Date;
    alerts: string[];  // "Stuck on Week 3 for 7 days"
  }[];
  
  analytics: {
    averageCompletionRate: number;
    averageTimeToComplete: number;
    clientSatisfactionScore: number;
  };
}
```

---

## 🔗 SHARED INFRASTRUCTURE

### Database Tables (Shared)
Both systems use the same database but with different queries:

```sql
-- Shared tables
users                    -- All users (coaches AND clients)
programs                 -- All programs (training AND client)
program_weeks            -- Week structure
program_steps            -- Step content
user_program_enrollment  -- Who's enrolled where
user_step_progress       -- Progress tracking

-- Coach Training specific
treasures                -- Coach resources
marketing_hub            -- Referral system
certifications           -- Certification process
batches                  -- Cohort management

-- Client Hub specific
bonuses                  -- Client rewards
coach_client             -- Coach-client relationships
niche_configurations     -- Niche settings

-- Shared tools
wheel_of_life            -- Same tool, different labels
user_baselines           -- Same tool, different context
user_ncodes              -- Same tool, different examples
user_outcomes            -- Same tool, different examples
ai_generated_content     -- AI outputs for both
```

### AI Integration (Shared)
Same Claude API service, different prompts based on context:

```typescript
// AI Service determines context
async function generateInsights(userId: string, toolId: string) {
  const user = await getUser(userId);
  const enrollment = await getActiveEnrollment(userId);
  
  // Determine if coach training or client program
  const isCoachTraining = enrollment.program.type === 'COACH_TRAINING';
  const niche = isCoachTraining ? null : enrollment.nicheConfiguration;
  
  // Build appropriate prompt
  const prompt = isCoachTraining
    ? buildCoachTrainingPrompt(user, toolId)
    : buildClientPrompt(user, toolId, niche);
  
  return await claudeAPI.generate(prompt);
}
```

### Video Hosting (Shared)
All videos hosted on Vimeo:
- Same embed method for both systems
- Domain-restricted for security
- Tracking for completion

---

## 📊 DATABASE SCHEMA ADDITIONS

### Niche Configuration Table
```sql
CREATE TABLE niche_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  niche_id VARCHAR(50) UNIQUE NOT NULL,
  niche_name VARCHAR(100) NOT NULL,
  description TEXT,
  
  -- Customizations stored as JSONB
  wheel_labels JSONB,
  ai_context JSONB,
  outcome_examples JSONB,
  ncode_examples JSONB,
  buzz_examples JSONB,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Coach-Client Table
```sql
CREATE TABLE coach_client (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID REFERENCES users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES users(id) ON DELETE CASCADE,
  program_id UUID REFERENCES programs(id),
  niche_id VARCHAR(50) REFERENCES niche_configurations(niche_id),
  
  -- Relationship details
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'active',
  
  -- Settings
  coach_notes TEXT,
  custom_settings JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(coach_id, client_id, program_id)
);
```

### Program Type Enum Update
```sql
-- Add program type to distinguish
ALTER TABLE programs ADD COLUMN program_type VARCHAR(20);
-- Values: 'COACH_TRAINING', 'CLIENT_PROGRAM', 'HYBRID'
```

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Coach Training Hub (Current Focus)
1. ✅ Admin Panel with 32 programs
2. ⏳ Week/Step content management
3. ⏳ Content delivery (video player, progress tracking)
4. ⏳ Practice Tools UI
5. ⏳ Treasures system
6. ⏳ Marketing Hub
7. ⏳ Certification system

### Phase 2: Client Hub (After Coach Training)
1. ⏳ Niche configuration system
2. ⏳ Client program template
3. ⏳ Coach-client relationship
4. ⏳ Coach dashboard
5. ⏳ Niche-aware tools
6. ⏳ Bonuses system

### Phase 3: AI Integration (Parallel)
1. ⏳ Claude API service
2. ⏳ Tool insights generation
3. ⏳ Niche-aware prompts
4. ⏳ Content caching

---

## ✅ CHECKLIST

### Coach Training Hub
- [ ] Seed real week/step content from Replit
- [ ] Video player (Vimeo embed)
- [ ] Step completion tracking
- [ ] Assignment submission
- [ ] Practice Tools UI (all 6+ tools)
- [ ] Treasures download system
- [ ] Marketing Hub (share links, referrals)
- [ ] Certification submission
- [ ] Certification review workflow
- [ ] Certificate generation
- [ ] Batch management

### Client Hub
- [ ] Niche configuration table
- [ ] Predefined niches (4+)
- [ ] Niche-aware tool labels
- [ ] Client program template
- [ ] Coach-client relationship
- [ ] Coach dashboard
- [ ] Client onboarding flow
- [ ] Niche-aware AI prompts
- [ ] Bonuses system
- [ ] Custom niche creation (admin)

---

**END OF TWO-SYSTEM ARCHITECTURE ADDITION**

**Integration:** Add this section to PROJECT_MASTER_PLAN.md after Section 7 (Frontend Architecture)

**Timeline Impact:** +2-3 weeks for Client Hub development
**Priority:** Coach Training Hub first, Client Hub second
**Risk:** LOW (clear separation, shared infrastructure)
