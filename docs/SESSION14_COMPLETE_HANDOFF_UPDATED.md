# SESSION 14 COMPLETE HANDOFF (UPDATED)
## IYCT Platform Migration - Live Server Data Received

**Date:** December 5, 2025  
**Project:** IYCT Coaching Platform Migration  
**Client:** Arfeen Khan  
**Status:** LIVE SERVER DATA COMPLETE - Ready for Implementation

---

## 🎯 WHAT WE'RE BUILDING

A comprehensive coaching platform with:
- **49 programs** across multiple categories
- **933 steps** with video content and activities
- **Inner DNA System** (Enneagram personality + values assessment)
- **6 Practice Tools** for coaching activities
- **Marketing Hub** for referral tracking
- **Certification System** with video uploads

---

## ✅ DATA NOW AVAILABLE

### From Live Server (Complete)
| Data | Count | Status |
|------|-------|--------|
| Programs | 49 | ✅ Complete |
| Weeks | 207 | ✅ Complete |
| Steps | 933 | ✅ Complete |
| RHETI Questions | 380 | ✅ Complete |
| Hero Moment Values | 713 | ✅ Complete |
| Enneagram Types | 9 | ✅ Complete |
| Wheel of Life Areas | 8 | ✅ Complete |
| Activity Type Mappings | 24 | ✅ Complete |
| Vimeo IDs (sample) | 50+ | ✅ Partial |

### Awaiting
- More Inner DNA revamp files (user will provide)
- Full 933 steps CSV export with all Vimeo IDs

---

## 📊 PROGRAM CATEGORIES

| Category | Count | Examples |
|----------|-------|----------|
| Coach Training | 8 | IYCTHUB, IYCTHINDI, IYCTLEVEL1/2 |
| 10-Week Coaching | 10 | IY10, IY10HINDI, CIY10, IY10CX |
| Foundation | 4 | IYF, IYFC, CTFFX |
| Speak To Fortune | 2 | STFME, STF2.0 |
| Wealth/SMB | 4 | SMB, SMBP, MCLG |
| Author | 1 | BTF (6 Figure Author) |
| Personality/Practice | 5 | PERASS, HINDIPRACT, ENGLISHPRACT |
| Other | 15 | Various demos, levels, corporate |

---

## 🎯 ACTIVITY TYPES

When a step has an activity, use this mapping:

| Code | Activity | What Happens |
|------|----------|--------------|
| 0 | Video Only | Just play video |
| 1 | Inner DNA Test | Launch personality assessment |
| 2 | Personality Assessment | Full RHETI test |
| 3 | Wheel of Life | 8-area rating tool |
| 4 | Discover Baselines | Word selection activity |
| 8 | Coding Tool | N-codes & E-codes |
| 11 | Decision Making Wheel | 9-question decision tool |
| 12 | Define Outcome | Outcome priority calculator |
| 17 | Video + Debrief | Video with discussion |
| 18 | Certification | Certification step |

---

## 🧬 INNER DNA SYSTEM

### Two-Stage Assessment

**Stage 1: RHETI (Enneagram)**
- 380 forced-choice questions
- Determines primary type (1-9) + wing
- Languages: English, Hindi

**Stage 2: Hero Moments (Values)**
- 713 values to rate
- "Would you be devastated if..." format
- Output: Top 5-10 core values

### 9 Enneagram Types
1. Reformer
2. Helper
3. Achiever
4. Individualist
5. Investigator
6. Sentinel
7. Enthusiast
8. Challenger
9. Peacemaker

### Report Types
Individual, Corporate, Relationship, Career, Leadership, Team, Parenting, Communication, Stress, Growth

---

## 🛠️ PRACTICE TOOLS (6 Tools)

| Tool | Activity Code | Database |
|------|---------------|----------|
| Inner DNA Test | 1 | cc_personality_report |
| Wheel of Life | 3 | cc_wheeloflife_report |
| Baselines | 4 | cc_baselines_report |
| N-codes & E-codes | 8 | cc_beliefs_report |
| Define My Outcomes | 12 | cc_outcome_report |
| Decision Making Wheel | 11 | cc_decision_wheel_report |

---

## 🎡 WHEEL OF LIFE

| Area | Color |
|------|-------|
| Health | #5D94D3 |
| Friends & Family | #F6883F |
| Fun & Recreation | #F4C642 |
| Wealth | #E783A4 |
| Relationship | #8967C3 |
| Learning & Growth | #90BE6D |
| Possession | #7BC7C7 |
| Career | #E86868 |

---

## 💻 TECHNICAL SETUP

### Start Platform
```bash
# Backend (Terminal 1)
cd ~/Desktop/iyct-platform/apps/backend
npm run dev
# → localhost:3001

# Frontend (Terminal 2)
cd ~/Desktop/iyct-platform/apps/frontend
npm run dev
# → localhost:3000
```

### URLs
- Frontend: http://localhost:3000
- Backend: http://localhost:3001/api/v1
- Admin: http://localhost:3000/admin

### Login
- Email: arfeen@iyct.com
- Password: Arfeen123

### Git
```bash
cd ~/Desktop/iyct-platform
git add . && git commit -m "message" && git push
```

---

## 🎨 DESIGN SYSTEM

```javascript
colors = {
  background: '#0a1628',
  card: '#1a2332',
  border: '#2a3b52',
  accent: '#5dade2',
  success: '#34c38f',
  warning: '#f0ad4e',
  error: '#dc3545',
}
```

---

## 📁 PROJECT FILES

### Documentation
```
docs/
├── EXTRACTED_DATA_SUMMARY_UPDATED.md    # All live server data
├── prompt3_program_content_COMPLETE.json # 49 programs, 933 steps
├── inner_dna_complete_system.json        # Full Inner DNA
├── personality_type_descriptions.json    # Enneagram types
├── practice_tools_COMPLETE.json
├── batch_and_week_unlock.json
├── marketing_hub_and_certification.json
├── database_tables_and_vimeo.json
```

### Key Reference Documents
1. `/mnt/project/EXECUTIVE_SUMMARY.md`
2. `/mnt/project/PROJECT_MASTER_PLAN.md`
3. `/mnt/project/PROJECT_MASTER_PLAN_PART2.md`
4. `/mnt/project/EXTRACTED_DATA_SUMMARY_UPDATED.md` (NEW)

---

## 🎯 WHAT TO BUILD NEXT

### Priority 1: Seed Program Data
1. Import 49 programs from `prompt3_program_content_COMPLETE.json`
2. Create weeks and steps with activity types
3. Store Vimeo IDs for video steps

### Priority 2: Program Navigation UI
1. Program list with categories
2. Week navigation with lock/unlock status
3. Step list with completion tracking
4. Video player (Vimeo embed)
5. Activity triggers based on activity type

### Priority 3: Practice Tools
1. Practice Tool landing page (6 cards)
2. Wheel of Life (8 areas, radar chart)
3. Baselines (word selection)
4. N-codes & E-codes
5. Define My Outcomes
6. Decision Making Wheel

### Priority 4: Inner DNA System
- Waiting for more files from user
- Will be complete revamp of personality assessment

### Priority 5: Other Features
1. Marketing Hub (share links)
2. Certification (video upload, MCQ quiz)
3. Treasures browser

---

## ⚠️ CRITICAL RULES

1. **No compromise** on master plan specs
2. **Documentation-first** - Reference docs before building
3. **Surgical fixes** - Don't recreate files
4. **Dark theme** - Preserve exact colors
5. **Activity types** - Use correct code mapping

---

## 🔑 KEY FACTS TO REMEMBER

| Fact | Value |
|------|-------|
| Total programs | 49 (not 32) |
| Total steps | 933 (not 48) |
| RHETI questions | 380 |
| Hero values | 713 |
| Practice tools | 6 |
| Wheel areas | 8 |
| Enneagram types | 9 |

---

## 📞 WAITING ON

1. **Inner DNA revamp files** - User will provide more
2. **Full steps CSV** - All 933 steps with Vimeo IDs

---

## ✅ SESSION 14 ACCOMPLISHMENTS

1. Received live server data (49 programs, 933 steps)
2. Documented complete Inner DNA system
3. Mapped all 24 activity types
4. Got Enneagram type descriptions with wings
5. Updated data summary with all new info
6. Created comprehensive handoff document

---

**END OF HANDOFF**

**Next Action:** Wait for Inner DNA revamp files, then begin seeding program data and building UI.
