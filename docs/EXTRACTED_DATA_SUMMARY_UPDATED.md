# EXTRACTED DATA SUMMARY (UPDATED)
## Data from Live Server - December 5, 2025

**Source:** AWS Lightsail MySQL Database (innerdna) - IP: 13.127.15.193  
**Status:** COMPLETE - All major data extracted from live production database

---

## 📊 SYSTEM TOTALS

| Item | Count |
|------|-------|
| Programs | 49 |
| Weeks | 207 |
| Steps | 933 |
| RHETI Questions | 380 |
| Hero Moment Values | 713 |
| Enneagram Types | 9 |
| Personality States | 90 |
| Personality Subtypes | 54 |
| Wheel of Life Areas | 8 |

---

## 📋 ALL PROGRAMS (49 Total)

### Coach Training Programs
| ID | Code | Title | Language | Weeks |
|----|------|-------|----------|-------|
| 1 | IYCTHINDI | The Incredible You Mind Hacker Coach Training In Hindi | HINDI | 7 |
| 6 | IYCTHUB | The Incredible You Mind Hacker Coach Training | ENGLISH | 7 |
| 22 | IYCTPRE | The Incredible You Coach Training Pre Study | ENGLISH | 7 |
| 31 | IYCTLEVEL1 | The Incredible You Coach Training Level 1 Program | ENGLISH | 5 |
| 32 | IYCTLEVEL2 | The Incredible You Coach Training Level 2 Program | ENGLISH | 5 |
| 37 | IYCTLEVEL1 | The Incredible You Mind Hacker Coach Training (Level 1) | ENGLISH | 6 |
| 38 | IYCTHINDILEVEL1 | The Incredible You Mind Hacker Coach Training In Hindi Level 1 | HINDI | 5 |
| 39 | IYCTHINDILEVEL2 | The Incredible You Mind Hacker Coach Training In Hindi Level 2 | HINDI | 6 |

### 10-Week Coaching Programs
| ID | Code | Title | Language | Weeks |
|----|------|-------|----------|-------|
| 3 | IY10HINDI | The Incredible You 10 Week Coaching In Hindi | HINDI | 10 |
| 11 | IY10 | The Incredible You 10 week coaching | ENGLISH | 10 |
| 20 | IY10HINDIDEMO | The Incredible You 10 Week Coaching In Hindi Demo | HINDI | 10 |
| 21 | IY10DEMO | The Incredible You 10 week coaching Demo | ENGLISH | 11 |
| 40 | IY10LEVEL1 | The Incredible You 10 week coaching Level 1 | ENGLISH | 5 |
| 41 | IY10LEVEL2 | The Incredible You 10 week coaching Level 2 | ENGLISH | 6 |
| 42 | IY10HINDILEVEL1 | The Incredible You 10 Week Coaching In Hindi Level 1 | HINDI | 5 |
| 43 | IY10HINDILEVEL2 | The Incredible You 10 Week Coaching In Hindi Level 2 | HINDI | 6 |
| 50 | CIY10 | Corporate The Incredible You 10 week coaching | ENGLISH | 10 |
| 54 | IY10CX | The Incredible You CX | ENGLISH | 10 |

### Foundation Programs
| ID | Code | Title | Language | Weeks |
|----|------|-------|----------|-------|
| 4 | IYFC | The Incredible You Foundation Hindi | HINDI | 4 |
| 7 | CTFFX | Coach to a Fortune Foundation X | ENGLISH | 5 |
| 10 | CFFX | Coach to a Fortune Foundation X In Hindi | HINDI | 6 |
| 14 | IYF | The Incredible You Foundation | ENGLISH | 5 |

### Speak To Fortune Programs
| ID | Code | Title | Language | Weeks |
|----|------|-------|----------|-------|
| 5 | STFME | Speak To A Fortune Mastermind Edition | ENGLISH | 7 |
| 12 | STF2.0 | Speak To a Fortune 2.0 foundation | ENGLISH | 5 |

### Wealth/SMB Programs
| ID | Code | Title | Language | Weeks |
|----|------|-------|----------|-------|
| 8 | SMBP | 4 Week Incredible Wealth Mindset Reset | ENGLISH | 4 |
| 9 | SMB | SMB Money Management System | ENGLISH | 4 |
| 25 | SMBCRY | The Secret Millionaire Blueprint | ENGLISH | 5 |
| 26 | MCLG | The Incredible You Millionaire Challenge | ENGLISH | 5 |

### Other Programs
| ID | Code | Title | Language | Weeks |
|----|------|-------|----------|-------|
| 13 | BTF | The Incredible 6 Figure Author System | ENGLISH | 10 |
| 23 | HINDIPRACT | Practice Tool | HINDI | 0 |
| 24 | ENGLISHPRACT | Practice Tool | ENGLISH | 0 |
| 27 | PERASS | Personality Assessment Full Report | ENGLISH | 0 |
| 51 | PERASSENG | INNER DNA Assessment LINK | ENGLISH | 0 |
| 52 | PERASSHIN | INNER DNA Assessment LINK In Hindi | HINDI | 0 |
| 53 | HTSM | High Ticket Sales Mastery | ENGLISH | 0 |

---

## 🎯 ACTIVITY TYPES (Step Activities)

| Code | Activity | Description |
|------|----------|-------------|
| 0 | Video Only | No interactive activity, just video |
| 1 | Inner DNA Test | Personality assessment trigger |
| 2 | Personality Assessment | Full personality test |
| 3 | Wheel of Life | 8-area life rating tool |
| 4 | Discover Baselines | Word selection activity |
| 8 | Coding Tool | N-codes & E-codes activity |
| 11 | Decision Making Wheel | 9-question decision analysis |
| 12 | Define Outcome | Outcome priority calculator |
| 17 | Video + Debrief | Video with discussion activity |
| 18 | Certification | Certification step |
| 19 | Registration Link | External registration |
| 20 | Niche Discovery | BTF book niche finder |
| 21 | Training Schedule | Schedule display |
| 24 | Hub/Form Activity | Generic hub activity |

---

## 🧬 INNER DNA SYSTEM (Complete)

### Overview
The Inner DNA system is a two-stage personality assessment:
1. **RHETI Assessment** - Determines Enneagram type
2. **Hero Moments** - Identifies core values

### Stage 1: RHETI Enneagram Assessment
- **Total Questions:** 380
- **Format:** Forced choice (Option A or Option B)
- **Each option maps to:** One of 9 Enneagram types
- **Output:** Primary type + Wing (e.g., "Type 6w5")
- **Languages:** Hindi (Hinglish), English

**Sample Questions (Hindi):**
```json
{
  "id": 1,
  "option_a": "Main roman-masta aur kalpanasheel raha hoon.",
  "option_b": "Main vyavharik aur zameen se juda hua raha hoon.",
  "type_a": 4,
  "type_b": 6
}
```

### Stage 2: Hero Moments / Values Assessment
- **Total Values:** 713
- **Format:** "Would you be devastated if..." questions
- **Rating:** Importance scale or Yes/No
- **Output:** Top 5-10 core values

**Sample Values:**
- Abundance
- Boldness
- Clarity
- Conviction
- Discovery
- Endurance
- Expertise
- Flexibility
- Guidance

### 9 Enneagram Types

| Type | Name | Image |
|------|------|-------|
| 1 | Reformer | 1.png |
| 2 | Helper | 2.png |
| 3 | Achiever | 3.png |
| 4 | Individualist | 4.png |
| 5 | Investigator | 5.png |
| 6 | Sentinel | 6.png |
| 7 | Enthusiast | 7.png |
| 8 | Challenger | 8.png |
| 9 | Peacemaker | 9.png |

### Wing System
Each type can have influence from adjacent types:
- Type 1w9: Reformer with Peacemaker wing
- Type 1w2: Reformer with Helper wing
- Type 2w1: Helper with Reformer wing
- Type 2w3: Helper with Achiever wing
- etc.

### Type Descriptions Include:
- Positive traits (HTML list)
- Negative traits (HTML list)
- Full description (English)
- Full description (Hindi)
- Wing-specific variations

### Report Types Generated:
1. Individual Report
2. Corporate Report
3. Relationship Report
4. Career Report
5. Leadership Report
6. Team Report
7. Parenting Report
8. Communication Report
9. Stress Report
10. Growth Report

---

## 🎡 WHEEL OF LIFE

### 8 Life Areas

| # | English | Hindi | Color |
|---|---------|-------|-------|
| 1 | Health | Aapki Health | #5D94D3 |
| 2 | Friends & Family | Aapke Dost aur Aapka Parivar | #F6883F |
| 3 | Fun, Leisure & Recreation | Mazaa aur Manorajan | #F4C642 |
| 4 | Wealth | Dulat | #E783A4 |
| 5 | Relationship | Aapke Rishte | #8967C3 |
| 6 | Learning & Personal Growth | Hamesha Kuch Naya Sikhne Ki Koshish | #90BE6D |
| 7 | Possession | Aapki Sampathi | #7BC7C7 |
| 8 | Career | Aapka Career | #E86868 |

### Rating System
- Scale: 1-10
- Visualization: Radar/polar chart
- AI Insights: Generated based on ratings

---

## 🛠️ PRACTICE TOOLS (6 Tools)

| # | Tool | Activity Code | Database Table |
|---|------|---------------|----------------|
| 1 | Inner DNA Test | 1 | cc_personality_report |
| 2 | Wheel of Life | 3 | cc_wheeloflife_report |
| 3 | Baselines | 4 | cc_baselines_report |
| 4 | N-codes & E-codes | 8 | cc_beliefs_report |
| 5 | Define My Outcomes | 12 | cc_outcome_report |
| 6 | Decision Making Wheel | 11 | cc_decision_wheel_report |

---

## 📺 SAMPLE STEPS WITH VIMEO IDs

### IYCTHUB (English Coach Training) - Week 0
| Step | Title | Vimeo ID | Duration |
|------|-------|----------|----------|
| 1 | WHAT COACHING REALLY IS? | 742211064 | 06:13 |
| 2 | WHAT IS YOUR VISION AND MISSION? | 742210982 | 09:12 |
| 3 | THE POWER OF IMAGINATION | 742211132 | 12:45 |
| 4 | INNER DNA TEST | Activity 1 | - |

### IYCTHUB (English Coach Training) - Week 1
| Step | Title | Vimeo ID | Duration |
|------|-------|----------|----------|
| 1 | THE WELCOME SESSION | 742213307 | 16:19 |
| 2 | THE WELCOME SESSION DEBRIEF & THE INNER DNA TEST DEBRIEF | 742213518 | 16:51 |
| 3 | THE WHEEL OF LIFE | Activity 3 | - |
| 4 | WHEEL OF LIFE DEBRIEF | 742213653 | 29:08 |
| 5 | INNER DNA | Activity 17 | - |
| 6 | THE SPEECH | Activity 17 | - |
| 7 | THE SPEECH DEBRIEF | 742213817 | 13:00 |
| 8 | DISCOVER YOUR BASELINES | Activity 4 | - |
| 9 | DISCOVER YOUR BASELINES DEBRIEF | 742213932 | 30:17 |
| 10 | BASELINES EXPRESSION | 742214131 | 39:35 |
| 11 | BASELINES EXPRESSION DEBRIEF | 742214448 | 24:30 |
| 12 | BASELINES NON-EXPRESSION ACTIVITY | 742214697 | 22:05 |
| 13 | BASELINES NON-EXPRESSION DEBRIEF | Activity 17 | - |
| 14 | THE CHANGE | 742214926 | 20:18 |
| 15 | THE CHANGE DEBRIEF | Activity 17 | - |

### IYCTHINDI (Hindi Coach Training) - Week 0
| Step | Title | Vimeo ID | Duration |
|------|-------|----------|----------|
| 1 | INNER DNA TEST | Activity 1 | - |
| 2 | SAFAR KI SHURUAAT | 742591360 | 09:33 |
| 3 | INNER DNA TEST KO BEHTAR SE SAMJHE | 742590583 | 41:28 |
| 4 | ACTIVITY | Activity 17 | - |

---

## 🔓 WEEK UNLOCK SYSTEM

### Hybrid System: Payment + Completion + Manual

**Payment-Based:**
- Weeks unlock when corresponding installment is paid
- `open_week` field determines which weeks unlock
- Full payment = all weeks unlocked immediately

**Completion-Based:**
- Next week unlocks when all steps in current week completed
- `we_type = 'free'` → auto-unlocks
- `we_type = 'paid'` → requires payment

**Manual:**
- Admins can lock/unlock weeks per user
- Routes: `admin/Coach_Mangement/bulk_week_unlock`

### Status Values
- `week_access`: 0=Locked, 1=Unlocked
- `status`: 0=Not started, 1=In progress, 2=Completed

---

## 📣 MARKETING HUB

### Share Link System
- **Format:** `{base_url}/{marketing_prg_reg_link}/{user_id}`
- **Personality Test:** `{base_url}/program/personality_test/register/{program_id}/{user_id}`
- **Tracking:** `parent_user_id` field

### Share Limits
- `market_share_count` - Program shares per coach
- `personality_count` - Inner DNA test links
- `big_personality_count` - Big personality assessment links

### Share Channels
1. Copy Link
2. WhatsApp
3. Facebook
4. Email

---

## 🎓 CERTIFICATION SYSTEM

### Requirements
1. Complete all program weeks
2. Upload certification video(s)
3. Pass MCQ quiz (100% required)
4. Admin approval

### Approval Statuses
- 1 = Pending
- 2 = Approved
- 3 = Rejected

### Certificate Generation
- Template stored in `prg_certificate_design`
- Generated certificates in `cc_generate_certificate`
- Custom background, signatures, fonts

---

## 🗄️ DATABASE TABLE MAPPING

### Core Tables
| Purpose | Old Table | New Table |
|---------|-----------|-----------|
| Programs | prg_master | programs |
| Weeks | prg_week_management | program_weeks |
| Steps | prg_steps_management | program_steps |
| Enrollments | cc_program_access | user_program_enrollment |
| Step Progress | cc_steps | user_step_progress |
| Week Access | cc_week_access | user_week_access |
| Users | cc_coach | users |
| Batches | prg_batch_management | batches |

### Activity Tables
| Tool | Table |
|------|-------|
| Wheel of Life | cc_wheeloflife_report |
| Baselines | cc_baselines_report |
| N-codes | cc_beliefs_report |
| Outcomes | cc_outcome_report |
| Decision Wheel | cc_decision_wheel_report |
| Personality | cc_personality_report |

### Inner DNA Tables
| Purpose | Table |
|---------|-------|
| RHETI Questions | prg_personality_assessment |
| Type Definitions | prg_personality_type |
| Hero Values | prg_inner_dna_new |
| User Results | cc_personality_report |

---

## 🎬 VIMEO CONFIGURATION

- **Embed Method:** iframe
- **Privacy:** Domain restricted
- **URL Format:** `https://player.vimeo.com/video/{video_id}?api=1`
- **Player Class:** `player1`
- **Video ID Field:** `stp_videoid` in `prg_steps_management`
- **Duration Field:** `stp_video_length`

---

## 📁 SOURCE FILES

All JSON files in project `docs/` folder:
```
docs/
├── prompt3_program_content_COMPLETE.json    # 49 programs, 933 steps
├── inner_dna_complete_system.json           # Full Inner DNA system
├── personality_type_descriptions.json       # Enneagram types with wings
├── practice_tools_COMPLETE.json             # 6 practice tools
├── treasures_and_bonuses.json               # Treasures system
├── batch_and_week_unlock.json               # Unlock logic
├── marketing_hub_and_certification.json     # Marketing & certification
├── database_tables_and_vimeo.json           # Table mappings
```

---

## ⏳ STILL NEEDED

1. **Full step data export** - CSV with all 933 steps, Vimeo IDs, activity types
2. **Inner DNA revamp files** - User mentioned more files coming
3. **Tool question content** - Actual questions for each tool

---

**END OF EXTRACTED DATA SUMMARY**

**Last Updated:** December 5, 2025 (Live Server Data)
