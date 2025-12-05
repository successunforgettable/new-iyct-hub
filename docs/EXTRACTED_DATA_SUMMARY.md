# EXTRACTED DATA SUMMARY
## Data from PHP Codebase via Replit - December 5, 2025

**Source:** Replit AI Agent extraction from innerdna.com CI4/PHP codebase  
**Status:** 90% Complete (missing Client 10-Week structure and full Vimeo ID mapping)

---

## 📋 COACH TRAINING PROGRAM STRUCTURE

**Source File:** `coach_training_steps_COMPLETE.json`

### Program Overview
- **Name:** Coach Training Foundation (CTF)
- **Total Weeks:** 7 (Week 0-6)
- **Total Steps:** 48
- **Source Table:** `cc_coach_step_info`

### Week Breakdown

| Week | Title | Steps | Manual PDF |
|------|-------|-------|------------|
| 0 | Get Started | 3 | None |
| 1 | Week One | 13 | Week_1.pdf |
| 2 | Week Two | 12 | Week_2.pdf |
| 3 | Week Three | 6 | Week_3.pdf |
| 4 | Week Four | 7 | Week_4.pdf |
| 5 | Week Five | 6 | Week_5.pdf |
| 6 | Certification | 1 | None |

### Complete Step List

**Week 0: Get Started**
1. What Coaching Really Is
2. What Is Your Vision And Mission?
3. The Power Of Imagination

**Week 1: Week One**
1. Who Are You
2. The Welcome Session
3. The Welcome Session Debrief & The Personality Assessment Debrief
4. The Wheel Of Life
5. The Wheel Of Life Debrief & Inner DNA
6. The Speech
7. The Speech Debrief
8. Discover Your Baselines
9. Discover Your Baselines Debrief
10. Baselines Expression
11. Baselines Expression Debrief & New Activity
12. Baselines Non-Expression Debrief & The Change
13. The Change

**Week 2: Week Two**
1. Introduction To Integrated Power Coding
2. The N - Codes And The E - Codes
3. Letting Go And Holding On Activity
4. Letting Go And Holding On Debrief (Part 1)
5. Letting Go And Holding On Debrief (Part 2)
6. Letting Go And Holding On (Let's Sum It Up)
7. The Coding
8. The Coding Debrief
9. Your E - Codes
10. Your E - Codes Debrief
11. The Stories
12. The Stories Debrief

**Week 3: Week Three**
1. Outcomes
2. My Outcomes
3. Define My Outcomes
4. INCRED Outcomes
5. INCRED Process Debrief
6. Challenges, Power Leaps

**Week 4: Week Four**
1. Introduction To Decision Making
2. Unleash You
3. My Past Decisions Debrief & Decision Making Wheel
4. Make The Real Decision
5. The Buzz Moments
6. The Mastermind Circle
7. The Summary

**Week 5: Week Five**
1. The Success Blueprint
2. Crazy Dreams
3. The Vision Board
4. The Vision Board Debrief
5. Crafting Your Success Blueprint
6. The Beginning Of The Journey

**Week 6: Certification**
1. Certification

---

## 🛠️ PRACTICE TOOLS (6 Tools)

**Source File:** `practice_tools_COMPLETE.json`  
**Confirmed via Screenshots:** December 5, 2025

| # | Tool Name | Database Table | Purpose |
|---|-----------|----------------|---------|
| 1 | Inner DNA Test | `cc_personality_report` | Personality assessment |
| 2 | Wheel of Life | `cc_wheeloflife_report` | Rate 8 life areas (1-10) |
| 3 | Baselines | `cc_baselines_report` | Word selection for limiting beliefs |
| 4 | N-codes & E-codes | `cc_beliefs_report` | Transform limiting → empowering beliefs |
| 5 | Define My Outcomes | `cc_outcome_report` | Priority calculator with 8 factors |
| 6 | Decision Making Wheel | `cc_decision_wheel_report` | 9-question decision analysis |

### Tool Details

#### 1. Inner DNA Test
- **Type:** External personality assessment
- **Fields:** p_type, state, mood_state, subtype, ntype
- **Output:** Personality report with insights

#### 2. Wheel of Life
- **8 Life Areas:**
  - Health
  - Friends & Family
  - Fun & Recreation
  - Wealth
  - Relationship
  - Learning & Growth
  - Possessions
  - Career
- **Rating:** 1-10 scale per area
- **Visualization:** Polar/radar chart
- **Database:** `prg_wheel_of_life` (questions), `cc_wheeloflife_report` (results)

#### 3. Baselines
- **Flow:** Select words → Compare pairs → Top 5 beliefs
- **Database:** `prg_baselines_word_selection`, `cc_baselines_report`
- **Output:** Top limiting beliefs identified

#### 4. N-codes & E-codes
- **Purpose:** Transform negative codes to empowering codes
- **Flow:** 3-stage belief identification
- **Database:** `prg_beliefs`, `cc_beliefs_report`

#### 5. Define My Outcomes
- **8 Factors rated:**
  - Time required
  - Difficulty level
  - Enjoyment factor
  - 90-day impact
  - 25-year impact
  - (+ 3 more)
- **Formula:** Total = Sum of (value²)
- **Database:** `cc_outcome_report`

#### 6. Decision Making Wheel
- **Questions:** 9 dimensions rated 1-10
- **Visualization:** Interactive wheel
- **Database:** `prg_decision_making`, `cc_decesion_report`

---

## 🔓 BATCH & WEEK UNLOCK SYSTEM

**Source File:** `batch_and_week_unlock.json`

### Batch System
- **Table:** `prg_batch_management`
- **Key Fields:**
  - `btc_batch_name` - Name (e.g., "January 2024")
  - `btc_lockstatus` - 1=Live, 0=Locked
  - `btc_date` - Start date
  - `btc_capacity` - Max participants

### Week Unlock Logic (Hybrid System)

**Three unlock methods combined:**

1. **Payment-Based**
   - Weeks unlock when corresponding installment paid
   - `open_week` field determines which weeks unlock
   - Full payment = all weeks unlocked immediately

2. **Completion-Based**
   - Next week unlocks when all steps in current week completed
   - Checks `we_type`: 'free' auto-unlocks, 'paid' requires payment

3. **Manual Admin Override**
   - Admins can lock/unlock weeks for specific users
   - Routes: `admin/Coach_Mangement/bulk_week_unlock`

### Database Tables
- `prg_week_management` - Week definitions
- `cc_week_access` - User's week unlock status
- `prg_installment_mst` - Payment installments with `open_week` mapping

### Week Access Status Values
- `week_access`: 0=Locked, 1=Unlocked
- `status`: 0=Not started, 1=In progress, 2=Completed

---

## 📦 TREASURES & BONUSES

**Source File:** `treasures_and_bonuses.json`

### Treasures (Coach Training Resources)
- **Table:** `prg_incredible_treasure`
- **Access:** Coach Training enrollees only
- **Categories:**
  - Marketing & Promotions
  - Other Resources (tutorials, guides)
- **Content Types:** PDFs, videos, ebooks, articles

### Bonuses (Client Program Rewards)
- **Table:** `prg_my_bonuses`
- **Access:** Enrolled clients
- **Unlock Triggers:** enrollment, week_X_complete, program_complete
- **Display:** Carousel format

---

## 📣 MARKETING HUB

**Source File:** `database_export:marketing_hub_and_certification.json`

### Share Link System
- **Format:** `{base_url}/{marketing_prg_reg_link}/{user_id}`
- **Tracking:** `parent_user_id` field in `cc_program_access`
- **Share Limits:** `market_share_count` per program
- **Personality Test Links:** Separate count in `cc_coach.personality_count`

### Share Channels
1. Copy Link
2. WhatsApp
3. Facebook
4. Email

### Commission System
- **Status:** Tracking only (no financial commissions found)
- **Purpose:** Client relationship management

---

## 🎓 CERTIFICATION SYSTEM

**Source File:** `database_export:marketing_hub_and_certification.json`

### Requirements
- Complete all program weeks
- Upload certification video(s)
- Pass admin review

### Video Certification
- **Table:** `cc_coach_certification_videos`
- **Fields:** video_url, video_thumbnail, status, remarks
- **Duration:** Configurable per certification task

### Approval Workflow
- **Statuses:** 1=Pending, 2=Approved, 3=Rejected
- **Admin Routes:** 
  - `admin/Certification/coach_certfication_video_list`
  - `admin/Certification/video_approve_reject`

### Certificate Generation
- **Template Table:** `prg_certificate_design`
- **Generated Table:** `cc_generate_certificate`
- **Fields:** program_id, user_id, name, cert_date, certificate_link

### MCQ Quiz (Optional)
- **Tables:** `prg_coach_mcq`, `prg_coach_mcq_options`, `cc_coach_mcq_ans`
- **Passing:** 100% correct required
- **Retry:** Allowed

---

## 🎬 VIMEO VIDEO INTEGRATION

**Source File:** `database_tables_and_vimeo.json`, `database_export:video_ids_extracted.json`

### Embed Configuration
- **Method:** iframe
- **Privacy:** Domain restricted
- **URL Format:** `https://player.vimeo.com/video/{video_id}?api=1`
- **Player Class:** `player1`

### Video Storage
- **Table:** `prg_steps_management`
- **ID Field:** `stp_videoid`
- **Duration Field:** `stp_video_length`
- **Thumbnail Field:** `stp_image_thumb`

### Known Video IDs (29 Found)
```
76979871, 333274438, 336000413, 343427194, 388213439,
742194439, 742194482, 742194543, 742194592, 742194681,
742194750, 742213307, 742213518, 742213653, 742213817,
742213932, 742214131, 742214448, 742214697, 742214926,
742232244, 742263389, 742273154, 742664848, 742667716,
742667999, 742668338, 743074376, 743401977
```

### Video Categories Found
- Program intro/background loops
- Tutorial walkthroughs
- Week step videos
- Certification step videos (9 total)
- Client coaching videos (7 total)
- Personality assessment video

---

## 🗄️ DATABASE TABLE MAPPING

**Source File:** `database_tables_and_vimeo.json`

### Core Program Tables
| New Table | Old Table |
|-----------|-----------|
| programs | prg_master |
| program_weeks | prg_week_management |
| program_steps | prg_steps_management |
| enrollments | cc_program_access |
| step_progress | cc_steps |
| week_access | cc_week_access |
| batches | prg_batch_management |

### User Tables
| New Table | Old Table |
|-----------|-----------|
| users (coaches) | cc_coach |
| users (admins) | adm_users |

### Tool Tables
| Tool | Old Table |
|------|-----------|
| Wheel of Life | cc_wheeloflife_report |
| Baselines | cc_baselines_report |
| N-codes | cc_beliefs_report |
| Outcomes | cc_outcome_report |
| Decision Wheel | cc_decision_wheel_report |

### Table Prefixes
- `prg_` = Program configuration and master data
- `cc_` = User/Coach data and activity records
- `adm_` = Admin and authentication tables

---

## ⚠️ MISSING DATA (Needs Developer Access)

1. **Client 10-Week Program Structure**
   - Requires: `prg_client_step_management` table
   - Blocked: CI4 database on different server

2. **Complete Vimeo ID Mapping**
   - Have: 29 video IDs
   - Need: Full step → video_id mapping from `prg_steps_management.stp_videoid`

3. **Tool Question Content**
   - Have: Database schemas
   - Need: Actual question text from `prg_wheel_of_life`, `prg_baselines_word_selection`, etc.

---

## 📁 SOURCE FILES IN PROJECT

All extracted JSON files should be in `~/Desktop/iyct-platform/docs/`:

```
docs/
├── coach_training_steps_COMPLETE.json
├── practice_tools_COMPLETE.json
├── treasures_and_bonuses.json
├── batch_and_week_unlock.json
├── database_tables_and_vimeo.json
├── marketing_hub_and_certification.json
├── video_ids_extracted.json
```

---

**END OF EXTRACTED DATA SUMMARY**

**Last Updated:** December 5, 2025
**Next Update:** When developer provides CI4 database access
