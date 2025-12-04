# SMART ACCOUNTING & PAYMENT SYSTEM ADDITION

**Document:** Addition to PROJECT_MASTER_PLAN.md  
**Date:** December 5, 2025  
**Purpose:** Comprehensive payment tracking, installment management, and AI-powered accounting

---

## 🎯 PROBLEM STATEMENT

**Current Issues:**
1. Missing installment payments - no automated tracking/reminders
2. Multiple payment methods not unified (card, bank, crypto)
3. Manual reconciliation required
4. No predictive insights on payment behavior
5. Difficult to get financial overview at a glance

**Solution:** Smart accounting system with AI-powered insights, automated reminders, and unified payment tracking across all methods.

---

## 💳 PAYMENT METHODS SUPPORTED

| Method | Provider | Use Case | Auto-Reconcile |
|--------|----------|----------|----------------|
| Credit/Debit Card | Stripe | International | ✅ Yes (webhook) |
| Credit/Debit Card | Cashfree | India/UAE | ✅ Yes (webhook) |
| Bank Transfer | Manual Entry | Large payments | ❌ Manual verify |
| Crypto | Coinbase Commerce / Manual | Tech-savvy users | ⚠️ Semi-auto |
| UPI | Cashfree | India only | ✅ Yes (webhook) |

---

## 🗄️ DATABASE SCHEMA ADDITIONS

### Payment Plans (Enhanced)

```sql
-- Enhanced pricing_plans table
ALTER TABLE pricing_plans ADD COLUMN IF NOT EXISTS (
  -- Installment details
  installment_amounts JSONB,        -- [1000, 1000, 1000] for custom amounts
  installment_due_days INTEGER[],   -- [0, 30, 60] days from enrollment
  late_fee_percentage DECIMAL(5,2), -- 5.00 = 5% late fee
  grace_period_days INTEGER DEFAULT 3,
  
  -- Discounts
  early_payment_discount DECIMAL(5,2), -- % discount for early full payment
  
  -- Restrictions
  max_failed_payments INTEGER DEFAULT 3,
  access_suspended_on_default BOOLEAN DEFAULT true
);
```

### Payment Schedules (NEW)

```sql
CREATE TABLE payment_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES user_program_enrollment(id),
  user_id UUID REFERENCES users(id),
  plan_id UUID REFERENCES pricing_plans(id),
  
  -- Schedule details
  installment_number INTEGER NOT NULL,
  total_installments INTEGER NOT NULL,
  
  -- Amounts
  amount_due DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  late_fee DECIMAL(10,2) DEFAULT 0,
  total_due DECIMAL(10,2) GENERATED ALWAYS AS (amount_due + late_fee) STORED,
  
  -- Dates
  due_date DATE NOT NULL,
  grace_period_end DATE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending', -- pending, paid, overdue, defaulted, waived
  paid_at TIMESTAMPTZ,
  payment_id UUID REFERENCES payments(id),
  
  -- Reminders
  reminder_sent_at TIMESTAMPTZ[],  -- Track all reminders sent
  last_reminder_at TIMESTAMPTZ,
  
  -- Metadata
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_user_schedules (user_id),
  INDEX idx_enrollment_schedules (enrollment_id),
  INDEX idx_due_date (due_date),
  INDEX idx_status (status),
  INDEX idx_overdue (status, due_date) WHERE status = 'pending'
);
```

### Bank Transfers (NEW)

```sql
CREATE TABLE bank_transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  schedule_id UUID REFERENCES payment_schedules(id),
  
  -- Transfer details
  amount DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) NOT NULL,
  
  -- Bank info
  sender_bank VARCHAR(255),
  sender_account_last4 VARCHAR(4),
  reference_number VARCHAR(100),
  transfer_date DATE,
  
  -- Proof
  proof_url TEXT,                    -- Screenshot/PDF upload
  proof_uploaded_at TIMESTAMPTZ,
  
  -- Verification
  status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Matching
  matched_to_payment_id UUID REFERENCES payments(id),
  auto_matched BOOLEAN DEFAULT false,
  match_confidence DECIMAL(3,2),     -- 0.00 to 1.00
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  INDEX idx_user_transfers (user_id),
  INDEX idx_reference (reference_number),
  INDEX idx_pending_transfers (status) WHERE status = 'pending'
);
```

### Crypto Payments (NEW)

```sql
CREATE TABLE crypto_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  schedule_id UUID REFERENCES payment_schedules(id),
  
  -- Crypto details
  amount_crypto DECIMAL(18,8) NOT NULL,
  crypto_currency VARCHAR(10) NOT NULL, -- BTC, ETH, USDT, USDC
  amount_usd DECIMAL(10,2),             -- USD equivalent at time
  exchange_rate DECIMAL(18,8),
  
  -- Wallet info
  wallet_address VARCHAR(255),
  transaction_hash VARCHAR(255),
  network VARCHAR(50),                  -- ethereum, bitcoin, polygon
  
  -- Verification
  confirmations INTEGER DEFAULT 0,
  required_confirmations INTEGER DEFAULT 3,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirming, confirmed, failed
  
  -- Provider
  provider VARCHAR(50),                 -- coinbase, manual
  provider_payment_id VARCHAR(255),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  
  INDEX idx_tx_hash (transaction_hash),
  INDEX idx_wallet (wallet_address),
  INDEX idx_status (status)
);
```

### Payment Reminders Log (NEW)

```sql
CREATE TABLE payment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID REFERENCES payment_schedules(id),
  user_id UUID REFERENCES users(id),
  
  -- Reminder details
  reminder_type VARCHAR(50) NOT NULL, -- upcoming, due_today, overdue_1, overdue_7, final_notice
  channel VARCHAR(20) NOT NULL,       -- email, sms, whatsapp, in_app
  
  -- Content
  subject TEXT,
  message TEXT,
  
  -- Delivery
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  opened_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,
  
  -- Response
  resulted_in_payment BOOLEAN DEFAULT false,
  payment_id UUID REFERENCES payments(id),
  
  INDEX idx_schedule_reminders (schedule_id),
  INDEX idx_user_reminders (user_id),
  INDEX idx_type (reminder_type)
);
```

### Financial Summary Cache (NEW)

```sql
CREATE TABLE financial_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date DATE NOT NULL UNIQUE,
  
  -- Revenue
  total_revenue DECIMAL(12,2),
  revenue_by_currency JSONB,          -- {"USD": 5000, "INR": 100000}
  revenue_by_method JSONB,            -- {"card": 4000, "bank": 800, "crypto": 200}
  revenue_by_program JSONB,           -- {"prog_id": 3000, ...}
  
  -- Receivables
  total_receivables DECIMAL(12,2),
  overdue_amount DECIMAL(12,2),
  overdue_count INTEGER,
  
  -- Installments
  installments_due_today DECIMAL(12,2),
  installments_due_this_week DECIMAL(12,2),
  installments_due_this_month DECIMAL(12,2),
  
  -- Collections
  collection_rate DECIMAL(5,2),       -- % of due amounts collected
  avg_days_to_payment DECIMAL(5,1),
  
  -- Predictions (AI-generated)
  predicted_revenue_next_month DECIMAL(12,2),
  predicted_defaults DECIMAL(12,2),
  at_risk_amount DECIMAL(12,2),
  
  -- Metadata
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  ai_insights JSONB,
  
  INDEX idx_summary_date (summary_date DESC)
);
```

---

## 📊 ACCOUNTING DASHBOARD

### Overview Cards

```
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Total Revenue   │ │ This Month      │ │ Outstanding     │ │ Overdue         │
│ $245,000        │ │ $32,500         │ │ $18,200         │ │ $4,500 ⚠️       │
│ ↑ 12% vs last   │ │ 85% of target   │ │ 45 installments │ │ 12 users        │
└─────────────────┘ └─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Key Features

1. **Revenue Charts**
   - Daily/Weekly/Monthly/Yearly views
   - By program breakdown
   - By payment method
   - By currency
   - Comparison with previous periods

2. **Receivables Aging**
   ```
   Current (not due):     $10,000 (55%)
   1-7 days overdue:      $3,000  (17%)
   8-30 days overdue:     $2,500  (14%)
   31-60 days overdue:    $1,500  (8%)
   60+ days overdue:      $1,200  (6%) ⚠️
   ```

3. **Installment Calendar**
   - Visual calendar showing due dates
   - Color-coded by status
   - Click to see user details
   - Quick actions (send reminder, record payment)

4. **Payment Method Breakdown**
   - Pie chart of payment methods
   - Success rates by method
   - Processing fees by method
   - Recommendations

---

## ⏰ AUTOMATED REMINDER SYSTEM

### Reminder Schedule

| Trigger | Timing | Channel | Template |
|---------|--------|---------|----------|
| Upcoming | 7 days before | Email | "Your payment of $X is due on DATE" |
| Upcoming | 3 days before | Email + SMS | "Reminder: Payment due in 3 days" |
| Due Today | Day of | Email + SMS + WhatsApp | "Payment due today" |
| Grace Period | 1 day after | Email | "Your payment is 1 day overdue" |
| Overdue | 3 days after | Email + SMS | "Payment overdue - please pay to avoid late fee" |
| Overdue | 7 days after | Email + SMS + Call | "Urgent: Payment 7 days overdue" |
| Final Notice | 14 days after | Email + SMS | "Final notice before access suspension" |
| Suspension | 21 days after | Email | "Access suspended - pay to restore" |

### Reminder Templates (AI-Enhanced)

```typescript
interface ReminderTemplate {
  id: string;
  type: 'upcoming' | 'due' | 'overdue' | 'final' | 'suspension';
  channel: 'email' | 'sms' | 'whatsapp';
  subject: string;
  body: string;
  variables: string[];  // ['{{name}}', '{{amount}}', '{{due_date}}', '{{program}}']
  aiPersonalization: boolean;  // Use AI to personalize tone
}
```

### Smart Reminder Logic

```typescript
// AI decides best time and channel based on user behavior
interface SmartReminderDecision {
  userId: string;
  scheduleId: string;
  
  // AI recommendations
  bestChannel: 'email' | 'sms' | 'whatsapp';
  bestTime: string;  // "09:00 AM local time"
  urgencyLevel: 'low' | 'medium' | 'high';
  personalizedMessage: string;
  
  // Reasoning
  factors: {
    previousResponseRate: number;
    preferredChannel: string;
    paymentHistory: 'good' | 'average' | 'poor';
    engagementPattern: string;
  };
}
```

---

## 🏦 BANK TRANSFER WORKFLOW

### User Flow

```
1. User selects "Bank Transfer" at checkout
2. System shows bank details + unique reference code
3. User makes transfer with reference code
4. User uploads proof (screenshot/PDF)
5. Admin verifies OR AI auto-matches
6. Payment confirmed, access granted
```

### Admin Verification UI

```
┌─────────────────────────────────────────────────────────────┐
│ Bank Transfer Verification                                  │
├─────────────────────────────────────────────────────────────┤
│ User: John Smith (john@email.com)                          │
│ Program: Mind Hacker Coach Training                         │
│ Amount Due: $1,000 USD                                      │
│ Reference: IYCT-2024-ABC123                                 │
├─────────────────────────────────────────────────────────────┤
│ Submitted Details:                                          │
│ • Transfer Date: Dec 1, 2024                               │
│ • Amount: $1,000                                           │
│ • Reference: IYCT-2024-ABC123 ✅ Match                     │
│ • Bank: Chase Bank                                          │
│                                                             │
│ [View Proof Image]                                          │
│                                                             │
│ AI Confidence: 95% ✅                                       │
│ Reason: Reference matches, amount matches, date reasonable  │
├─────────────────────────────────────────────────────────────┤
│ [✅ Approve]  [❌ Reject]  [📝 Request More Info]           │
└─────────────────────────────────────────────────────────────┘
```

### Auto-Match Algorithm

```typescript
interface BankTransferMatcher {
  // Input
  transfer: {
    amount: number;
    reference: string;
    date: Date;
    proofUrl: string;
  };
  
  // Matching criteria
  matchAgainst: PaymentSchedule[];
  
  // Output
  match: {
    scheduleId: string;
    confidence: number;  // 0-1
    factors: {
      referenceMatch: boolean;
      amountMatch: boolean;  // Within 1% tolerance
      dateReasonable: boolean;  // Within 7 days of due date
      userMatch: boolean;  // Same user who owes
    };
    requiresManualReview: boolean;
  };
}
```

---

## 🪙 CRYPTO PAYMENT WORKFLOW

### Supported Cryptocurrencies

| Currency | Network | Min Confirmations | Processing Time |
|----------|---------|-------------------|-----------------|
| BTC | Bitcoin | 3 | ~30 min |
| ETH | Ethereum | 12 | ~3 min |
| USDT | Ethereum/Tron | 12/20 | ~3 min |
| USDC | Ethereum/Polygon | 12/30 | ~3 min |

### User Flow

```
1. User selects "Pay with Crypto"
2. System generates unique wallet address OR payment link (Coinbase)
3. Shows amount in crypto + USD equivalent
4. User sends crypto
5. System monitors blockchain for confirmations
6. Once confirmed, payment recorded
7. Access granted
```

### Coinbase Commerce Integration

```typescript
// Create charge
const charge = await coinbaseCommerce.createCharge({
  name: 'Mind Hacker Coach Training - Installment 2',
  description: 'IYCT Program Payment',
  pricing_type: 'fixed_price',
  local_price: {
    amount: '1000.00',
    currency: 'USD'
  },
  metadata: {
    userId: 'user-uuid',
    scheduleId: 'schedule-uuid',
    programId: 'program-uuid'
  },
  redirect_url: 'https://hub.iyct.com/payment/success',
  cancel_url: 'https://hub.iyct.com/payment/cancel'
});

// Webhook handler
app.post('/webhooks/coinbase', (req, res) => {
  const event = req.body.event;
  
  if (event.type === 'charge:confirmed') {
    // Mark payment as complete
    await recordCryptoPayment({
      chargeId: event.data.id,
      amount: event.data.pricing.local.amount,
      crypto: event.data.payments[0].value.crypto,
      txHash: event.data.payments[0].transaction_id
    });
  }
});
```

---

## 🤖 AI-POWERED FEATURES

### 1. Payment Prediction

```typescript
interface PaymentPrediction {
  userId: string;
  scheduleId: string;
  
  // Predictions
  willPayOnTime: {
    probability: number;  // 0-1
    confidence: number;
  };
  
  expectedPaymentDate: Date;
  
  riskLevel: 'low' | 'medium' | 'high';
  
  // Factors
  factors: {
    paymentHistory: number;      // Historical on-time %
    engagementLevel: number;     // Course activity
    financialPattern: string;    // "pays early", "last minute", "often late"
    externalFactors: string[];   // "end of month", "holiday season"
  };
  
  // Recommendations
  recommendedAction: string;
  // e.g., "Send friendly reminder 5 days early - user typically pays when reminded"
}
```

### 2. Default Risk Detection

```typescript
interface DefaultRiskAlert {
  userId: string;
  riskScore: number;  // 0-100
  
  // Risk indicators
  indicators: {
    missedPayments: number;
    daysOverdue: number;
    loginFrequency: 'high' | 'low' | 'none';
    courseProgress: number;
    supportTickets: number;
    previousDefaults: number;
  };
  
  // AI recommendation
  recommendation: {
    action: 'monitor' | 'reach_out' | 'offer_plan' | 'escalate';
    message: string;
    suggestedPaymentPlan?: {
      newInstallments: number;
      newAmount: number;
    };
  };
}
```

### 3. Revenue Forecasting

```typescript
interface RevenueForecast {
  period: 'week' | 'month' | 'quarter';
  
  // Predictions
  expectedRevenue: {
    amount: number;
    currency: string;
    confidence: number;
  };
  
  breakdown: {
    scheduledInstallments: number;
    predictedNewEnrollments: number;
    predictedDefaults: number;
    atRiskPayments: number;
  };
  
  // Comparison
  vsLastPeriod: {
    change: number;
    changePercent: number;
  };
  
  // AI insights
  insights: string[];
  // ["December typically sees 15% drop due to holidays",
  //  "3 high-value installments due - recommend early outreach"]
}
```

### 4. Smart Collection Assistant

```typescript
interface CollectionAssistant {
  // For a specific overdue user
  userId: string;
  overdueAmount: number;
  daysOverdue: number;
  
  // AI-generated outreach strategy
  strategy: {
    bestChannel: 'email' | 'phone' | 'whatsapp';
    bestTime: string;
    tone: 'friendly' | 'firm' | 'urgent';
    
    suggestedScript: string;
    // "Hi [Name], I noticed your payment for Mind Hacker is 7 days overdue. 
    //  I wanted to check if everything's okay? If you're facing any difficulties,
    //  we can discuss a flexible payment arrangement. Let me know how I can help!"
    
    offerDiscount: boolean;
    discountAmount?: number;
    
    offerPaymentPlan: boolean;
    suggestedPlan?: {
      installments: number;
      perInstallment: number;
    };
  };
  
  // Predicted outcome
  recoveryProbability: number;
  expectedRecoveryDate: Date;
}
```

### 5. Financial Insights Dashboard

```typescript
interface AIFinancialInsights {
  generatedAt: Date;
  
  insights: {
    type: 'positive' | 'warning' | 'action' | 'info';
    icon: string;
    title: string;
    detail: string;
    impact?: string;
    suggestedAction?: string;
  }[];
  
  // Example insights:
  // ✅ "Collection rate improved to 94% this month (up from 89%)"
  // ⚠️ "5 users with >$500 overdue haven't logged in for 30+ days"
  // 💡 "Hindi program has 23% higher on-time payment rate - consider promoting"
  // 📊 "Crypto payments up 40% - consider adding more options"
  // ⏰ "3 high-value installments due Friday - send reminders Wednesday"
}
```

---

## 📱 API ENDPOINTS

### Payment Schedules

```typescript
// Admin endpoints
GET    /api/v1/admin/payments/schedules              // All schedules with filters
GET    /api/v1/admin/payments/schedules/overdue      // Overdue only
GET    /api/v1/admin/payments/schedules/upcoming     // Due in next 7 days
GET    /api/v1/admin/payments/schedules/:id          // Single schedule
PATCH  /api/v1/admin/payments/schedules/:id          // Update (waive, adjust)
POST   /api/v1/admin/payments/schedules/:id/remind   // Send manual reminder
POST   /api/v1/admin/payments/schedules/:id/waive    // Waive late fee
POST   /api/v1/admin/payments/schedules/:id/extend   // Extend due date
```

### Bank Transfers

```typescript
GET    /api/v1/admin/payments/bank-transfers         // All transfers
GET    /api/v1/admin/payments/bank-transfers/pending // Pending verification
POST   /api/v1/admin/payments/bank-transfers/:id/verify   // Approve
POST   /api/v1/admin/payments/bank-transfers/:id/reject   // Reject
POST   /api/v1/payments/bank-transfer                // User submits proof
```

### Crypto Payments

```typescript
POST   /api/v1/payments/crypto/create-charge         // Create payment
GET    /api/v1/payments/crypto/:id/status            // Check status
POST   /api/v1/webhooks/coinbase                     // Webhook handler
GET    /api/v1/admin/payments/crypto                 // Admin: all crypto payments
```

### AI Endpoints

```typescript
GET    /api/v1/admin/payments/ai/insights            // Financial insights
GET    /api/v1/admin/payments/ai/forecast            // Revenue forecast
GET    /api/v1/admin/payments/ai/at-risk             // At-risk payments
GET    /api/v1/admin/payments/ai/collection/:userId  // Collection strategy
POST   /api/v1/admin/payments/ai/predict/:scheduleId // Payment prediction
```

### Reports

```typescript
GET    /api/v1/admin/reports/revenue                 // Revenue report
GET    /api/v1/admin/reports/receivables             // AR aging report
GET    /api/v1/admin/reports/collections             // Collection performance
GET    /api/v1/admin/reports/payment-methods         // By method breakdown
GET    /api/v1/admin/reports/export                  // Export to CSV/Excel
```

---

## 🔔 NOTIFICATION SYSTEM

### Admin Notifications

| Event | Notification | Priority |
|-------|--------------|----------|
| Payment received | "Payment of $1000 received from John Smith" | Low |
| Bank transfer pending | "New bank transfer needs verification" | Medium |
| Crypto payment confirmed | "Crypto payment confirmed for $500" | Low |
| User 7+ days overdue | "John Smith is 7 days overdue on $1000" | High |
| User defaulted | "User defaulted - access suspended" | High |
| High-risk user | "AI flagged: Jane Doe high default risk" | Medium |

### User Notifications

| Event | Notification | Channel |
|-------|--------------|---------|
| Payment due soon | "Your payment of $X is due in 3 days" | Email, SMS |
| Payment successful | "Thank you! Your payment was received" | Email |
| Payment failed | "Payment failed - please try again" | Email, SMS |
| Overdue notice | "Your payment is X days overdue" | Email, SMS, WhatsApp |
| Access suspended | "Access suspended due to non-payment" | Email |
| Access restored | "Access restored - thank you for your payment" | Email |

---

## 📋 ADMIN UI COMPONENTS

### 1. Accounting Dashboard

```
/admin/accounting
├── Overview cards (revenue, outstanding, overdue)
├── Revenue chart (daily/weekly/monthly)
├── Receivables aging chart
├── Recent transactions list
├── AI insights panel
└── Quick actions (record payment, send reminder)
```

### 2. Installment Manager

```
/admin/accounting/installments
├── Filter bar (status, program, date range, amount)
├── Installment table
│   ├── User info
│   ├── Program
│   ├── Amount due
│   ├── Due date
│   ├── Status badge
│   ├── Actions (remind, waive, extend)
├── Bulk actions (send reminders, export)
└── Calendar view toggle
```

### 3. Bank Transfer Verification

```
/admin/accounting/bank-transfers
├── Pending transfers queue
├── Transfer detail modal
│   ├── User info
│   ├── Expected payment details
│   ├── Submitted proof viewer
│   ├── AI match confidence
│   ├── Approve/Reject buttons
└── Verified transfers history
```

### 4. Crypto Payments

```
/admin/accounting/crypto
├── Pending confirmations
├── Confirmed payments
├── Wallet addresses generated
└── Transaction explorer links
```

### 5. Collection Center

```
/admin/accounting/collections
├── At-risk users list
├── Overdue users list
├── AI recommendations panel
├── Collection scripts
├── Payment plan creator
└── Success metrics
```

---

## ⚙️ BACKGROUND JOBS

### Daily Jobs

```typescript
// Run at 6 AM daily
const dailyPaymentJobs = [
  {
    name: 'check-overdue-payments',
    schedule: '0 6 * * *',
    action: 'Mark pending payments as overdue if past due date'
  },
  {
    name: 'send-due-today-reminders',
    schedule: '0 8 * * *',
    action: 'Send reminders for payments due today'
  },
  {
    name: 'send-overdue-reminders',
    schedule: '0 9 * * *',
    action: 'Send reminders for overdue payments (3, 7, 14 days)'
  },
  {
    name: 'apply-late-fees',
    schedule: '0 0 * * *',
    action: 'Apply late fees after grace period'
  },
  {
    name: 'suspend-defaulted-users',
    schedule: '0 1 * * *',
    action: 'Suspend access for 21+ days overdue'
  },
  {
    name: 'generate-financial-summary',
    schedule: '0 2 * * *',
    action: 'Generate daily financial summary with AI insights'
  },
  {
    name: 'predict-payment-risks',
    schedule: '0 3 * * *',
    action: 'Run AI prediction on upcoming payments'
  }
];
```

### Weekly Jobs

```typescript
const weeklyPaymentJobs = [
  {
    name: 'send-upcoming-week-summary',
    schedule: '0 7 * * 1',  // Monday 7 AM
    action: 'Send admin summary of upcoming week payments'
  },
  {
    name: 'generate-collection-report',
    schedule: '0 8 * * 1',
    action: 'Generate weekly collection performance report'
  }
];
```

---

## 📈 SUCCESS METRICS

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| On-time payment rate | Unknown | 90%+ | % paid by due date |
| Collection rate | Unknown | 95%+ | % eventually collected |
| Avg days to payment | Unknown | <3 days | From due date |
| Default rate | Unknown | <5% | % never collected |
| Reminder effectiveness | Unknown | 40%+ | % pay after reminder |
| Manual verification time | Unknown | <2 min | Per bank transfer |

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Core Accounting (Week 1)
- [ ] Payment schedules table + API
- [ ] Installment tracking
- [ ] Basic accounting dashboard
- [ ] Manual payment recording

### Phase 2: Automated Reminders (Week 2)
- [ ] Reminder templates
- [ ] Automated reminder jobs
- [ ] Email/SMS integration
- [ ] Reminder effectiveness tracking

### Phase 3: Bank & Crypto (Week 3)
- [ ] Bank transfer workflow
- [ ] Proof upload/verification
- [ ] Crypto payment integration
- [ ] Auto-matching algorithm

### Phase 4: AI Enhancement (Week 4)
- [ ] Payment prediction
- [ ] Risk detection
- [ ] Smart collection assistant
- [ ] Revenue forecasting
- [ ] AI insights dashboard

---

**END OF SMART ACCOUNTING ADDITION**

**Integration:** Add this section after AI_ENHANCED_ADMIN_ADDITION.md

**Priority:** HIGH (Direct revenue impact)
**Estimated Development:** 4 weeks
**Dependencies:** Stripe, Cashfree, Coinbase Commerce, Claude API
