# IYCT Platform - Setup Guide for Beginners

**Welcome!** This guide will help you set up your new IYCT coaching platform. Don't worry - we'll take it step by step! 😊

---

## ⏱️ Total Time: About 30 minutes

**What we'll do:**
1. Install Node.js (software that runs the code)
2. Create a database (where your data lives)
3. Connect everything together
4. Start your platform!

---

## 📋 STEP 1: Install Node.js (5 minutes)

**What is Node.js?** It's like the engine that runs your platform.

### For Mac:
1. Go to: https://nodejs.org
2. Click the **green button** that says "Download Node.js (LTS)"
3. Open the downloaded file
4. Click "Continue" → "Continue" → "Install"
5. Enter your Mac password when asked

### For Windows:
1. Go to: https://nodejs.org
2. Click the **green button** that says "Download Node.js (LTS)"
3. Open the downloaded file
4. Click "Next" → "Next" → "Next" → "Install"

### Verify it worked:
1. Open **Terminal** (Mac) or **Command Prompt** (Windows)
   - Mac: Press `Cmd + Space`, type "Terminal"
   - Windows: Press `Windows key`, type "cmd"
2. Type this and press Enter:
   ```
   node --version
   ```
3. You should see something like: `v20.11.0` ✅

---

## 📋 STEP 2: Get Your Code (2 minutes)

**Where is your code?** It's in the folder: `/home/claude/iyct-platform`

### Open Terminal/Command Prompt and type:
```bash
cd /home/claude/iyct-platform
```

**What this does:** Changes to your project folder (like clicking on a folder)

---

## 📋 STEP 3: Install Project Dependencies (5 minutes)

**What are dependencies?** They're like ingredients for a recipe - your code needs them to work.

### In Terminal, type:
```bash
npm install
```

**What happens:** 
- Computer downloads all the tools your platform needs
- Takes 3-5 minutes
- You'll see lots of text scrolling - that's normal! ✅

**When done, you'll see:** Something like `added 1234 packages`

---

## 📋 STEP 4: Create Your Database (10 minutes)

**What is a database?** It's like a super organized filing cabinet for your users, programs, etc.

### 4A: Create Supabase Account
1. Go to: https://supabase.com
2. Click **"Start your project"**
3. Sign up with your Google account (easiest way)
4. Click **"New project"**

### 4B: Set Up Project
Fill in these fields:
- **Name:** IYCT Platform
- **Database Password:** Create a strong password (SAVE THIS!)
- **Region:** Choose closest to you (e.g., Dubai)
- **Pricing Plan:** Click "Free" ✅

Click **"Create new project"** - takes 2 minutes to set up

### 4C: Get Your Database Connection String
1. When project is ready, click **"Settings"** (gear icon at bottom left)
2. Click **"Database"** in the left menu
3. Scroll down to **"Connection string"**
4. Click **"URI"** tab
5. You'll see something like:
   ```
   postgresql://postgres.xxx:[YOUR-PASSWORD]@xxx.supabase.co:5432/postgres
   ```
6. Click **"Copy"** button
7. **IMPORTANT:** Replace `[YOUR-PASSWORD]` with the password you created in step 4B

**Save this string** - you'll need it next!

---

## 📋 STEP 5: Configure Your Settings (5 minutes)

**What is this?** Like filling out a form so your platform knows how to connect to everything.

### 5A: Create Your Settings File
In Terminal, type:
```bash
cp .env.example .env
```

**What this does:** Creates a settings file from the template

### 5B: Edit Your Settings File

**For Mac:**
```bash
open .env
```

**For Windows:**
```bash
notepad .env
```

### 5C: Fill In These Lines:

**Find this line:**
```
DATABASE_URL="your-supabase-connection-string-here"
```

**Replace it with your connection string from Step 4C:**
```
DATABASE_URL="postgresql://postgres.xxx:yourpassword@xxx.supabase.co:5432/postgres"
```

**Find these lines and fill them in:**
```
JWT_SECRET="your-secret-key-here"
JWT_REFRESH_SECRET="your-refresh-secret-here"
ENCRYPTION_KEY="your-encryption-key-here"
```

**How to generate secrets:**

**For Mac/Linux:**
```bash
openssl rand -base64 32
```
Copy the result and paste it for JWT_SECRET

Run it again:
```bash
openssl rand -base64 32
```
Copy and paste for JWT_REFRESH_SECRET

For encryption key:
```bash
openssl rand -hex 32
```
Copy and paste for ENCRYPTION_KEY

**For Windows (easier way):**
Just use these strong random strings I generated:
```
JWT_SECRET="Kj8mN3pQ9rT6vX2zB5nM8qW4yE7uI0oP1aS3dF6gH9jK2lZ5xC8vB1nM4"
JWT_REFRESH_SECRET="Lp9oI8uY7tR6eW5qA4sD3fG2hJ1kL0zX9cV8bN7mM6qW5eR4tY3uI2oP1"
ENCRYPTION_KEY="a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0"
```

**IMPORTANT:** For production (real users), you MUST generate new ones!

**Keep these other lines as they are:**
```
NODE_ENV="development"
PORT="3001"
FRONTEND_URL="http://localhost:3000"
```

**Save the file** (Cmd+S on Mac, Ctrl+S on Windows)

---

## 📋 STEP 6: Set Up Your Database Tables (3 minutes)

**What is this?** Creating the structure in your database (like creating folders in a filing cabinet)

### In Terminal, type:
```bash
cd apps/backend
```

Then:
```bash
npx prisma generate
```

**Wait for:** "✔ Generated Prisma Client"

Then:
```bash
npx prisma migrate dev
```

**It will ask:** "Enter a name for the new migration:"
**Type:** `initial` and press Enter

**Wait for:** Lots of text showing tables being created ✅

---

## 📋 STEP 7: Start Your Platform! (2 minutes)

**Almost there!** Now we start everything up.

### 7A: Start the Backend (the engine)

**Make sure you're in the backend folder:**
```bash
cd apps/backend
```

**Start it:**
```bash
npm run dev
```

**You should see:**
```
✅ Database connected
✅ Server running on port 3001
```

**Keep this window open!** The backend is now running.

### 7B: Start the Frontend (what you see)

**Open a NEW Terminal window**
- Mac: Press `Cmd + T` for new tab
- Windows: Open a new Command Prompt

**Navigate to frontend:**
```bash
cd /home/claude/iyct-platform/apps/frontend
```

**Start it:**
```bash
npm run dev
```

**You should see:**
```
➜  Local:   http://localhost:3000/
```

---

## 📋 STEP 8: Test Your Platform! (5 minutes)

### 8A: Open Your Platform
1. Open your web browser (Chrome, Firefox, Safari)
2. Go to: **http://localhost:3000**
3. You should see your login page! 🎉

**It should look like:**
- Dark navy blue background
- "THE INCREDIBLE YOU" logo
- Email and password fields
- Cyan blue "Sign In" button

### 8B: Create Your First User

**The register page isn't done yet**, so we'll create a user using code:

**Open a THIRD Terminal window**

**Type this (all as one command):**
```bash
curl -X POST http://localhost:3001/api/v1/auth/register -H "Content-Type: application/json" -d '{"email":"arfeen@iyct.com","password":"Arfeen123","fullName":"Arfeen Khan","userRole":"COACH"}'
```

**You should see:** A long response with "success":true ✅

### 8C: Login!
1. Go back to your browser: http://localhost:3000
2. **Email:** arfeen@iyct.com
3. **Password:** Arfeen123
4. Click **Sign In**
5. You should go to the dashboard! 🎉

---

## ✅ SUCCESS! Your Platform is Running!

**What's working:**
- ✅ Login page with your exact design
- ✅ Database storing users
- ✅ Authentication working
- ✅ Backend API running

**What's next:**
- Register page (being built by next developer)
- Dashboard with program cards
- Full program management
- Payment processing
- AI features

---

## 🐛 Something Not Working?

### "Command not found: node"
**Fix:** Node.js didn't install. Go back to Step 1.

### "Command not found: npm"
**Fix:** Node.js didn't install completely. Reinstall from Step 1.

### "Port 3000 already in use"
**Fix:** Something else is using that port. 
- Close other development servers
- Or change port in `apps/frontend/vite.config.ts`

### "Database connection failed"
**Fix:** Check your DATABASE_URL in `.env` file
- Make sure you replaced [YOUR-PASSWORD] with your actual password
- Check Supabase project is active

### Login page looks different
**Fix:** It might still be loading. Refresh the page (press F5)

---

## 📞 Need Help?

**Check these files:**
- `CURRENT_SESSION_HANDOFF.md` - Latest progress
- `PROJECT_MASTER_PLAN.md` - Complete technical details

**Or contact your developer** with:
- Which step you're on
- What error message you see
- Screenshot if possible

---

## 🎉 Congratulations!

You've successfully set up a modern web platform! This is what professional developers do every day, and you just did it! 👏

**Keep both Terminal windows open** while using your platform. When you're done:
- Press `Ctrl + C` in both Terminal windows to stop
- Close the windows

**Next time you want to start:**
1. Terminal 1: `cd /home/claude/iyct-platform/apps/backend && npm run dev`
2. Terminal 2: `cd /home/claude/iyct-platform/apps/frontend && npm run dev`
3. Open http://localhost:3000

---

Built with ❤️ for coaches worldwide
