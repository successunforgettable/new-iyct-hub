# REPLIT DATA EXTRACTION PROMPTS
## Send These One at a Time

---

## PROMPT 1 OF 8

```
I need you to extract data from this PHP codebase for a migration project. I will send you 8 prompts total. 

For each prompt, return data in the EXACT JSON format I specify. If you can't find something, use null - don't guess.

Reply "READY" when you understand, then I'll send Prompt 2.
```

---

## PROMPT 2 OF 8

```
PROMPT 2 OF 8: COACH TRAINING PROGRAM STRUCTURE

Find the 5-week coach training program structure. Return this exact JSON:

{
  "program": {
    "name": "string",
    "description": "string",
    "duration_weeks": 5
  },
  "weeks": [
    {
      "week_number": 1,
      "title": "string",
      "description": "string",
      "steps": [
        {
          "step_number": 1,
          "title": "string",
          "type": "video | text | assignment | quiz | tool",
          "vimeo_id": "string if video",
          "duration_minutes": 0,
          "assignment_instructions": "string if assignment"
        }
      ]
    }
  ]
}

Include ALL 5 weeks with ALL steps in each week.
```

---

## PROMPT 3 OF 8

```
PROMPT 3 OF 8: CLIENT 10-WEEK PROGRAM STRUCTURE

Find the 10-week client program (delivered by coaches to their clients). Return this exact JSON:

{
  "program": {
    "name": "string",
    "description": "string",
    "duration_weeks": 10
  },
  "weeks": [
    {
      "week_number": 1,
      "title": "string",
      "theme": "string",
      "steps": [
        {
          "step_number": 1,
          "title": "string",
          "type": "video | text | assignment | tool",
          "vimeo_id": "string if video",
          "duration_minutes": 0
        }
      ]
    }
  ]
}

Include ALL 10 weeks with ALL steps.
```

---

## PROMPT 4 OF 8

```
PROMPT 4 OF 8: PRACTICE TOOLS

Find all practice tools (Wheel of Life, Baselines, N-codes, etc.). For EACH tool return:

{
  "tools": [
    {
      "tool_id": "wheel_of_life",
      "name": "Wheel of Life",
      "database_table": "string",
      "fields": [
        {
          "field_name": "health",
          "field_label": "Health",
          "field_type": "rating_1_10 | text | select",
          "required": true
        }
      ],
      "has_ai_insights": true
    }
  ]
}

List ALL tools found in the codebase.
```

---

## PROMPT 5 OF 8

```
PROMPT 5 OF 8: TREASURES AND BONUSES

Find treasures (coach training) and bonuses (client program). Return:

{
  "treasures": [
    {
      "title": "string",
      "description": "string",
      "file_type": "pdf | video | ebook",
      "file_url": "string",
      "access_rule": "string"
    }
  ],
  "bonuses": [
    {
      "title": "string",
      "description": "string",
      "file_type": "pdf | video | ebook",
      "unlock_trigger": "enrollment | week_X_complete"
    }
  ]
}
```

---

## PROMPT 6 OF 8

```
PROMPT 6 OF 8: BATCH AND WEEK UNLOCK SYSTEM

Find how batches work and how weeks unlock. Return:

{
  "batch_system": {
    "enabled": true,
    "database_table": "string",
    "batch_fields": ["name", "start_date", "etc"]
  },
  "week_unlock": {
    "method": "batch_schedule | time_based | completion_based | manual",
    "schedule": [
      { "week": 1, "unlock_rule": "immediate" },
      { "week": 2, "unlock_rule": "7 days after week 1" }
    ]
  }
}
```

---

## PROMPT 7 OF 8

```
PROMPT 7 OF 8: MARKETING HUB AND CERTIFICATION

Find marketing hub (referrals) and certification system. Return:

{
  "marketing_hub": {
    "share_link_format": "string",
    "shares_limit": 100,
    "referral_tracking_table": "string",
    "commission_enabled": true,
    "commission_percent": 10
  },
  "certification": {
    "video_required": true,
    "min_duration_minutes": 5,
    "approval_statuses": ["pending", "approved", "rejected"],
    "certificate_template_path": "string"
  }
}
```

---

## PROMPT 8 OF 8

```
PROMPT 8 OF 8: DATABASE TABLES AND VIMEO SETUP

List all key database tables and Vimeo configuration. Return:

{
  "database_tables": {
    "programs": "actual_table_name",
    "weeks": "actual_table_name", 
    "steps": "actual_table_name",
    "enrollments": "actual_table_name",
    "progress": "actual_table_name",
    "batches": "actual_table_name",
    "treasures": "actual_table_name",
    "certifications": "actual_table_name",
    "wheel_of_life": "actual_table_name",
    "baselines": "actual_table_name",
    "ncodes": "actual_table_name"
  },
  "vimeo": {
    "embed_method": "iframe | player_js",
    "privacy_setting": "public | private | domain_restricted",
    "sample_embed_code": "string"
  }
}
```

---

## AFTER ALL 8 PROMPTS

Send all responses back to Claude for processing.
