# SESSION 20: DASHBOARD HERO SECTION & ENROLLMENT CAROUSEL - COMPLETE HANDOFF

## CRITICAL: READ BEFORE ANY WORK

### MANDATORY RULES FOR ASSISTANT
1. **User works LOCALLY** at `~/Desktop/iyct-platform/` on Mac
2. **NEVER create files in sandbox** - only provide terminal commands for user to run locally
3. **NEVER rewrite entire files** - use `sed` for surgical edits
4. **ALWAYS reference master plan documents** before making decisions
5. **ALWAYS verify with live data** - never assume database state
6. **WAIT for user output** before giving next command
7. **NO assumptions** - if not in docs, ask
8. **NO deviations from specs**

### MASTER PLAN DOCUMENTS (READ IN ORDER)
1. `/mnt/project/PROJECT_MASTER_PLAN.md` - Architecture & Phase 1
2. `/mnt/project/PROJECT_MASTER_PLAN_PART2.md` - Migration & Implementation
3. `/mnt/project/COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md` - Design specs & colors
4. `/mnt/project/INNER_DNA_SYSTEM_ADDITION.md` - Personality assessment system

### USER CONTEXT
**Arfeen Khan:**
- Founder of IYCT (Incredible You Coaching Training)
- 1,500 active coaches across 43+ countries
- **Enneagram Type 8** - Direct, action-oriented, minimal explanations
- Prefers surgical `sed` edits over file recreation
- Wants exact terminal commands, not lengthy explanations

---

## OVERVIEW
This session implemented the Dashboard Hero Section with carousel navigation for multiple program enrollments. Built directly on Session 19's category tabs and program locking work.

---

## WORK COMPLETED

### 1. Created Test Enrollment Data
Database had 0 enrollments. Created enrollments for testing:

**Enrollment 1:**
```bash
cd ~/Desktop/iyct-platform/apps/backend && npx ts-node --transpile-only -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function run() {
  const user = await p.user.findFirst({ where: { email: 'arfeen@iyct.com' }});
  const program = await p.program.findFirst({ where: { slug: 'iy10' }});
  const enrollment = await p.userProgramEnrollment.create({
    data: {
      userId: user.id,
      programId: program.id,
      currentWeek: 3,
      completionPercentage: 33,
      enrolledAt: new Date()
    }
  });
  console.log('Created:', enrollment.id);
  p.\$disconnect();
}
run();
"
```

**Enrollment 2:**
```bash
# Same pattern with slug: 'iyctlevel1', currentWeek: 2, completionPercentage: 15
```

**Current Enrollments:**
| User | Program | Week | Progress |
|------|---------|------|----------|
| arfeen@iyct.com | The Incredible You 10 week coaching (iy10) | 3 | 33% |
| arfeen@iyct.com | The Incredible You Coach Training Level 1 (iyctlevel1) | 2 | 15% |

---

### 2. Dashboard Hero Section Implementation

**File Modified:** `apps/frontend/src/pages/dashboard/DashboardPage.tsx`

**Changes Made:**

1. **Added import for auth store:**
```typescript
import { useAuthStore } from '../../store/authStore';
```

2. **Added state and hooks in component:**
```typescript
const { user } = useAuthStore();
const [activeEnrollmentIndex, setActiveEnrollmentIndex] = React.useState(0);
```

3. **Hero Section UI (after Page Header, before Stats Grid):**
- Welcome message with user's first name
- Current program name (from active enrollment)
- Week X of Y display
- Large circular progress indicator (140px)
- Cyan "Resume Program →" button
- Navigation dots for multiple enrollments
- Left/right arrow buttons

**Design Specs Used (from COMPLETE_HANDOFF_WITH_DESIGN_SYSTEM.md):**
```
Hero Card:
- Background: #1a2332
- Border radius: 16px (rounded-2xl)
- Padding: 32px (p-8)
- Large circular progress: 140px diameter
- Cyan stroke: #5dade2
- Navy background circle: #2a3b52
```

4. **Renamed "Overall Progress" to "All Programs Progress"** for clarity

---

### 3. Carousel Navigation for Multiple Enrollments

When user has 2+ enrollments, hero section shows:
```
┌─────────────────────────────────────────────────────────────┐
│  Welcome back, Arfeen!                                      │
│                                                             │
│  The Incredible You 10 week coaching        ┌───────────┐   │
│  Week 3 of 10                               │   33%     │   │
│                                             └───────────┘   │
│  [Resume Program →]                                         │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                [←]  ● ○  [→]                                │
└─────────────────────────────────────────────────────────────┘
```

- Dots indicate number of enrollments
- Active dot is cyan (#5dade2), inactive is border color (#2a3b52)
- Arrows cycle through enrollments
- Navigation only shows when enrolledPrograms.length > 1

---

## VERIFIED WORKING

1. **Dashboard Hero Section** (http://localhost:3000/dashboard):
   - Shows enrolled program prominently
   - Displays user's first name from auth store
   - Large circular progress indicator works
   - Resume button navigates to program
   - Carousel dots/arrows work with multiple enrollments

2. **API Data Flow:**
   - `api.programs.getEnrolled()` fetches user's enrollments
   - `useAuthStore()` provides user.fullName
   - Program data includes: name, currentWeek, durationWeeks, completionPercentage

---

## GIT COMMITS THIS SESSION

```
1. "Add Dashboard hero section with enrolled program progress"
2. "Add carousel for multiple enrollments in hero section, rename Overall Progress"
```

---

## DATABASE STATE

```
Programs: 33 total
  - Published: 24
  - Locked: 9

Weeks: 206
Steps: 927

Enrollments: 2
  - arfeen@iyct.com → iy10 (Week 3, 33%)
  - arfeen@iyct.com → iyctlevel1 (Week 2, 15%)

Users: 2
  - arfeen@iyct.com (SUPERADMIN)
  - harry@potter.com (COACH)
```

---

## FILES MODIFIED THIS SESSION

| File | Changes |
|------|---------|
| `apps/frontend/src/pages/dashboard/DashboardPage.tsx` | Added useAuthStore import, user extraction, activeEnrollmentIndex state, Hero Section with carousel navigation, renamed "Overall Progress" |

---

## DESIGN SYSTEM VALUES (DO NOT CHANGE)

```css
--background: #0a1628;
--nav-background: #0d1829;
--card-background: #1a2332;
--card-border: #2a3b52;
--accent-cyan: #5dade2;
--accent-hover: #7dc8f0;
--success-green: #34c38f;
--warning: #f0ad4e;
--error: #dc3545;
--text-primary: #ffffff;
--text-secondary: #e0e0e0;
--text-muted: #a0a0a0;
```

---

## NEXT STEPS (PRIORITY ORDER FROM MASTER PLANS)

### 1. Language Badges on Program Cards
Add EN/HI badge to each program card showing language.

**File:** `apps/frontend/src/pages/programs/ProgramListPage.tsx`

**Implementation:**
- Check `program.language` field (values: 'ENGLISH' or 'HINDI')
- Add small badge in top-right of card
- EN = cyan badge, HI = orange badge

### 2. Admin Panel - Locked Programs View
Display locked programs with management controls.

**File:** `apps/frontend/src/pages/admin/ProgramManagement.tsx`

**Features needed:**
- "LOCKED" badge on unpublished programs
- Toggle to show/hide locked programs
- Allow admin to unlock/lock programs
- Filter dropdown: All | Published | Locked

### 3. Inner DNA System Integration
Personality assessment flow per `INNER_DNA_SYSTEM_ADDITION.md`:

- 7-stage RHETI questionnaire
- Hero Moments scenarios
- Bayesian algorithm for type calculation
- Results display with Enneagram type
- Activity type triggers in program steps

### 4. Activity Type Triggers
Programs have steps with different activity types:
- `inner_dna` → Triggers Inner DNA assessment
- `wheel_of_life` → Triggers Wheel of Life assessment
- `video` → Video content
- `assignment` → User submission required

**Reference:** Steps export CSV has `activity_id` field mapping to these types.

---

## API ENDPOINTS

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/programs` | GET | List all published programs |
| `/api/v1/programs/:id` | GET | Get program with weeks/steps |
| `/api/v1/programs/enrolled` | GET | Get user's enrolled programs |
| `/api/v1/enrollments` | GET | Get user's enrollments |
| `/api/v1/progress` | GET/POST | Get/update step progress |
| `/api/v1/analytics/dashboard` | GET | Dashboard stats |

---

## API RESPONSE STRUCTURES

### api.programs.getEnrolled() returns:
```typescript
[
  {
    id: string,           // enrollment ID
    programId: string,
    userId: string,
    currentWeek: number,
    completionPercentage: number,
    enrolledAt: string,
    program: {
      id: string,
      name: string,
      slug: string,
      durationWeeks: number,
      language: 'ENGLISH' | 'HINDI',
      imageUrl: string | null
    }
  }
]
```

### useAuthStore().user:
```typescript
{
  userId: string,
  email: string,
  fullName: string,    // "Arfeen Khan"
  userRole: string,    // "SUPERADMIN"
  avatarUrl?: string
}
```

---

## TEST CREDENTIALS

```
Email: arfeen@iyct.com
Password: Arfeen123
Role: SUPERADMIN
Frontend: http://localhost:3000
Backend: http://localhost:3001/api/v1
```

---

## STARTUP COMMANDS

```bash
# Start backend
cd ~/Desktop/iyct-platform/apps/backend && npm run dev &

# Start frontend
cd ~/Desktop/iyct-platform/apps/frontend && npm run dev

# Check both running
lsof -i :3000 -i :3001 | grep LISTEN
```

---

## KEY PROJECT FILES

| File | Purpose |
|------|---------|
| `apps/frontend/src/pages/dashboard/DashboardPage.tsx` | Main dashboard with hero section |
| `apps/frontend/src/pages/programs/ProgramListPage.tsx` | Program listing with category tabs |
| `apps/frontend/src/pages/programs/ProgramDetailPage.tsx` | Program view with video player |
| `apps/frontend/src/store/authStore.ts` | Auth state (user, token) |
| `apps/backend/prisma/schema.prisma` | Database schema |
| `docs/steps_export.csv` | Live server steps data (935 rows) |
| `docs/weeks_export.csv` | Live server weeks data |

---

## CRITICAL: LIVE DATA VERIFICATION

**ALWAYS verify database state before making changes:**

```bash
# Check enrollments
cd ~/Desktop/iyct-platform/apps/backend && npx ts-node --transpile-only -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.userProgramEnrollment.findMany({
  include: { program: true, user: true }
}).then(r => {
  console.log('ENROLLMENTS:', r.length);
  r.forEach(e => console.log('- User:', e.user.email, '| Program:', e.program.name, '| Progress:', e.completionPercentage + '%'));
  p.\$disconnect();
});
"

# Check programs
cd ~/Desktop/iyct-platform/apps/backend && npx ts-node --transpile-only -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.program.findMany({ where: { isPublished: true }}).then(r => {
  console.log('Published programs:', r.length);
  p.\$disconnect();
});
"

# Check users
cd ~/Desktop/iyct-platform/apps/backend && npx ts-node --transpile-only -e "
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.user.findMany().then(r => {
  r.forEach(u => console.log(u.email, u.role, u.fullName));
  p.\$disconnect();
});
"
```

**Model name is `user` NOT `odUser`** - Schema was updated in earlier sessions.

---

## TYPESCRIPT ERRORS (PRE-EXISTING)

These errors existed before this session and don't affect functionality:
```
- Navigation.tsx: unused React import
- TopNavigation.tsx: firstName property
- AssignmentSubmission.tsx: argument count
- SectionTabs.tsx: unused React import
- AdminDashboard.tsx: unused imports
- ProgramManagement.tsx: language type mismatch
- UserManagement.tsx: AdminUser type mismatch
- RegisterPage.tsx: login property, role type
- ProgramDetailPage.tsx: unused _ProgressRing
```

---

## SESSION CONTINUITY NOTES

1. **From Session 19:** Locked 9 demo/inactive programs, added category tabs to Programs page.

2. **This session (20):** Built Dashboard hero section with enrolled program display and carousel for multiple enrollments.

3. **For next session:** Focus on language badges for program cards, then admin locked programs management, then Inner DNA integration.

---

## IMPORTANT LESSONS LEARNED

1. **Database model names matter:** Use `p.user` not `p.odUser` - schema was consolidated.

2. **Always create test data:** Enrollment was missing, had to create before testing hero section.

3. **Surgical edits preferred:** User prefers `sed` commands over file recreation to avoid breaking existing functionality.

4. **Check API response structure:** `enrolledPrograms[i].program?.name` - program is nested object, not flat.

5. **Auth store has fullName:** `user.fullName.split(" ")[0]` extracts first name for welcome message.

---

*Handoff created: Session 20*
*Previous handoff: SESSION19_COMPLETE_HANDOFF.md*
