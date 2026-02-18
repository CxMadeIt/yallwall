# YallWall - Context Refresh Summary

## 🎯 PROJECT STATUS

**YallWall** is a hyper-local, real-time chat platform for communities.
**Tagline:** "Your City's Living Room"
**Website:** https://yallwall.com

---

## ✅ WHAT'S BEEN BUILT

### UI/UX (Complete - LIQUID GLASS 2026 Design)
- **Deep Navy** (#0D1B2A) background 
- **Liquid Glass Cards** - frosted glass with `backdrop-filter: blur(20px)`
- **Amber/Gold** (#F5A623) accent color
- **Plus Jakarta Sans** + **Inter** typography
- **Card-based chat** UI with glassmorphism
- **Time filter tabs:** Live, 1 Hour, Today, Week (floating glass pill)
- **Tip system** with 🪙 coin animations
- **Swipe gestures:** Right=Tip, Left=Hide
- **Thread view** for replies (glass modal)
- **"🔥 Hot" badges** for popular posts
- **Emergency Alert** badges
- **Slim Header** - profile pic | city name | bell + menu
- **Floating Input Pill** - glass input that hovers above feed
- **Floating Bottom Nav** - 4-icon glass pill navigation
- **Profile Drawer** - slides in from left

### Features
- 24-hour disappearing messages
- Location tags on posts
- Business sponsored cards (amber glass border)
- Real-time neighbor count
- Mobile-first responsive design
- Glassmorphism throughout (visionOS/iOS 26 aesthetic)

### Design Philosophy
- "Liquid Glass" - frosted glass floating on deep navy
- "Calm Technology" - interface disappears, just the experience remains
- Nextdoor's opposite: fast, positive, city-scale
- Warm Southern diner feel, not corporate
- 2026 premium design language

---

## 🏗️ TECH STACK

```
Frontend:  Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
Backend:   Supabase (PostgreSQL + Auth + Realtime)
Hosting:   Cloudflare Pages (recommended) or GoDaddy + Cloudflare DNS
Domain:    yallwall.com
Fonts:     Plus Jakarta Sans, Inter
```

---

## 📁 PROJECT STRUCTURE

```
/home/chris/workspace/yallwall/
├── my-app/                          # Next.js application
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── concept-cards/page.tsx   # Chat demo (CURRENT MVP - LIQUID GLASS)
│   │   └── globals.css              # Glass CSS utilities
│   ├── components/ui/               # shadcn components
│   ├── lib/supabase.ts              # Database client (placeholder)
│   └── dist/                        # BUILT FILES - DEPLOY THIS
├── DATABASE_SCHEMA.sql              # Full database setup
├── SUPABASE_SETUP.md                # Setup instructions
├── PROJECT_BRIEF.md                 # Full project vision
└── DESIGN.md                        # Design system
```

---

## 🚀 CURRENT TASKS

### Immediate (Next)
1. **Deploy to yallwall.com**
   - Use Cloudflare Pages (modern, free, fast)
   - Or upload `/my-app/dist/` to GoDaddy
   - Test on mobile

2. **Supabase Setup**
   - Create project at https://supabase.com
   - Run `DATABASE_SCHEMA.sql`
   - Set up Google OAuth
   - Add env vars to `.env.local`

3. **Authentication**
   - Google Sign-In
   - Email/Password option
   - Anonymous browsing (no auth required to view)

4. **Real-time Chat**
   - WebSocket subscriptions
   - Message posting/retrieval
   - 24hr auto-expiry

### Phase 2 (Post-Launch)
- Map integration (incident pins)
- Business directory
- Push notifications
- Multi-city expansion

---

## 🎨 DESIGN TOKENS (Liquid Glass 2026)

```css
/* Background */
--navy: #0D1B2A        /* Deep background */
--navy-dark: #0A1520   /* Darker sections */

/* Glass Cards */
--glass-bg: rgba(255, 255, 255, 0.12)
--glass-border: rgba(255, 255, 255, 0.2)
--glass-blur: blur(20px)
--glass-shadow: 0 4px 24px rgba(0, 0, 0, 0.15)

/* Glass Input */
--input-bg: rgba(255, 255, 255, 0.15)
--input-border: rgba(255, 255, 255, 0.25)
--input-blur: blur(24px)
--input-radius: 50px

/* Accent */
--amber: #F5A623       /* Primary accent */
--amber-light: #F7B84E /* Hover states */

/* Text on Glass */
--text-primary: rgba(255, 255, 255, 0.95)
--text-secondary: rgba(255, 255, 255, 0.7)
--text-muted: rgba(255, 255, 255, 0.5)

/* Typography */
Headers: Plus Jakarta Sans
Body: Inter

/* Border Radius */
Cards: 20px
Buttons: 12px
Input Pill: 50px
Nav Pill: 50px
```

---

## 🎯 POSITIONING (vs Nextdoor)

| Nextdoor | YallWall |
|----------|----------|
| Neighborhood watch | City's living room |
| Slow/async | Real-time chat |
| Real names required | Optional anonymity |
| Complaint-heavy | Positivity by design (tipping) |
| No economy | Full tipping/gifting system |
| Corporate design | Liquid glass 2026 aesthetic |

---

## 💡 KEY FEATURES TO BUILD

### MVP (Now)
1. Auth (Google + Email)
2. Real-time chat with WebSockets
3. Message posting with 24hr expiry
4. Tip system (backend)
5. User profiles

### Killer Features (Differentiators)
1. **Emergency Mode** - Auto-pinned alerts during weather
2. **Business Drops** - Giveaways/contests from local biz
3. **QR Code Tips** - Tip people in real life
4. **Good Deed Feed** - Tipping creates visible social currency
5. **Leaderboards** - Monthly helpful neighbors

---

## 📋 NEXT ACTIONS

### Immediate (In Progress)
1. ✅ **Database schema ready** - See `DATABASE_SCHEMA.sql`
2. ✅ **Supabase packages installed** - `@supabase/supabase-js`, `@supabase/auth-helpers-nextjs`
3. ✅ **Supabase client setup** - See `lib/supabase.ts`
4. ⏳ **Create Supabase project** - You started this!
5. ⏳ **Run database schema** in SQL Editor
6. ⏳ **Add env vars** to `.env.local`

### Next
7. **Create auth pages** (login/signup)
8. **Connect real messages** to database
9. **Build real-time chat** with Supabase subscriptions

---

## 🔗 IMPORTANT FILES

- **Current MVP:** `/home/chris/workspace/yallwall/my-app/app/concept-cards/page.tsx`
- **Database Schema:** `/home/chris/workspace/yallwall/DATABASE_SCHEMA.sql`
- **Setup Guide:** `/home/chris/workspace/yallwall/SUPABASE_SETUP.md`
- **Built Files:** `/home/chris/workspace/yallwall/my-app/dist/`
- **Glass CSS:** `/home/chris/workspace/yallwall/my-app/app/globals.css`

---

## ⚠️ NOTES

- **Design:** Liquid Glass 2026 aesthetic complete
- **PILOT CITY:** Central Louisiana (Cenla) - NOT Austin first
- **Target demo:** 35-55+ year olds
- **Mobile-first** - everything designed for phone screens
- **Tip economy** is the secret sauce - lean into it
- **Deployment:** Use Cloudflare Pages, not old GoDaddy FTP method

---

## 🤝 HOW TO HELP

**Research Tasks:**
- Best practices for real-time chat scaling
- Supabase pricing/limits
- Competitor analysis (Citizen, Nextdoor)
- Marketing copy for launch

**Technical Tasks:**
- Set up Supabase auth
- Build login/signup UI
- Real-time subscriptions
- Push notification setup

**Documentation:**
- Privacy Policy
- Terms of Service
- User onboarding guide

---

**Ready to deploy?** The liquid glass MVP is built and ready! 🚀
