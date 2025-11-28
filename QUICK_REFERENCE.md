# IYCT Platform - Quick Reference Card
**Print this and keep it handy!** 📋

---

## 🚀 STARTING YOUR PLATFORM (Daily Use)

### Step 1: Start Backend
```bash
cd /home/claude/iyct-platform/apps/backend
npm run dev
```
**Wait for:** ✅ Database connected

### Step 2: Start Frontend (NEW Terminal window)
```bash
cd /home/claude/iyct-platform/apps/frontend
npm run dev
```
**Wait for:** ➜ Local: http://localhost:3000/

### Step 3: Open in Browser
Go to: **http://localhost:3000**

---

## 🛑 STOPPING YOUR PLATFORM

1. Go to each Terminal window
2. Press: **Ctrl + C**
3. Close the windows

---

## 👤 CREATE NEW USER (Until Register Page is Built)

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"YourPass123","fullName":"Your Name","userRole":"COACH"}'
```

**Then login at:** http://localhost:3000

---

## 📁 IMPORTANT FILES

**Setup Guide (detailed):** `/home/claude/iyct-platform/README.md`  
**Progress Tracker:** `/home/claude/iyct-platform/CURRENT_SESSION_HANDOFF.md`  
**Settings File:** `/home/claude/iyct-platform/.env`

---

## 🐛 QUICK FIXES

**"Port already in use"**
- Stop other servers first
- Or restart your computer

**"Database connection failed"**
- Check `.env` file has correct DATABASE_URL
- Make sure Supabase project is active

**Login page looks broken**
- Refresh the page (F5)
- Clear browser cache

**Nothing works**
- Make sure both Terminal windows are running
- Check for red error messages in Terminal

---

## 🔢 PORTS TO REMEMBER

- **Backend (API):** http://localhost:3001
- **Frontend (Website):** http://localhost:3000
- **Database:** On Supabase (online)

---

## 📞 WHEN TO CALL YOUR DEVELOPER

- If you see red error messages you can't fix
- If login stops working
- If you need to add new features
- If you want to deploy to production

---

## ✅ WHAT'S WORKING NOW

- ✅ Login page (beautiful dark design)
- ✅ User authentication
- ✅ Database with all tables
- ✅ Backend API

## ⏳ WHAT'S COMING NEXT

- Register page (in progress)
- Dashboard with program cards
- Full program management
- Payment processing
- AI coaching features

---

**Keep this card handy!** These are the commands you'll use every day.

---

🎉 You're doing great! You've set up a professional web platform!
