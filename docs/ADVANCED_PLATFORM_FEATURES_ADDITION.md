# ADVANCED PLATFORM FEATURES ADDITION
## Post-Core Implementation Enhancements

**Document:** Addition to PROJECT_MASTER_PLAN.md  
**Date:** December 7, 2025  
**Purpose:** Comprehensive feature set to be implemented AFTER core PHP replica is complete  
**Prerequisite:** All features in PROJECT_MASTER_PLAN.md, ADMIN_PANEL_MASTER_PLAN_ADDITION.md, AI_ENHANCED_ADMIN_ADDITION.md, SMART_ACCOUNTING_SYSTEM_ADDITION.md, and INNER_DNA_SYSTEM_ADDITION.md must be complete first.

---

## 📋 EXECUTIVE SUMMARY

This document specifies 10 advanced feature systems that transform IYCT from a course platform into an intelligent coaching ecosystem. These features leverage AI, automation, and analytics to maximize coach success, reduce admin overhead, and create competitive differentiation.

**Total Estimated Timeline:** 8-10 weeks (after core platform complete)  
**Total New Database Tables:** 25+  
**Total New API Endpoints:** 150+  
**Total New UI Components:** 80+

---

## 🎯 IMPLEMENTATION ORDER

| Phase | Feature | Weeks | Dependencies |
|-------|---------|-------|--------------|
| A | MIS Reports Module | 1.5 | Core platform data |
| A | Content Analytics | 0.5 | Video player integration |
| B | Coach Success Dashboard | 1 | MIS Reports |
| B | Support Ticket System | 1 | User management |
| C | Automated Engagement System | 1.5 | Email/SMS integration |
| C | Communication Center | 1 | Engagement system |
| D | Referral & Affiliate System | 1.5 | Payment system |
| D | Audit & Compliance | 0.5 | Core platform |
| E | Gamification System | 1.5 | Progress tracking |
| E | AI Coach Assistant | 2 | Inner DNA, Claude API |

---

## 1. MIS REPORTS MODULE

### 1.1 Overview

Management Information System providing actionable insights through automated reporting.

### 1.2 Report Types

#### A. Coach Performance Scorecard
```typescript
interface CoachScorecard {
  coachId: string;
  period: 'weekly' | 'monthly' | 'quarterly';
  
  // Engagement Metrics
  loginFrequency: number;           // Days logged in / total days
  avgSessionDuration: number;       // Minutes
  videoWatchRate: number;           // % of videos watched
  activityCompletionRate: number;   // % of activities completed
  
  // Progress Metrics
  programsEnrolled: number;
  programsCompleted: number;
  currentProgress: {
    programId: string;
    programName: string;
    percentComplete: number;
    lastActivity: Date;
    daysStalled: number;
  }[];
  
  // Achievement Metrics
  certificationsEarned: number;
  badgesEarned: number;
  streakDays: number;
  
  // Financial Metrics
  totalPaid: number;
  outstanding: number;
  paymentStatus: 'current' | 'overdue' | 'defaulted';
  
  // AI Summary
  healthScore: number;              // 0-100
  riskLevel: 'low' | 'medium' | 'high';
  aiRecommendations: string[];
}
```

#### B. Program Profitability Report
```typescript
interface ProgramProfitability {
  programId: string;
  programName: string;
  period: DateRange;
  
  // Revenue
  grossRevenue: number;
  refunds: number;
  netRevenue: number;
  revenuePerEnrollment: number;
  
  // Costs (estimated)
  contentCreationCost: number;      // Amortized
  supportCost: number;              // Tickets × avg cost
  aiCost: number;                   // Claude API usage
  infrastructureCost: number;       // Proportional
  
  // Profitability
  grossMargin: number;
  netMargin: number;
  roi: number;
  
  // Performance
  enrollmentCount: number;
  completionRate: number;
  avgCompletionDays: number;
  npsScore: number;
  
  // Comparison
  vsLastPeriod: {
    revenueChange: number;
    enrollmentChange: number;
    marginChange: number;
  };
}
```

#### C. Cohort Analysis Report
```typescript
interface CohortAnalysis {
  cohortId: string;                 // e.g., "2025-01" for Jan 2025 enrollees
  programId: string;
  enrollmentMonth: string;
  
  // Size
  initialSize: number;
  currentActive: number;
  completed: number;
  dropped: number;
  
  // Retention Curve
  retentionByWeek: {
    week: number;
    activeCount: number;
    retentionRate: number;
  }[];
  
  // Milestone Achievement
  milestones: {
    name: string;                   // "Week 1", "Week 5", "Certification"
    achievedCount: number;
    achievedRate: number;
    avgDaysToAchieve: number;
  }[];
  
  // Revenue
  totalRevenue: number;
  avgRevenuePerUser: number;
  ltv: number;                      // Lifetime value
  
  // Comparison
  vsPreviousCohort: {
    retentionDiff: number;
    completionDiff: number;
    ltvDiff: number;
  };
}
```

#### D. Funnel Analytics Report
```typescript
interface FunnelAnalytics {
  period: DateRange;
  
  stages: {
    name: string;
    count: number;
    conversionRate: number;
    dropOffRate: number;
    avgTimeInStage: number;
  }[];
  
  // Standard funnel stages:
  // 1. Website Visit
  // 2. Registration Started
  // 3. Registration Completed
  // 4. Payment Started
  // 5. Payment Completed (Enrolled)
  // 6. First Login
  // 7. Week 1 Completed
  // 8. 50% Progress
  // 9. Program Completed
  // 10. Certified
  
  // Drop-off Analysis
  topDropOffPoints: {
    stage: string;
    dropOffCount: number;
    commonReasons: string[];        // AI-analyzed
  }[];
  
  // Optimization Suggestions
  aiSuggestions: string[];
}
```

#### E. Geographic Revenue Map
```typescript
interface GeographicRevenue {
  period: DateRange;
  
  byCountry: {
    countryCode: string;
    countryName: string;
    revenue: number;
    enrollments: number;
    avgOrderValue: number;
    topProgram: string;
    currency: string;
    growth: number;                 // vs last period
  }[];
  
  byRegion: {
    region: string;                 // "Asia", "Europe", etc.
    revenue: number;
    percentage: number;
  }[];
  
  // Heatmap data for visualization
  heatmapData: {
    lat: number;
    lng: number;
    value: number;
  }[];
}
```

#### F. Activity Heatmap
```typescript
interface ActivityHeatmap {
  period: DateRange;
  
  // Hourly activity (24 hours × 7 days)
  hourlyActivity: {
    dayOfWeek: number;              // 0-6
    hour: number;                   // 0-23
    loginCount: number;
    videoViews: number;
    activityCompletions: number;
  }[];
  
  // Peak times
  peakHours: {
    timezone: string;
    peakHour: number;
    peakDay: number;
  };
  
  // Content popularity
  topContent: {
    stepId: string;
    stepTitle: string;
    views: number;
    avgWatchTime: number;
    completionRate: number;
  }[];
}
```

#### G. Churn Analysis Report
```typescript
interface ChurnAnalysis {
  period: DateRange;
  
  // Churn metrics
  churnRate: number;                // % who stopped engaging
  churnedUsers: number;
  atRiskUsers: number;
  
  // Churn by segment
  byProgram: { programId: string; churnRate: number; }[];
  byEnrollmentAge: { months: number; churnRate: number; }[];
  byPaymentStatus: { status: string; churnRate: number; }[];
  
  // Churn reasons (AI-analyzed)
  topReasons: {
    reason: string;
    percentage: number;
    affectedUsers: number;
  }[];
  
  // At-risk users
  atRiskList: {
    userId: string;
    userName: string;
    riskScore: number;
    lastActivity: Date;
    daysInactive: number;
    predictedChurnDate: Date;
    suggestedIntervention: string;
  }[];
  
  // Prevention effectiveness
  interventionResults: {
    type: string;
    sent: number;
    prevented: number;
    effectivenessRate: number;
  }[];
}
```

#### H. Lifetime Value Report
```typescript
interface LTVReport {
  period: DateRange;
  
  // Overall LTV
  avgLTV: number;
  medianLTV: number;
  maxLTV: number;
  
  // LTV by segment
  byAcquisitionChannel: { channel: string; ltv: number; }[];
  byProgram: { programId: string; ltv: number; }[];
  byCountry: { country: string; ltv: number; }[];
  byPersonalityType: { type: number; ltv: number; }[];  // Inner DNA
  
  // LTV components
  avgPurchases: number;
  avgPurchaseValue: number;
  avgLifespan: number;              // Months
  
  // Predictive
  predictedLTVNewUsers: number;
  ltvTrend: 'increasing' | 'stable' | 'decreasing';
  
  // High-value users
  topUsers: {
    userId: string;
    userName: string;
    ltv: number;
    enrollments: number;
    referrals: number;
  }[];
}
```

### 1.3 Database Schema
```sql
-- Report cache table
CREATE TABLE report_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type VARCHAR(50) NOT NULL,
  parameters JSONB,                 -- Filter parameters
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  data JSONB NOT NULL,
  
  INDEX idx_report_type (report_type),
  INDEX idx_expires (expires_at)
);

-- Report schedules
CREATE TABLE report_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_type VARCHAR(50) NOT NULL,
  frequency VARCHAR(20) NOT NULL,   -- daily, weekly, monthly
  parameters JSONB,
  recipients TEXT[],                -- Email addresses
  last_sent_at TIMESTAMPTZ,
  next_send_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User activity log (for analytics)
CREATE TABLE user_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  activity_type VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50),          -- program, step, video, etc.
  entity_id UUID,
  metadata JSONB,
  duration_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_user_activity (user_id, created_at),
  INDEX idx_activity_type (activity_type, created_at),
  INDEX idx_entity (entity_type, entity_id)
);
```

### 1.4 API Endpoints
```typescript
// Report generation
GET  /api/v1/admin/reports/coach-scorecard/:coachId
GET  /api/v1/admin/reports/coach-scorecard/bulk
GET  /api/v1/admin/reports/program-profitability/:programId
GET  /api/v1/admin/reports/program-profitability/all
GET  /api/v1/admin/reports/cohort/:cohortId
GET  /api/v1/admin/reports/cohort/compare
GET  /api/v1/admin/reports/funnel
GET  /api/v1/admin/reports/geographic
GET  /api/v1/admin/reports/activity-heatmap
GET  /api/v1/admin/reports/churn
GET  /api/v1/admin/reports/ltv

// Report scheduling
GET    /api/v1/admin/reports/schedules
POST   /api/v1/admin/reports/schedules
PATCH  /api/v1/admin/reports/schedules/:id
DELETE /api/v1/admin/reports/schedules/:id

// Export
POST /api/v1/admin/reports/export
     Body: { reportType, parameters, format: 'pdf' | 'csv' | 'xlsx' }
```

### 1.5 UI Components
```
/admin/reports
├── ReportsDashboard.tsx           # Overview with quick stats
├── CoachScorecard/
│   ├── ScorecardView.tsx
│   ├── ScorecardFilters.tsx
│   └── ScorecardExport.tsx
├── ProgramProfitability/
│   ├── ProfitabilityTable.tsx
│   ├── ProfitabilityChart.tsx
│   └── ProgramComparison.tsx
├── CohortAnalysis/
│   ├── CohortSelector.tsx
│   ├── RetentionCurve.tsx
│   └── CohortComparison.tsx
├── FunnelAnalytics/
│   ├── FunnelVisualization.tsx
│   ├── DropOffAnalysis.tsx
│   └── ConversionTrends.tsx
├── GeographicRevenue/
│   ├── RevenueMap.tsx
│   ├── CountryTable.tsx
│   └── RegionBreakdown.tsx
├── ActivityHeatmap/
│   ├── HeatmapChart.tsx
│   ├── PeakTimeInsights.tsx
│   └── ContentPopularity.tsx
├── ChurnAnalysis/
│   ├── ChurnMetrics.tsx
│   ├── AtRiskList.tsx
│   └── InterventionTracker.tsx
├── LTVReport/
│   ├── LTVOverview.tsx
│   ├── SegmentBreakdown.tsx
│   └── TopUsersTable.tsx
└── ReportScheduler/
    ├── ScheduleList.tsx
    └── ScheduleForm.tsx
```

---

## 2. CONTENT ANALYTICS

### 2.1 Overview

Track how users interact with program content to identify improvements.

### 2.2 Metrics Tracked
```typescript
interface ContentMetrics {
  stepId: string;
  stepTitle: string;
  programId: string;
  weekNumber: number;
  
  // View metrics
  totalViews: number;
  uniqueViewers: number;
  avgViewDuration: number;
  completionRate: number;
  
  // Video metrics (if applicable)
  videoId: string;
  videoDuration: number;
  avgWatchTime: number;
  watchPercentage: number;
  replayCount: number;
  skipPoints: number[];             // Timestamps where users skip
  rewindPoints: number[];           // Timestamps where users rewind
  
  // Drop-off
  dropOffRate: number;
  dropOffPoint: number;             // Timestamp
  exitedToNext: number;             // Went to next step
  exitedToDashboard: number;        // Left program
  
  // Activity metrics (if applicable)
  activityType: string;
  activityCompletionRate: number;
  avgTimeToComplete: number;
  submissionCount: number;
  
  // Feedback
  helpfulRating: number;            // If implemented
  reportedIssues: number;
  comments: number;
}
```

### 2.3 Database Schema
```sql
CREATE TABLE content_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID REFERENCES program_steps(id),
  user_id UUID REFERENCES users(id),
  
  -- Session info
  session_id VARCHAR(100),
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ,
  
  -- View data
  view_duration_seconds INTEGER,
  completed BOOLEAN DEFAULT false,
  
  -- Video data
  video_watch_seconds INTEGER,
  video_max_position INTEGER,       -- Furthest point reached
  video_events JSONB,               -- play, pause, seek events
  
  -- Activity data
  activity_started BOOLEAN DEFAULT false,
  activity_completed BOOLEAN DEFAULT false,
  activity_duration_seconds INTEGER,
  activity_data JSONB,
  
  -- Exit behavior
  exit_type VARCHAR(20),            -- next, previous, dashboard, close
  
  INDEX idx_step_analytics (step_id),
  INDEX idx_user_analytics (user_id),
  INDEX idx_session (session_id)
);

-- Aggregated daily stats
CREATE TABLE content_daily_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_id UUID REFERENCES program_steps(id),
  stat_date DATE NOT NULL,
  
  views INTEGER DEFAULT 0,
  unique_viewers INTEGER DEFAULT 0,
  completions INTEGER DEFAULT 0,
  avg_duration_seconds INTEGER,
  drop_offs INTEGER DEFAULT 0,
  
  UNIQUE(step_id, stat_date),
  INDEX idx_step_date (step_id, stat_date)
);
```

### 2.4 API Endpoints
```typescript
// Analytics endpoints
GET  /api/v1/admin/analytics/content/:stepId
GET  /api/v1/admin/analytics/content/program/:programId
GET  /api/v1/admin/analytics/content/drop-offs
GET  /api/v1/admin/analytics/content/popular
GET  /api/v1/admin/analytics/content/problematic
GET  /api/v1/admin/analytics/videos/:videoId/engagement

// Tracking (frontend calls)
POST /api/v1/analytics/track
     Body: { stepId, event, data, timestamp }
```

---

## 3. COACH SUCCESS DASHBOARD

### 3.1 Overview

A dedicated page showing complete 360° view of any coach.

### 3.2 Dashboard Sections
```typescript
interface CoachSuccessDashboard {
  // Header
  coach: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
    joinedAt: Date;
    country: string;
    timezone: string;
  };
  
  // Inner DNA Profile
  personality: {
    type: number;
    typeName: string;
    wing: number;
    dominantState: string;
    subtypes: { sp: number; sx: number; so: number };
    lastAssessment: Date;
  };
  
  // Health Score
  healthScore: {
    overall: number;                // 0-100
    engagement: number;
    progress: number;
    payment: number;
    trend: 'up' | 'stable' | 'down';
    aiInsights: string[];
  };
  
  // Progress Overview
  programs: {
    programId: string;
    programName: string;
    enrolledAt: Date;
    status: 'active' | 'completed' | 'stalled' | 'dropped';
    progress: number;
    currentWeek: number;
    totalWeeks: number;
    lastActivity: Date;
    completedAt?: Date;
  }[];
  
  // Activity Timeline
  recentActivity: {
    type: string;
    description: string;
    timestamp: Date;
  }[];
  
  // Engagement Metrics
  engagement: {
    loginStreak: number;
    totalLogins: number;
    avgSessionDuration: number;
    lastLogin: Date;
    preferredTime: string;
  };
  
  // Achievements
  achievements: {
    badges: { name: string; earnedAt: Date; icon: string }[];
    certificates: { name: string; earnedAt: Date; url: string }[];
    streaks: { type: string; current: number; best: number }[];
  };
  
  // Financial
  financial: {
    totalPaid: number;
    outstanding: number;
    nextPaymentDue: Date | null;
    nextPaymentAmount: number | null;
    paymentHistory: { date: Date; amount: number; status: string }[];
    paymentStatus: 'current' | 'overdue' | 'defaulted';
  };
  
  // Support History
  support: {
    totalTickets: number;
    openTickets: number;
    avgResolutionTime: number;
    csatScore: number;
    recentTickets: { id: string; subject: string; status: string; date: Date }[];
  };
  
  // Referrals
  referrals: {
    totalReferred: number;
    successfulReferrals: number;
    commissionEarned: number;
    pendingCommission: number;
    referredUsers: { name: string; enrolledAt: Date; program: string }[];
  };
  
  // AI Recommendations
  aiRecommendations: {
    category: 'engagement' | 'progress' | 'payment' | 'support';
    priority: 'high' | 'medium' | 'low';
    recommendation: string;
    action?: string;
  }[];
  
  // Admin Actions
  quickActions: {
    sendMessage: boolean;
    adjustPayment: boolean;
    grantAccess: boolean;
    extendDeadline: boolean;
    issueRefund: boolean;
  };
}
```

### 3.3 API Endpoints
```typescript
GET  /api/v1/admin/coaches/:id/dashboard
GET  /api/v1/admin/coaches/:id/activity
GET  /api/v1/admin/coaches/:id/timeline
POST /api/v1/admin/coaches/:id/note
POST /api/v1/admin/coaches/:id/action
```

### 3.4 UI Components
```
/admin/coaches/:id
├── CoachHeader.tsx                # Avatar, name, quick stats
├── PersonalityCard.tsx            # Inner DNA summary
├── HealthScoreGauge.tsx           # Visual health indicator
├── ProgramProgressList.tsx        # All enrollments
├── ActivityTimeline.tsx           # Recent actions
├── EngagementMetrics.tsx          # Login stats, session time
├── AchievementsPanel.tsx          # Badges, certs, streaks
├── FinancialSummary.tsx           # Payments, outstanding
├── SupportHistory.tsx             # Ticket summary
├── ReferralStats.tsx              # Referral tracking
├── AIRecommendations.tsx          # Suggested actions
└── QuickActions.tsx               # Admin action buttons
```

---

## 4. SUPPORT TICKET SYSTEM

### 4.1 Overview

Full-featured support system with AI assistance.

### 4.2 Data Model
```typescript
interface SupportTicket {
  id: string;
  ticketNumber: string;             // IYCT-2024-00001
  
  // User info
  userId: string;
  userEmail: string;
  userName: string;
  
  // Ticket details
  subject: string;
  description: string;
  category: 'technical' | 'payment' | 'content' | 'account' | 'other';
  subcategory: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_user' | 'waiting_admin' | 'resolved' | 'closed';
  
  // Assignment
  assignedTo: string | null;
  assignedAt: Date | null;
  
  // SLA
  slaDeadline: Date;
  slaBreach: boolean;
  
  // Context
  relatedProgram: string | null;
  relatedPayment: string | null;
  attachments: { name: string; url: string; type: string }[];
  
  // AI
  aiCategory: string;               // Auto-categorized
  aiPriority: string;               // Auto-prioritized
  aiSuggestedResponse: string;
  aiSimilarTickets: string[];
  
  // Resolution
  resolution: string | null;
  resolvedBy: string | null;
  resolvedAt: Date | null;
  
  // Satisfaction
  csatScore: number | null;         // 1-5
  csatFeedback: string | null;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  firstResponseAt: Date | null;
  
  // Messages
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderType: 'user' | 'admin' | 'system';
  senderName: string;
  content: string;
  attachments: { name: string; url: string }[];
  isInternal: boolean;              // Internal admin note
  createdAt: Date;
}
```

### 4.3 Database Schema
```sql
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number VARCHAR(20) UNIQUE NOT NULL,
  
  user_id UUID REFERENCES users(id),
  
  subject VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(50),
  priority VARCHAR(20) DEFAULT 'medium',
  status VARCHAR(20) DEFAULT 'open',
  
  assigned_to UUID REFERENCES users(id),
  assigned_at TIMESTAMPTZ,
  
  sla_deadline TIMESTAMPTZ,
  sla_breached BOOLEAN DEFAULT false,
  
  related_program_id UUID REFERENCES programs(id),
  related_payment_id UUID REFERENCES payments(id),
  
  ai_category VARCHAR(50),
  ai_priority VARCHAR(20),
  ai_suggested_response TEXT,
  ai_similar_tickets UUID[],
  
  resolution TEXT,
  resolved_by UUID REFERENCES users(id),
  resolved_at TIMESTAMPTZ,
  
  csat_score INTEGER CHECK (csat_score BETWEEN 1 AND 5),
  csat_feedback TEXT,
  
  first_response_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_user_tickets (user_id),
  INDEX idx_status (status),
  INDEX idx_assigned (assigned_to),
  INDEX idx_priority_status (priority, status),
  INDEX idx_sla (sla_deadline) WHERE status NOT IN ('resolved', 'closed')
);

CREATE TABLE ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id),
  sender_type VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_ticket_messages (ticket_id, created_at)
);

CREATE TABLE ticket_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID REFERENCES support_tickets(id),
  message_id UUID REFERENCES ticket_messages(id),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  file_size INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Knowledge base for AI suggestions
CREATE TABLE knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[],
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_kb_category (category),
  INDEX idx_kb_keywords (keywords)
);
```

### 4.4 SLA Configuration
```typescript
const SLA_CONFIG = {
  urgent: { firstResponse: 1, resolution: 4 },    // hours
  high: { firstResponse: 4, resolution: 24 },
  medium: { firstResponse: 24, resolution: 72 },
  low: { firstResponse: 48, resolution: 168 },    // 7 days
};
```

### 4.5 API Endpoints
```typescript
// User endpoints
POST /api/v1/support/tickets
GET  /api/v1/support/tickets
GET  /api/v1/support/tickets/:id
POST /api/v1/support/tickets/:id/message
POST /api/v1/support/tickets/:id/close
POST /api/v1/support/tickets/:id/csat

// Admin endpoints
GET    /api/v1/admin/support/tickets
GET    /api/v1/admin/support/tickets/:id
PATCH  /api/v1/admin/support/tickets/:id
POST   /api/v1/admin/support/tickets/:id/assign
POST   /api/v1/admin/support/tickets/:id/reply
POST   /api/v1/admin/support/tickets/:id/note
POST   /api/v1/admin/support/tickets/:id/resolve
GET    /api/v1/admin/support/stats
GET    /api/v1/admin/support/ai/suggest/:ticketId

// Knowledge base
GET    /api/v1/admin/support/kb
POST   /api/v1/admin/support/kb
PATCH  /api/v1/admin/support/kb/:id
DELETE /api/v1/admin/support/kb/:id
GET    /api/v1/support/kb/search
```

### 4.6 UI Components
```
/admin/support
├── TicketQueue.tsx                # Main ticket list
├── TicketFilters.tsx              # Status, priority, category filters
├── TicketDetail.tsx               # Full ticket view
├── TicketConversation.tsx         # Message thread
├── ReplyEditor.tsx                # Rich text reply
├── AIAssistant.tsx                # Suggested responses
├── InternalNotes.tsx              # Admin-only notes
├── TicketAssignment.tsx           # Assign to admin
├── SLAIndicator.tsx               # Time remaining
├── CSATDisplay.tsx                # Satisfaction scores
├── SupportDashboard.tsx           # Stats overview
└── KnowledgeBase/
    ├── ArticleList.tsx
    ├── ArticleEditor.tsx
    └── ArticleSearch.tsx
```

---

## 5. AUTOMATED ENGAGEMENT SYSTEM

### 5.1 Overview

Trigger-based automated communications to keep users engaged.

### 5.2 Trigger Types
```typescript
interface EngagementTrigger {
  id: string;
  name: string;
  type: TriggerType;
  conditions: TriggerCondition[];
  actions: TriggerAction[];
  isActive: boolean;
  priority: number;
  cooldownDays: number;             // Don't re-trigger for X days
}

type TriggerType = 
  | 'inactivity'
  | 'progress_stall'
  | 'milestone'
  | 'payment_due'
  | 'birthday'
  | 'anniversary'
  | 'completion'
  | 'certification'
  | 'streak'
  | 'custom';

interface TriggerCondition {
  field: string;
  operator: 'equals' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'in';
  value: any;
}

interface TriggerAction {
  type: 'email' | 'sms' | 'whatsapp' | 'in_app' | 'webhook';
  templateId: string;
  delay: number;                    // Minutes after trigger
  personalization: boolean;
}
```

### 5.3 Default Triggers
```typescript
const DEFAULT_TRIGGERS: EngagementTrigger[] = [
  {
    id: 'no-login-7d',
    name: 'No Login for 7 Days',
    type: 'inactivity',
    conditions: [{ field: 'lastLogin', operator: 'lt', value: 'now - 7 days' }],
    actions: [
      { type: 'email', templateId: 'comeback-email', delay: 0 },
      { type: 'in_app', templateId: 'comeback-notification', delay: 0 }
    ],
    cooldownDays: 7
  },
  {
    id: 'stuck-step-5d',
    name: 'Stuck on Same Step 5 Days',
    type: 'progress_stall',
    conditions: [{ field: 'daysOnCurrentStep', operator: 'gte', value: 5 }],
    actions: [
      { type: 'email', templateId: 'encouragement-email', delay: 0 }
    ],
    cooldownDays: 5
  },
  {
    id: 'week-completed',
    name: 'Week Completed',
    type: 'milestone',
    conditions: [{ field: 'event', operator: 'equals', value: 'week_completed' }],
    actions: [
      { type: 'email', templateId: 'week-celebration', delay: 0 },
      { type: 'in_app', templateId: 'week-badge-notification', delay: 0 }
    ],
    cooldownDays: 0
  },
  {
    id: 'payment-due-3d',
    name: 'Payment Due in 3 Days',
    type: 'payment_due',
    conditions: [{ field: 'nextPaymentDue', operator: 'equals', value: 'now + 3 days' }],
    actions: [
      { type: 'email', templateId: 'payment-reminder-friendly', delay: 0 }
    ],
    cooldownDays: 3
  },
  {
    id: 'birthday',
    name: 'User Birthday',
    type: 'birthday',
    conditions: [{ field: 'birthday', operator: 'equals', value: 'today' }],
    actions: [
      { type: 'email', templateId: 'birthday-wishes', delay: 0 }
    ],
    cooldownDays: 365
  },
  {
    id: 'enrollment-anniversary',
    name: 'Enrollment Anniversary',
    type: 'anniversary',
    conditions: [{ field: 'enrollmentDate', operator: 'equals', value: 'today - 1 year' }],
    actions: [
      { type: 'email', templateId: 'anniversary-email', delay: 0 }
    ],
    cooldownDays: 365
  },
  {
    id: 'program-completed',
    name: 'Program Completed',
    type: 'completion',
    conditions: [{ field: 'event', operator: 'equals', value: 'program_completed' }],
    actions: [
      { type: 'email', templateId: 'completion-celebration', delay: 0 },
      { type: 'in_app', templateId: 'completion-notification', delay: 0 }
    ],
    cooldownDays: 0
  },
  {
    id: 'certification-earned',
    name: 'Certification Earned',
    type: 'certification',
    conditions: [{ field: 'event', operator: 'equals', value: 'certified' }],
    actions: [
      { type: 'email', templateId: 'certification-email', delay: 0 }
    ],
    cooldownDays: 0
  },
  {
    id: 'streak-7',
    name: '7-Day Login Streak',
    type: 'streak',
    conditions: [{ field: 'loginStreak', operator: 'equals', value: 7 }],
    actions: [
      { type: 'in_app', templateId: 'streak-badge', delay: 0 }
    ],
    cooldownDays: 7
  }
];
```

### 5.4 Database Schema
```sql
CREATE TABLE engagement_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  conditions JSONB NOT NULL,
  actions JSONB NOT NULL,
  is_active BOOLEAN DEFAULT true,
  priority INTEGER DEFAULT 0,
  cooldown_days INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE engagement_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id VARCHAR(100) UNIQUE NOT NULL,
  channel VARCHAR(20) NOT NULL,     -- email, sms, whatsapp, in_app
  name VARCHAR(100) NOT NULL,
  subject VARCHAR(255),             -- For email
  content TEXT NOT NULL,
  variables TEXT[],                 -- Placeholders like {{firstName}}
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE engagement_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  trigger_id UUID REFERENCES engagement_triggers(id),
  template_id UUID REFERENCES engagement_templates(id),
  channel VARCHAR(20) NOT NULL,
  
  -- Delivery status
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  
  -- Result tracking
  resulted_in_login BOOLEAN DEFAULT false,
  resulted_in_action BOOLEAN DEFAULT false,
  
  INDEX idx_user_engagement (user_id, sent_at),
  INDEX idx_trigger_stats (trigger_id, sent_at)
);
```

### 5.5 API Endpoints
```typescript
// Trigger management
GET    /api/v1/admin/engagement/triggers
POST   /api/v1/admin/engagement/triggers
PATCH  /api/v1/admin/engagement/triggers/:id
DELETE /api/v1/admin/engagement/triggers/:id

// Template management
GET    /api/v1/admin/engagement/templates
POST   /api/v1/admin/engagement/templates
PATCH  /api/v1/admin/engagement/templates/:id
DELETE /api/v1/admin/engagement/templates/:id
POST   /api/v1/admin/engagement/templates/:id/test

// History & stats
GET    /api/v1/admin/engagement/history
GET    /api/v1/admin/engagement/stats
GET    /api/v1/admin/engagement/user/:userId/history
```

### 5.6 Background Jobs
```typescript
const ENGAGEMENT_JOBS = [
  {
    name: 'check-inactivity-triggers',
    schedule: '0 8 * * *',          // Daily at 8 AM
    action: 'Check for inactive users and trigger appropriate messages'
  },
  {
    name: 'check-stalled-progress',
    schedule: '0 9 * * *',
    action: 'Check for users stuck on steps and send encouragement'
  },
  {
    name: 'check-payment-reminders',
    schedule: '0 10 * * *',
    action: 'Send payment due reminders'
  },
  {
    name: 'check-birthdays',
    schedule: '0 0 * * *',          // Midnight
    action: 'Send birthday wishes'
  },
  {
    name: 'check-anniversaries',
    schedule: '0 6 * * *',
    action: 'Send anniversary messages'
  }
];
```

---

## 6. COMMUNICATION CENTER

### 6.1 Overview

Centralized bulk messaging with segmentation and personalization.

### 6.2 Features
```typescript
interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'push';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'paused';
  
  // Content
  subject: string;                  // Email only
  content: string;
  templateId?: string;
  
  // Audience
  audienceType: 'all' | 'segment' | 'manual';
  segment?: SegmentCriteria;
  manualRecipients?: string[];
  totalRecipients: number;
  
  // Personalization
  useAIPersonalization: boolean;
  personalizedFields: string[];
  
  // Scheduling
  scheduledAt: Date | null;
  sendAt: 'immediate' | 'scheduled' | 'optimal';
  timezone?: string;
  
  // Stats
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  bouncedCount: number;
  unsubscribedCount: number;
  
  // Timestamps
  createdAt: Date;
  sentAt: Date | null;
}

interface SegmentCriteria {
  conditions: {
    field: string;
    operator: string;
    value: any;
  }[];
  logic: 'and' | 'or';
}
```

### 6.3 Segmentation Options

| Field | Operators | Example |
|-------|-----------|---------|
| program | equals, in | Program is "Mind Hacker" |
| status | equals, in | Status is "active" |
| progress | gt, lt, between | Progress > 50% |
| language | equals | Language is "Hindi" |
| country | equals, in | Country is India |
| enrolledDate | gt, lt, between | Enrolled in last 30 days |
| lastLogin | gt, lt | Last login > 7 days ago |
| paymentStatus | equals | Payment is overdue |
| personalityType | equals, in | Enneagram Type 8 |
| hasCompleted | equals | Has completed certification |
| tags | contains | Has tag "VIP" |

### 6.4 Database Schema
```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft',
  
  subject VARCHAR(255),
  content TEXT NOT NULL,
  template_id UUID REFERENCES engagement_templates(id),
  
  audience_type VARCHAR(20) NOT NULL,
  segment_criteria JSONB,
  manual_recipients UUID[],
  total_recipients INTEGER DEFAULT 0,
  
  use_ai_personalization BOOLEAN DEFAULT false,
  personalized_fields TEXT[],
  
  scheduled_at TIMESTAMPTZ,
  send_type VARCHAR(20) DEFAULT 'immediate',
  timezone VARCHAR(50),
  
  sent_count INTEGER DEFAULT 0,
  delivered_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  bounced_count INTEGER DEFAULT 0,
  unsubscribed_count INTEGER DEFAULT 0,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ,
  
  INDEX idx_campaign_status (status),
  INDEX idx_campaign_scheduled (scheduled_at) WHERE status = 'scheduled'
);

CREATE TABLE campaign_recipients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID REFERENCES campaigns(id),
  user_id UUID REFERENCES users(id),
  
  status VARCHAR(20) DEFAULT 'pending',
  personalized_content TEXT,
  
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  
  bounce_reason TEXT,
  
  INDEX idx_campaign_recipients (campaign_id),
  INDEX idx_user_campaigns (user_id)
);

CREATE TABLE user_segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  criteria JSONB NOT NULL,
  user_count INTEGER DEFAULT 0,
  is_dynamic BOOLEAN DEFAULT true,  -- Recalculate on query
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 6.5 API Endpoints
```typescript
// Campaigns
GET    /api/v1/admin/campaigns
POST   /api/v1/admin/campaigns
GET    /api/v1/admin/campaigns/:id
PATCH  /api/v1/admin/campaigns/:id
DELETE /api/v1/admin/campaigns/:id
POST   /api/v1/admin/campaigns/:id/send
POST   /api/v1/admin/campaigns/:id/pause
POST   /api/v1/admin/campaigns/:id/resume
POST   /api/v1/admin/campaigns/:id/test
GET    /api/v1/admin/campaigns/:id/stats
GET    /api/v1/admin/campaigns/:id/recipients

// Segments
GET    /api/v1/admin/segments
POST   /api/v1/admin/segments
GET    /api/v1/admin/segments/:id
PATCH  /api/v1/admin/segments/:id
DELETE /api/v1/admin/segments/:id
GET    /api/v1/admin/segments/:id/preview
GET    /api/v1/admin/segments/:id/users

// Unsubscribe handling
POST   /api/v1/unsubscribe/:token
```

### 6.6 UI Components
```
/admin/communications
├── CampaignList.tsx               # All campaigns
├── CampaignBuilder/
│   ├── CampaignForm.tsx
│   ├── ContentEditor.tsx          # Rich text editor
│   ├── AudienceSelector.tsx
│   ├── SegmentBuilder.tsx
│   ├── PersonalizationOptions.tsx
│   ├── ScheduleOptions.tsx
│   └── PreviewPanel.tsx
├── CampaignDetail/
│   ├── CampaignOverview.tsx
│   ├── RecipientList.tsx
│   ├── CampaignStats.tsx
│   └── EngagementChart.tsx
├── SegmentManager/
│   ├── SegmentList.tsx
│   ├── SegmentBuilder.tsx
│   └── SegmentPreview.tsx
└── Templates/
    ├── TemplateList.tsx
    └── TemplateEditor.tsx
```

---

## 7. REFERRAL & AFFILIATE SYSTEM

### 7.1 Overview

Track referrals, manage affiliates, and automate commission payouts.

### 7.2 Data Model
```typescript
interface Affiliate {
  id: string;
  userId: string;
  userName: string;
  
  // Affiliate details
  affiliateCode: string;            // Unique code
  affiliateType: 'coach' | 'partner' | 'influencer';
  
  // Commission structure
  commissionType: 'percentage' | 'fixed';
  commissionValue: number;
  commissionCurrency: string;
  
  // Restrictions
  allowedPrograms: string[] | 'all';
  maxDiscountPercent: number;
  
  // Custom link
  customSlug?: string;              // iyct.com/ref/john
  
  // Status
  status: 'active' | 'paused' | 'suspended';
  
  // Stats (calculated)
  totalReferrals: number;
  successfulReferrals: number;
  pendingCommission: number;
  paidCommission: number;
  
  // Timestamps
  createdAt: Date;
  lastReferralAt: Date | null;
}

interface Referral {
  id: string;
  affiliateId: string;
  
  // Referred user
  referredUserId: string;
  referredUserEmail: string;
  referredUserName: string;
  
  // Tracking
  referralCode: string;
  referralUrl: string;
  landingPage: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  
  // Conversion
  status: 'clicked' | 'registered' | 'enrolled' | 'paid' | 'completed';
  registeredAt: Date | null;
  enrolledAt: Date | null;
  paidAt: Date | null;
  
  // Enrollment
  programId?: string;
  programName?: string;
  enrollmentId?: string;
  paymentAmount?: number;
  
  // Commission
  commissionAmount: number;
  commissionStatus: 'pending' | 'approved' | 'paid' | 'rejected';
  commissionPaidAt: Date | null;
  
  // Attribution
  firstClickAt: Date;
  lastClickAt: Date;
  attributionWindow: number;        // Days
  
  createdAt: Date;
}

interface CommissionPayout {
  id: string;
  affiliateId: string;
  
  amount: number;
  currency: string;
  
  referralIds: string[];
  referralCount: number;
  
  paymentMethod: 'bank' | 'paypal' | 'crypto';
  paymentDetails: any;
  
  status: 'pending' | 'processing' | 'paid' | 'failed';
  paidAt: Date | null;
  transactionId?: string;
  
  createdAt: Date;
}
```

### 7.3 Database Schema
```sql
CREATE TABLE affiliates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  
  affiliate_code VARCHAR(20) UNIQUE NOT NULL,
  affiliate_type VARCHAR(20) DEFAULT 'coach',
  
  commission_type VARCHAR(20) DEFAULT 'percentage',
  commission_value DECIMAL(10,2) NOT NULL,
  commission_currency VARCHAR(3) DEFAULT 'USD',
  
  allowed_programs UUID[],          -- NULL means all
  max_discount_percent DECIMAL(5,2) DEFAULT 0,
  
  custom_slug VARCHAR(50) UNIQUE,
  
  status VARCHAR(20) DEFAULT 'active',
  
  total_referrals INTEGER DEFAULT 0,
  successful_referrals INTEGER DEFAULT 0,
  pending_commission DECIMAL(12,2) DEFAULT 0,
  paid_commission DECIMAL(12,2) DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_referral_at TIMESTAMPTZ,
  
  INDEX idx_affiliate_code (affiliate_code),
  INDEX idx_affiliate_status (status)
);

CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id),
  
  referred_user_id UUID REFERENCES users(id),
  
  referral_code VARCHAR(20) NOT NULL,
  referral_url TEXT,
  landing_page TEXT,
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  
  status VARCHAR(20) DEFAULT 'clicked',
  registered_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  
  program_id UUID REFERENCES programs(id),
  enrollment_id UUID REFERENCES user_program_enrollment(id),
  payment_amount DECIMAL(10,2),
  
  commission_amount DECIMAL(10,2) DEFAULT 0,
  commission_status VARCHAR(20) DEFAULT 'pending',
  commission_paid_at TIMESTAMPTZ,
  
  first_click_at TIMESTAMPTZ NOT NULL,
  last_click_at TIMESTAMPTZ NOT NULL,
  attribution_window INTEGER DEFAULT 30,
  
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_referral_affiliate (affiliate_id),
  INDEX idx_referral_user (referred_user_id),
  INDEX idx_referral_status (status),
  INDEX idx_referral_commission (commission_status)
);

CREATE TABLE commission_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  affiliate_id UUID REFERENCES affiliates(id),
  
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  
  referral_ids UUID[] NOT NULL,
  referral_count INTEGER NOT NULL,
  
  payment_method VARCHAR(20) NOT NULL,
  payment_details JSONB,
  
  status VARCHAR(20) DEFAULT 'pending',
  paid_at TIMESTAMPTZ,
  transaction_id VARCHAR(100),
  
  notes TEXT,
  
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_payout_affiliate (affiliate_id),
  INDEX idx_payout_status (status)
);
```

### 7.4 API Endpoints
```typescript
// Affiliate management (admin)
GET    /api/v1/admin/affiliates
POST   /api/v1/admin/affiliates
GET    /api/v1/admin/affiliates/:id
PATCH  /api/v1/admin/affiliates/:id
DELETE /api/v1/admin/affiliates/:id
GET    /api/v1/admin/affiliates/:id/referrals
GET    /api/v1/admin/affiliates/:id/stats

// Referrals (admin)
GET    /api/v1/admin/referrals
GET    /api/v1/admin/referrals/:id
PATCH  /api/v1/admin/referrals/:id/commission

// Payouts (admin)
GET    /api/v1/admin/payouts
POST   /api/v1/admin/payouts
GET    /api/v1/admin/payouts/:id
PATCH  /api/v1/admin/payouts/:id/process
GET    /api/v1/admin/payouts/pending

// Affiliate dashboard (user)
GET    /api/v1/affiliate/dashboard
GET    /api/v1/affiliate/referrals
GET    /api/v1/affiliate/payouts
GET    /api/v1/affiliate/materials      # Marketing materials

// Tracking
GET    /api/v1/ref/:code                # Redirect with tracking
POST   /api/v1/referral/track           # Track click
```

### 7.5 UI Components
```
/admin/affiliates
├── AffiliateList.tsx
├── AffiliateDetail.tsx
├── AffiliateForm.tsx
├── ReferralList.tsx
├── CommissionManager.tsx
├── PayoutProcessor.tsx
├── AffiliateStats.tsx
└── Leaderboard.tsx

/affiliate (user portal)
├── AffiliateDashboard.tsx
├── ReferralLink.tsx
├── ReferralStats.tsx
├── CommissionHistory.tsx
├── PayoutHistory.tsx
└── MarketingMaterials.tsx
```

---

## 8. AUDIT & COMPLIANCE

### 8.1 Overview

Complete audit trail and GDPR compliance tools.

### 8.2 Data Model
```typescript
interface AuditLog {
  id: string;
  
  // Actor
  actorId: string;
  actorType: 'user' | 'admin' | 'system' | 'api';
  actorName: string;
  actorIp: string;
  
  // Action
  action: string;                   // CREATE, UPDATE, DELETE, ACCESS, LOGIN, etc.
  entityType: string;               // user, program, payment, etc.
  entityId: string;
  
  // Details
  description: string;
  oldValue: any;
  newValue: any;
  changes: { field: string; old: any; new: any }[];
  
  // Context
  requestId: string;
  userAgent: string;
  endpoint: string;
  method: string;
  
  // Metadata
  severity: 'low' | 'medium' | 'high';
  category: 'data' | 'security' | 'admin' | 'payment' | 'auth';
  
  createdAt: Date;
}

interface GDPRRequest {
  id: string;
  userId: string;
  userEmail: string;
  
  requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  
  requestedAt: Date;
  dueDate: Date;                    // 30 days from request
  completedAt: Date | null;
  
  processedBy: string | null;
  notes: string;
  
  // For data access/portability
  exportUrl: string | null;
  exportExpiresAt: Date | null;
}
```

### 8.3 Database Schema
```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  actor_id UUID,
  actor_type VARCHAR(20) NOT NULL,
  actor_name VARCHAR(255),
  actor_ip INET,
  
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id UUID,
  
  description TEXT,
  old_value JSONB,
  new_value JSONB,
  changes JSONB,
  
  request_id VARCHAR(100),
  user_agent TEXT,
  endpoint VARCHAR(255),
  method VARCHAR(10),
  
  severity VARCHAR(20) DEFAULT 'low',
  category VARCHAR(50),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_audit_actor (actor_id, created_at),
  INDEX idx_audit_entity (entity_type, entity_id),
  INDEX idx_audit_action (action, created_at),
  INDEX idx_audit_severity (severity) WHERE severity != 'low',
  INDEX idx_audit_date (created_at)
);

-- Partition by month for performance
CREATE TABLE audit_logs_partitioned (
  LIKE audit_logs INCLUDING ALL
) PARTITION BY RANGE (created_at);

CREATE TABLE gdpr_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  user_email VARCHAR(255) NOT NULL,
  
  request_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  due_date TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  
  processed_by UUID REFERENCES users(id),
  notes TEXT,
  
  export_url TEXT,
  export_expires_at TIMESTAMPTZ,
  
  INDEX idx_gdpr_user (user_id),
  INDEX idx_gdpr_status (status),
  INDEX idx_gdpr_due (due_date) WHERE status = 'pending'
);

CREATE TABLE data_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type VARCHAR(50) NOT NULL UNIQUE,
  retention_days INTEGER NOT NULL,
  anonymize_fields TEXT[],
  delete_completely BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  last_cleanup_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 8.4 Audit Events

| Category | Actions Logged |
|----------|---------------|
| Auth | login, logout, login_failed, password_change, mfa_enable |
| Admin | user_create, user_update, user_delete, role_change, permission_change |
| Data | profile_update, data_export, data_delete |
| Payment | payment_received, refund_issued, payment_failed, manual_adjustment |
| Program | enrollment, unenrollment, progress_reset, access_grant, access_revoke |
| Security | api_key_create, api_key_revoke, suspicious_activity |
| System | config_change, maintenance_mode, backup_created |

### 8.5 API Endpoints
```typescript
// Audit logs
GET    /api/v1/admin/audit/logs
GET    /api/v1/admin/audit/logs/:entityType/:entityId
GET    /api/v1/admin/audit/user/:userId
GET    /api/v1/admin/audit/export

// GDPR
GET    /api/v1/admin/gdpr/requests
POST   /api/v1/admin/gdpr/requests/:id/process
POST   /api/v1/admin/gdpr/export/:userId
POST   /api/v1/admin/gdpr/anonymize/:userId
GET    /api/v1/admin/gdpr/retention-policies
PATCH  /api/v1/admin/gdpr/retention-policies/:id

// User-facing GDPR
POST   /api/v1/gdpr/request
GET    /api/v1/gdpr/my-data
```

---

## 9. GAMIFICATION SYSTEM

### 9.1 Overview

Engagement through points, badges, streaks, and leaderboards.

### 9.2 Data Model
```typescript
interface GamificationProfile {
  userId: string;
  
  // Points
  totalPoints: number;
  currentPoints: number;            // Can be spent
  lifetimePoints: number;
  
  // Level
  level: number;
  levelName: string;
  xpToNextLevel: number;
  currentXp: number;
  
  // Streaks
  loginStreak: number;
  bestLoginStreak: number;
  lastLoginDate: Date;
  
  progressStreak: number;           // Days making progress
  bestProgressStreak: number;
  
  // Badges
  badges: UserBadge[];
  
  // Leaderboard
  weeklyRank: number;
  monthlyRank: number;
  allTimeRank: number;
}

interface Badge {
  id: string;
  code: string;                     // unique identifier
  name: string;
  description: string;
  icon: string;
  category: 'progress' | 'engagement' | 'achievement' | 'special';
  
  // Unlock criteria
  criteria: {
    type: 'count' | 'streak' | 'completion' | 'event';
    field: string;
    operator: 'gte' | 'eq';
    value: number;
  };
  
  // Rewards
  pointsAwarded: number;
  isRare: boolean;
  
  // Display
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
}

interface UserBadge {
  badgeId: string;
  badge: Badge;
  earnedAt: Date;
  progress: number;                 // For progressive badges
  notified: boolean;
}

interface PointTransaction {
  id: string;
  userId: string;
  
  points: number;                   // Can be negative for spending
  type: 'earned' | 'spent' | 'bonus' | 'adjustment';
  reason: string;
  
  sourceType: string;               // video_completed, quiz_passed, etc.
  sourceId: string;
  
  createdAt: Date;
}
```

### 9.3 Point Rules
```typescript
const POINT_RULES = {
  // Daily activities
  daily_login: { points: 5, maxPerDay: 1 },
  video_completed: { points: 10, maxPerDay: 20 },
  activity_completed: { points: 15, maxPerDay: 10 },
  quiz_passed: { points: 25, maxPerDay: 5 },
  
  // Progress milestones
  week_completed: { points: 100 },
  program_25_percent: { points: 200 },
  program_50_percent: { points: 300 },
  program_75_percent: { points: 400 },
  program_completed: { points: 1000 },
  
  // Achievements
  first_login: { points: 50 },
  profile_completed: { points: 100 },
  inner_dna_completed: { points: 250 },
  certification_earned: { points: 500 },
  
  // Streaks
  streak_7_days: { points: 100 },
  streak_30_days: { points: 500 },
  streak_100_days: { points: 2000 },
  
  // Social
  referral_signup: { points: 100 },
  referral_paid: { points: 500 },
};
```

### 9.4 Level System
```typescript
const LEVELS = [
  { level: 1, name: 'Newcomer', xpRequired: 0 },
  { level: 2, name: 'Explorer', xpRequired: 100 },
  { level: 3, name: 'Learner', xpRequired: 300 },
  { level: 4, name: 'Achiever', xpRequired: 600 },
  { level: 5, name: 'Dedicated', xpRequired: 1000 },
  { level: 6, name: 'Advanced', xpRequired: 1500 },
  { level: 7, name: 'Expert', xpRequired: 2500 },
  { level: 8, name: 'Master', xpRequired: 4000 },
  { level: 9, name: 'Champion', xpRequired: 6000 },
  { level: 10, name: 'Legend', xpRequired: 10000 },
];
```

### 9.5 Default Badges
```typescript
const BADGES = [
  // Progress
  { code: 'first_step', name: 'First Step', tier: 'bronze', criteria: { type: 'count', field: 'stepsCompleted', value: 1 } },
  { code: 'week_warrior', name: 'Week Warrior', tier: 'silver', criteria: { type: 'count', field: 'weeksCompleted', value: 5 } },
  { code: 'program_graduate', name: 'Program Graduate', tier: 'gold', criteria: { type: 'completion', field: 'program', value: 1 } },
  
  // Engagement
  { code: 'regular', name: 'Regular', tier: 'bronze', criteria: { type: 'streak', field: 'loginStreak', value: 7 } },
  { code: 'dedicated', name: 'Dedicated', tier: 'silver', criteria: { type: 'streak', field: 'loginStreak', value: 30 } },
  { code: 'unstoppable', name: 'Unstoppable', tier: 'gold', criteria: { type: 'streak', field: 'loginStreak', value: 100 } },
  
  // Achievement
  { code: 'certified', name: 'Certified Coach', tier: 'platinum', criteria: { type: 'event', field: 'certification', value: 1 } },
  { code: 'personality_explorer', name: 'Know Thyself', tier: 'silver', criteria: { type: 'completion', field: 'innerDna', value: 1 } },
  
  // Special
  { code: 'early_adopter', name: 'Early Adopter', tier: 'gold', criteria: { type: 'event', field: 'earlySignup', value: 1 } },
  { code: 'ambassador', name: 'Ambassador', tier: 'platinum', criteria: { type: 'count', field: 'referrals', value: 10 } },
];
```

### 9.6 Database Schema
```sql
CREATE TABLE gamification_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) UNIQUE,
  
  total_points INTEGER DEFAULT 0,
  current_points INTEGER DEFAULT 0,
  lifetime_points INTEGER DEFAULT 0,
  
  level INTEGER DEFAULT 1,
  current_xp INTEGER DEFAULT 0,
  
  login_streak INTEGER DEFAULT 0,
  best_login_streak INTEGER DEFAULT 0,
  last_login_date DATE,
  
  progress_streak INTEGER DEFAULT 0,
  best_progress_streak INTEGER DEFAULT 0,
  
  weekly_rank INTEGER,
  monthly_rank INTEGER,
  all_time_rank INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_gamification_user (user_id),
  INDEX idx_gamification_rank (all_time_rank)
);

CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  category VARCHAR(50),
  criteria JSONB NOT NULL,
  points_awarded INTEGER DEFAULT 0,
  is_rare BOOLEAN DEFAULT false,
  tier VARCHAR(20),
  display_order INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  badge_id UUID REFERENCES badges(id),
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  progress INTEGER DEFAULT 0,
  notified BOOLEAN DEFAULT false,
  
  UNIQUE(user_id, badge_id),
  INDEX idx_user_badges (user_id)
);

CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  points INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL,
  reason VARCHAR(255),
  source_type VARCHAR(50),
  source_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_point_user (user_id, created_at)
);

CREATE TABLE leaderboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  period_type VARCHAR(20) NOT NULL,  -- weekly, monthly
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  rankings JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_leaderboard_period (period_type, period_start)
);
```

### 9.7 API Endpoints
```typescript
// User endpoints
GET    /api/v1/gamification/profile
GET    /api/v1/gamification/badges
GET    /api/v1/gamification/points
GET    /api/v1/gamification/leaderboard
GET    /api/v1/gamification/achievements

// Admin endpoints
GET    /api/v1/admin/gamification/badges
POST   /api/v1/admin/gamification/badges
PATCH  /api/v1/admin/gamification/badges/:id
DELETE /api/v1/admin/gamification/badges/:id
POST   /api/v1/admin/gamification/points/award
POST   /api/v1/admin/gamification/badges/award
GET    /api/v1/admin/gamification/leaderboard
GET    /api/v1/admin/gamification/stats
```

### 9.8 UI Components
```
/gamification (user)
├── ProgressBar.tsx                # Level progress
├── PointsDisplay.tsx              # Current/total points
├── BadgeGrid.tsx                  # Earned badges
├── StreakTracker.tsx              # Login/progress streaks
├── Leaderboard.tsx                # Weekly/monthly rankings
├── AchievementsList.tsx           # All achievements
└── RewardsStore.tsx               # Spend points (future)

/admin/gamification
├── BadgeManager.tsx
├── PointsAdjustment.tsx
├── LeaderboardAdmin.tsx
└── GamificationStats.tsx
```

---

## 10. AI COACH ASSISTANT

### 10.1 Overview

24/7 AI-powered coaching companion integrated throughout the platform.

### 10.2 Capabilities
```typescript
interface AICoachCapabilities {
  // Knowledge
  programContent: true;             // Answers about course content
  iyctMethodology: true;            // Explains coaching concepts
  practiceTools: true;              // Guides through tools
  
  // Personalization
  personalityAware: true;           // Uses Inner DNA insights
  progressAware: true;              // Knows user's journey
  contextAware: true;               // Current page/step context
  
  // Coaching
  encouragement: true;              // Motivational support
  goalSetting: true;                // Help set/track goals
  reflection: true;                 // Guide reflections
  
  // Practical
  navigation: true;                 // Help find content
  techSupport: true;                // Basic tech help
  scheduling: true;                 // Suggest study times
}
```

### 10.3 Conversation Flow
```typescript
interface CoachConversation {
  id: string;
  userId: string;
  
  // Context
  context: {
    currentPage: string;
    currentProgram?: string;
    currentStep?: string;
    personalityType?: number;
    progressPercent?: number;
    recentActivity?: string[];
  };
  
  // Messages
  messages: {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    metadata?: {
      suggestions?: string[];       // Follow-up suggestions
      actions?: string[];           // Clickable actions
      resourceLinks?: string[];     // Relevant links
    };
  }[];
  
  // Session
  startedAt: Date;
  lastMessageAt: Date;
  messageCount: number;
  
  // Feedback
  helpful: boolean | null;
  feedback: string | null;
}
```

### 10.4 System Prompt Template
```typescript
const AI_COACH_SYSTEM_PROMPT = `
You are an AI coaching assistant for IYCT (Incredible You Coaching Training).

## Your Identity
- Name: IYCT Coach
- Style: Warm, encouraging, professional
- Approach: Socratic questioning, growth mindset

## User Context
- Name: {{userName}}
- Personality Type: {{personalityType}} ({{typeName}})
- Current Program: {{programName}}
- Progress: {{progressPercent}}%
- Current Page: {{currentPage}}

## Your Knowledge
- All IYCT program content
- Wheel of Life methodology
- Inner DNA personality system
- N-codes and E-codes
- INCRED goal framework
- Practice tools usage

## Guidelines
1. Keep responses concise (under 150 words unless explaining complex concepts)
2. Reference user's personality type for personalized advice
3. Encourage without being preachy
4. Ask clarifying questions when needed
5. Suggest specific next actions
6. Never provide medical, legal, or financial advice
7. Escalate to human support when appropriate

## Personality-Specific Adjustments
{{personalityGuidelines}}

## Current Session Goal
Help the user with their immediate question while keeping them engaged with their learning journey.
`;
```

### 10.5 Database Schema
```sql
CREATE TABLE coach_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  
  context JSONB,
  
  started_at TIMESTAMPTZ DEFAULT NOW(),
  last_message_at TIMESTAMPTZ DEFAULT NOW(),
  message_count INTEGER DEFAULT 0,
  
  helpful BOOLEAN,
  feedback TEXT,
  
  INDEX idx_coach_user (user_id, last_message_at)
);

CREATE TABLE coach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES coach_conversations(id) ON DELETE CASCADE,
  
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  
  tokens_used INTEGER,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_coach_messages (conversation_id, created_at)
);

CREATE TABLE coach_knowledge_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL,
  topic VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  keywords TEXT[],
  program_id UUID REFERENCES programs(id),
  embedding VECTOR(1536),           -- For semantic search
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_kb_category (category),
  INDEX idx_kb_program (program_id)
);
```

### 10.6 API Endpoints
```typescript
// Chat endpoints
POST   /api/v1/coach/chat
       Body: { message, conversationId?, context? }
       Returns: { response, suggestions, actions, conversationId }

GET    /api/v1/coach/conversations
GET    /api/v1/coach/conversations/:id
POST   /api/v1/coach/conversations/:id/feedback
DELETE /api/v1/coach/conversations/:id

// Admin
GET    /api/v1/admin/coach/stats
GET    /api/v1/admin/coach/conversations
GET    /api/v1/admin/coach/knowledge-base
POST   /api/v1/admin/coach/knowledge-base
PATCH  /api/v1/admin/coach/knowledge-base/:id
```

### 10.7 UI Components
```
/components/coach
├── CoachChatWidget.tsx            # Floating chat button/panel
├── CoachChatWindow.tsx            # Full chat interface
├── MessageBubble.tsx              # Individual messages
├── SuggestionChips.tsx            # Quick replies
├── ActionButtons.tsx              # Clickable actions
├── TypingIndicator.tsx            # AI thinking state
├── FeedbackPrompt.tsx             # Was this helpful?
└── CoachAvatar.tsx                # Animated avatar

/admin/coach
├── ConversationViewer.tsx
├── KnowledgeBaseEditor.tsx
├── CoachStats.tsx
└── ResponseQualityReview.tsx
```

### 10.8 Cost Control
```typescript
const AI_COACH_LIMITS = {
  maxMessagesPerDay: 50,            // Per user
  maxTokensPerMessage: 500,
  maxConversationLength: 20,        // Messages before new conversation
  
  model: 'claude-3-haiku',          // Cost-effective
  fallbackModel: 'claude-3-sonnet', // For complex queries
  
  cacheCommonResponses: true,
  cacheDurationHours: 24,
};
```

---

## 📋 COMPLETE NEW ASSISTANT HANDOFF PROTOCOL

### Required Reading List

Every new assistant MUST read these files in order before making any changes:
```
PRIORITY 1 - CORE MASTER PLANS (Read First)
├── /mnt/project/EXECUTIVE_SUMMARY.md
├── /mnt/project/PROJECT_MASTER_PLAN.md
├── /mnt/project/PROJECT_MASTER_PLAN_PART2.md

PRIORITY 2 - FEATURE ADDITIONS
├── /mnt/project/ADMIN_PANEL_MASTER_PLAN_ADDITION.md
├── /mnt/project/AI_ENHANCED_ADMIN_ADDITION.md
├── /mnt/project/SMART_ACCOUNTING_SYSTEM_ADDITION.md
├── /mnt/project/INNER_DNA_SYSTEM_ADDITION.md
├── /mnt/project/TWO_SYSTEM_ARCHITECTURE_ADDITION.md (if exists)
├── docs/ADVANCED_PLATFORM_FEATURES_ADDITION.md (this document)

PRIORITY 3 - SESSION HANDOFFS (Most Recent First)
├── /mnt/project/SESSION16_COMPLETE_HANDOFF.md
├── /mnt/project/SESSION16_HANDOFF.md
├── /mnt/project/SESSION15_COMPLETE_HANDOFF.md
└── (earlier session handoffs as needed)

PRIORITY 4 - DATA REFERENCES
├── docs/prompt3_program_content_COMPLETE.json
├── docs/COMPLETE_INNER_DNA_EXPORT.md
├── docs/MULTI_LANGUAGE_AND_AI_COMPLETE.md
└── docs/PROGRAMS_DISCOVERY_REPORT.md (if exists)
```

### Handoff Template

Every session handoff must include:
```markdown
# SESSION [N] COMPLETE HANDOFF

## REQUIRED READING FOR NEW ASSISTANT
[List all master plan files with full paths]

## CURRENT STATE
- Backend: [running/stopped] at localhost:3001
- Frontend: [running/stopped] at localhost:3000
- Database: [X] programs, [X] weeks, [X] steps

## WHAT WAS COMPLETED THIS SESSION
[Bullet list with specific changes]

## FILES MODIFIED
[Full paths to all changed files]

## KNOWN BUGS/ISSUES
[Any unresolved issues]

## NEXT STEPS (Per Master Plan)
[What should be done next, with master plan references]

## CRITICAL RULES
1. User works LOCALLY at ~/Desktop/iyct-platform/
2. DO NOT create files in sandbox
3. Use sed for small edits, not full rewrites
4. Reference master plans for every change
5. Test after every change

## TERMINAL COMMANDS TO START
[Exact commands to get platform running]
```

---

## 🔗 INTEGRATION CHECKLIST

Before implementing any feature from this document:

- [ ] Core PHP replica is complete (all master plan phases)
- [ ] Admin Panel MVP is working
- [ ] Database is fully seeded (33+ programs)
- [ ] User authentication is complete
- [ ] Progress tracking is working
- [ ] Payment system is integrated
- [ ] Inner DNA assessment is functional
- [ ] AI Enhanced Admin is operational

---

## 📈 SUCCESS METRICS

| Feature | Primary Metric | Target |
|---------|---------------|--------|
| MIS Reports | Admin time saved | 50% reduction |
| Content Analytics | Content improvement rate | 20% completion increase |
| Coach Dashboard | Support efficiency | 40% faster issue resolution |
| Support Tickets | First response time | <4 hours |
| Engagement System | User retention | 30% improvement |
| Communication Center | Email open rate | >40% |
| Referral System | Referral conversion | >10% |
| Audit System | Compliance score | 100% |
| Gamification | Daily active users | 50% increase |
| AI Coach | User satisfaction | >4.5/5 |

---

**END OF ADVANCED PLATFORM FEATURES ADDITION**

**Implementation Order:** Only after all core master plan phases complete  
**Total Timeline:** 8-10 weeks  
**Total New Tables:** 25+  
**Total New Endpoints:** 150+  
**Priority:** HIGH (Competitive differentiation)
