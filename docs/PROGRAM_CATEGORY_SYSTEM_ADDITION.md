# PROGRAM CATEGORY SYSTEM ADDITION

**Added:** December 5, 2025  
**Status:** Phase 1 Complete (UI), Phase 2 Pending (Database)  
**Reference:** ADMIN_PANEL_MASTER_PLAN_ADDITION.md

---

## 1. OVERVIEW

The Program Category System organizes 32+ programs into logical groups for better admin management and user navigation.

---

## 2. CATEGORY STRUCTURE

### 2.1 Default Categories

| Category ID | Name | Description | Color | Match Codes |
|-------------|------|-------------|-------|-------------|
| `incredible-you` | Incredible You | Coach training & personal development | #5dade2 | iy10, iy-, iyf |
| `secret-millionaire` | Secret Millionaire Blueprint | Wealth building & money mindset | #34c38f | smb, ctf, wmr |
| `speak-to-fortune` | Speak To Fortune | Public speaking mastery | #f0ad4e | stf |
| `6-figure-author` | 6 Figure Author | Book writing & publishing | #e74c3c | 6fas |

### 2.2 Program Distribution (32 Programs)

```
Incredible You (18 programs)
├── IY10 - Coach Training 10 Weeks (en)
├── IY10-L1 - Level 1 (en)
├── IY10-HI - Hindi version (hi)
├── IY10-HI-L1 - Hindi Level 1 (hi)
├── IY10-HI-L2 - Hindi Level 2 (hi)
├── IYF - 5 Weeks Program (en)
├── IYF-HI - 5 Weeks Hindi (hi)
├── IY-CT-L1 - Coach Training L1 (en)
├── IY-CT-L2 - Coach Training L2 (en)
├── IY-FND - Foundation (en)
├── IY-FND-HI - Foundation Hindi (hi)
├── IY-MH - Mind Hacker (en)
├── IY-MH-HI - Mind Hacker Hindi (hi)
├── IY-MH-HI-L1 - Mind Hacker Hindi L1 (hi)
├── IY-MH-HI-L2 - Mind Hacker Hindi L2 (hi)
├── IY-MC - Millionaire Challenge (en)
├── IY-PRE - Prestudy (en)
└── IY-DEMO - Demo (en)

Secret Millionaire Blueprint (8 programs)
├── SMB - Full Program 12 weeks (en)
├── SMB-MMS - Money Management System (en)
├── SMB-FND - Foundation (en)
├── SMB-PRE - Prestudy (en)
├── SMB-DEMO - Demo (en)
├── CTF-FND - Coach To Fortune Foundation (en)
├── CTF-FND-HI - Coach To Fortune Hindi (hi)
└── WMR-4W - Wealth Mindset Reset (en)

Speak To Fortune (5 programs)
├── STFME - Mastermind Edition (en)
├── STF2-FND - 2.0 Foundation (en)
├── STF-FND - Foundation (en)
├── STF-PRE - Prestudy (en)
└── STF-DEMO - Demo (en)

6 Figure Author (1 program)
└── 6FAS - Author System (en)
```

---

## 3. IMPLEMENTATION PHASES

### Phase 1: UI Implementation ✅ (Complete)

**Features:**
- Collapsible category sections
- Language filter (All | English | Hindi)
- Expand/Collapse all buttons
- Program cards grouped by category
- "Move to..." action in program menu
- Category program counts
- Color-coded category headers

**Files:**
- `apps/frontend/src/pages/admin/ProgramManagement.tsx`

### Phase 2: Database Integration (Future)

**Schema Changes:**
```prisma
model ProgramCategory {
  id          String    @id @default(uuid())
  name        String
  slug        String    @unique
  description String?
  color       String    @default("#5dade2")
  sortOrder   Int       @default(0)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  programs    Program[]
}

model Program {
  // ... existing fields
  categoryId  String?
  category    ProgramCategory? @relation(fields: [categoryId], references: [id])
}
```

**API Endpoints:**
```
GET    /api/v1/admin/categories        - List all categories
POST   /api/v1/admin/categories        - Create category
PATCH  /api/v1/admin/categories/:id    - Update category
DELETE /api/v1/admin/categories/:id    - Delete category (if empty)
PATCH  /api/v1/admin/programs/:id/category - Move program to category
```

**Migration Script:**
```typescript
// Assign existing programs to categories based on matchCodes
async function assignCategories() {
  const categories = await prisma.programCategory.findMany();
  const programs = await prisma.program.findMany();
  
  for (const program of programs) {
    const category = categories.find(cat => 
      cat.matchCodes.some(code => program.slug.startsWith(code))
    );
    if (category) {
      await prisma.program.update({
        where: { id: program.id },
        data: { categoryId: category.id }
      });
    }
  }
}
```

### Phase 3: Category Management UI (Future)

**Features:**
- Create new categories modal
- Edit category (name, description, color)
- Delete category (only if empty)
- Drag-and-drop programs between categories
- Reorder categories

---

## 4. UI SPECIFICATIONS

### 4.1 Category Section Header

```
┌─────────────────────────────────────────────────────────────────────┐
│ ▼  ●  Incredible You                                    18 programs │
│      Coach training & personal development programs                  │
└─────────────────────────────────────────────────────────────────────┘
```

- Chevron icon toggles expand/collapse
- Color dot matches category color
- Program count badge on right
- Clicking anywhere on header toggles section

### 4.2 Filter Bar

```
┌──────────────────────────────────────────────────────────────────────────┐
│ [All] [English] [Hindi]   [Expand All] [Collapse All]   🔍 Search...  [+]│
└──────────────────────────────────────────────────────────────────────────┘
```

### 4.3 Program Card Actions

```
┌─────────────┐
│ 👁 View     │
│ ✏️ Edit     │
│ 📁 Move to..│ → [Incredible You      ]
│             │   [Secret Millionaire  ]
│             │   [Speak To Fortune    ]
│             │   [6 Figure Author     ]
│ 🗑 Delete   │
└─────────────┘
```

---

## 5. LANGUAGE FILTER LOGIC

```typescript
const isHindi = program.programId?.includes('-hi') || program.language === 'hi';

// Filter logic
const matchesLanguage = 
  languageFilter === 'all' ||
  (languageFilter === 'hi' && isHindi) ||
  (languageFilter === 'en' && !isHindi);
```

---

## 6. FUTURE ENHANCEMENTS

1. **Program Bundles:** Group programs into purchasable bundles
2. **Category Analytics:** Revenue and enrollment stats per category
3. **User Category Preferences:** Show relevant categories first based on user purchases
4. **Category-based Pricing:** Different pricing tiers per category
5. **Category Landing Pages:** Public-facing category pages for marketing

---

## 7. DESIGN TOKENS

```typescript
const categoryColors = {
  'incredible-you': '#5dade2',      // Blue
  'secret-millionaire': '#34c38f',   // Green
  'speak-to-fortune': '#f0ad4e',     // Orange
  '6-figure-author': '#e74c3c',      // Red
};
```

---

**End of Addition**
