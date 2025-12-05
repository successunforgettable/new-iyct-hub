# SESSION 14 COMPLETE HANDOFF
## IYCT Platform Migration - Ready to Build

**Date:** December 5, 2025  
**Project:** IYCT Coaching Platform Migration  
**Client:** Arfeen Khan  
**Status:** DATA EXTRACTION COMPLETE - Ready for Implementation

---

## 🎯 WHAT WE'RE BUILDING

Two separate coaching systems:

| System | Users | Duration | Status |
|--------|-------|----------|--------|
| **Coach Training Hub** | People becoming coaches | 7 weeks (48 steps) | ✅ Data extracted |
| **Client Hub** | Clients of certified coaches | 10 weeks | ⏸️ Needs database access |

---

## ✅ COMPLETED

### Infrastructure
- ✅ Authentication (login, register, JWT)
- ✅ Database (PostgreSQL via Supabase, Prisma ORM)
- ✅ 32 programs seeded
- ✅ Admin Panel MVP (Users, Programs, Analytics)
- ✅ Category system with filters
- ✅ Git repository set up

### Data Extraction (From Old PHP System)
- ✅ Coach Training 48 steps structure
- ✅ 6 Practice Tools documented
- ✅ Batch & week unlock logic
- ✅ Treasures & Bonuses schemas
- ✅ Marketing Hub structure
- ✅ Certification system
- ✅ Database table mappings
- ✅ Vimeo configuration
- ⚠️ Partial: 29 Vimeo IDs (need full mapping)
- ❌ Missing: Client 10-week structure

---

## 📊 COACH TRAINING PROGRAM STRUCTURE

**7 Weeks, 48 Steps Total:**

| Week | Title | Steps |
|------|-------|-------|
| 0 | Get Started | 3 |
| 1 | Week One | 13 |
| 2 | Week Two | 12 |
| 3 | Week Three | 6 |
| 4 | Week Four | 7 |
| 5 | Week Five | 6 |
| 6 | Certification | 1 |

**Key Steps Include:**
- The Welcome Session
- The Wheel Of Life
- The Speech
- Discover Your Baselines
- The N-Codes And The E-Codes
- Define My Outcomes
- Decision Making Wheel
- The Mastermind Circle
- Certification

---

## 🛠️ PRACTICE TOOLS (6 Tools)

| Tool | Purpose | Table |
|------|---------|-------|
| Inner DNA Test | Personality assessment | cc_personality_report |
| Wheel of Life | Rate 8 life areas | cc_wheeloflife_report |
| Baselines | Word selection for beliefs | cc_baselines_report |
| N-codes & E-codes | Transform limiting beliefs | cc_beliefs_report |
| Define My Outcomes | Priority calculator | cc_outcome_report |
| Decision Making Wheel | 9-question analysis | cc_decision_wheel_report |

**NOT standalone tools (they're program steps):**
- The Speech
- Baseline Expression
- Challenges & Power Leaps
- Buzz Moments
- Mastermind

---

## 🔓 WEEK UNLOCK SYSTEM

**Hybrid: Payment + Completion + Manual**

1. **Payment-Based:** Weeks unlock with installment payments
2. **Completion-Based:** Next week unlocks when current week 100% complete
3. **Manual:** Admin can override lock/unlock per user

**Tables:**
- `prg_week_management` - Week definitions
- `cc_week_access` - User unlock status (week_access: 0=locked, 1=unlocked)
- `prg_installment_mst` - Payment → week mapping

---

## 🎬 VIMEO INTEGRATION

- **Embed:** iframe with `https://player.vimeo.com/video/{id}?api=1`
- **Privacy:** Domain restricted
- **Storage:** `prg_steps_management.stp_videoid`
- **29 video IDs extracted** (need full step mapping from developer)

---

## 🎯 WHAT'S NEXT TO BUILD

### Priority 1: Program Content Delivery
1. **Seed 48 steps** into ProgramStep table
2. **Week navigation** - Show weeks with lock status
3. **Step list** - Show steps within each week
4. **Video player** - Vimeo embed component
5. **Step completion** - Mark complete, track progress
6. **Progress percentage** - Calculate from completed steps

### Priority 2: Practice Tools
1. **Tool landing page** - 6 cards in carousel
2. **Wheel of Life** - 8 area ratings, radar chart
3. **Baselines** - Word selection UI
4. **N-codes & E-codes** - Belief transformation
5. **Define My Outcomes** - Priority calculator
6. **Decision Making Wheel** - 9 questions

### Priority 3: Other Features
1. **Treasures browser** - Category navigation, downloads
2. **Marketing Hub** - Share links, referral tracking
3. **Certification** - Video upload, admin review

### Blocked (Need Developer Data):
- Client 10-Week program structure
- Full Vimeo ID → Step mapping
- Tool question content

---

## 💻 TECHNICAL SETUP

### Start the Platform
```bash
# Terminal 1 - Backend
cd ~/Desktop/iyct-platform/apps/backend
npm run dev
# Runs on localhost:3001

# Terminal 2 - Frontend
cd ~/Desktop/iyct-platform/apps/frontend
npm run dev
# Runs on localhost:3000
```

### URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api/v1
- Admin: http://localhost:3000/admin

### Login
- Email: arfeen@iyct.com
- Password: Arfeen123
- Role: SUPERADMIN

### Git
```bash
cd ~/Desktop/iyct-platform
git add .
git commit -m "message"
git push origin main
```

---

## 🎨 DESIGN SYSTEM

### Colors
```javascript
colors = {
  background: '#0a1628',  // Dark navy
  card: '#1a2332',        // Navy
  border: '#2a3b52',      // Medium navy
  accent: '#5dade2',      // Cyan
  success: '#34c38f',     // Green
  warning: '#f0ad4e',     // Orange
  error: '#dc3545',       // Red
  textPrimary: '#ffffff',
  textMuted: '#a0a0a0',
}
```

---

## 📁 PROJECT STRUCTURE

```
~/Desktop/iyct-platform/
├── apps/
│   ├── backend/
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── services/
│   │   │   ├── routes/
│   │   │   └── index.ts
│   │   └── prisma/
│   │       ├── schema.prisma
│   │       └── seed.ts
│   └── frontend/
│       └── src/
│           ├── pages/
│           │   ├── admin/
│           │   ├── auth/
│           │   ├── dashboard/
│           │   └── programs/
│           ├── components/
│           └── api/
└── docs/
    ├── EXTRACTED_DATA_SUMMARY.md (NEW)
    ├── coach_training_steps_COMPLETE.json
    ├── practice_tools_COMPLETE.json
    ├── batch_and_week_unlock.json
    ├── treasures_and_bonuses.json
    ├── database_tables_and_vimeo.json
    ├── marketing_hub_and_certification.json
    └── video_ids_extracted.json
```

---

## 📚 KEY REFERENCE DOCUMENTS

**Read in this order:**

1. `/mnt/project/EXECUTIVE_SUMMARY.md` - Quick overview
2. `/mnt/project/PROJECT_MASTER_PLAN.md` - Full architecture
3. `/mnt/project/PROJECT_MASTER_PLAN_PART2.md` - Implementation phases
4. `/mnt/project/EXTRACTED_DATA_SUMMARY.md` - **NEW: All extracted data**
5. `/mnt/project/TWO_SYSTEM_ARCHITECTURE_ADDITION.md` - Coach vs Client hubs
6. `docs/coach_training_steps_COMPLETE.json` - 48 steps structure

---

## ⚠️ CRITICAL RULES

### From Arfeen
1. **No compromise** on master plan specs
2. **Documentation-first** - Reference master plan sections
3. **Surgical fixes** - Don't recreate files
4. **Dark theme** - Preserve exact colors
5. **No false claims** - Be honest about capabilities

### Technical
1. Check Prisma schema before DB operations
2. API client extracts `.data` - components don't need `.data.data`
3. Use React Query for data fetching
4. TypeScript strict mode

---

## 🔑 KEY FACTS

### Coach Training Program
- **7 weeks** (not 5 as originally thought)
- **48 steps** total
- Week 0 = "Get Started" (pre-study)
- Week 6 = Certification

### Practice Tools
- **6 tools** in carousel UI
- Inner DNA, Wheel of Life, Baselines, N-codes, Outcomes, Decision Wheel
- The Speech, Mastermind, etc. are **program steps**, not tools

### Week Unlock
- **Hybrid system**: Payment + Completion + Manual
- `week_access` field: 0=locked, 1=unlocked
- Admins can override

### Videos
- All on **Vimeo**
- Domain-restricted privacy
- 29 IDs found, need full mapping

---

## 📋 IMMEDIATE NEXT STEPS

### Step 1: Seed Week/Step Data
Create seed script to add 48 steps to database:
```typescript
// apps/backend/prisma/seedSteps.ts
// Loop through coach_training_steps_COMPLETE.json
// Create ProgramWeek and ProgramStep records
```

### Step 2: Build Week Navigation Component
- Show all 7 weeks as cards/tabs
- Lock icon for locked weeks
- Progress indicator per week

### Step 3: Build Step List Component
- Show steps within selected week
- Checkbox for completed
- Video thumbnail preview

### Step 4: Build Video Player
- Vimeo embed wrapper
- Progress tracking
- Mark complete button

### Step 5: Build Practice Tool Landing
- 6 tool cards in carousel
- "Let's Try" buttons
- Match existing design (see screenshots)

---

## 📞 WAITING ON FROM DEVELOPER

1. **Client 10-Week Program** - `prg_client_step_management` table export
2. **Full Vimeo Mapping** - `prg_steps_management` with `stp_videoid` column
3. **Tool Question Content** - Actual questions from `prg_wheel_of_life`, etc.

---

## ✅ SESSION 13-14 ACCOMPLISHMENTS

1. Clarified two-system architecture
2. Extracted 7 weeks, 48 steps for Coach Training
3. Documented all 6 Practice Tools
4. Got batch/unlock logic
5. Got marketing hub structure
6. Got certification system
7. Got Vimeo configuration
8. Created comprehensive data summary document
9. Updated all handoff documentation

---

**END OF HANDOFF**

**Next Action:** Seed the 48 coach training steps into the database, then build week/step navigation UI.
