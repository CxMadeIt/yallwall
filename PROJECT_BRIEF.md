# YallWall - Project Brief for OpenClaw

## What is YallWall?

YallWall is a **hyper-local, real-time chat platform** that serves as a city's "living room" - a place where neighbors can connect, share urgent updates, discover local businesses, and build community.

**Website:** https://yallwall.com
**Current Status:** Landing page MVP deployed, building auth & chat functionality

---

## The Vision

**"Every city deserves its own YallWall"**

We believe local communities need a dedicated space for real-time conversation that:
- **Disappears after 24 hours** (ephemeral - reduces noise, creates urgency)
- **Is mobile-first** (most users will be on phones)
- **Feels familiar yet fresh** (easy for 45+ users, cool enough for 35+)
- **Supports local businesses** (advertising integrated naturally)
- **Prioritizes safety** (emergency alerts, hazard reporting)

---

## Target Users

**Primary:** 35-55+ year olds in Central Louisiana (Cenla) who:
- Want to know what's happening in their neighborhood
- Use Facebook/Nextdoor but find them too slow/broadcast-y
- Care about local emergencies (weather, traffic, crime)
- Want to support local businesses

**Secondary:** Local business owners in Central Louisiana looking for affordable local advertising

---

## Key Features

### MVP (Building Now)
1. **Real-time Chat**
   - Card-based UI (not traditional bubbles)
   - Customizable bubble colors per user
   - 24-hour disappearing messages
   - Like/reaction system
   - Share functionality

2. **City-Based Feeds**
   - Central Louisiana (Cenla) - pilot region
   - Time filters: Live, 1 Hour, Today, Week
   - Location tags on posts

3. **Anonymous + Auth Modes**
   - Browse without login
   - Google OAuth login
   - Email/password option

4. **Business Ads**
   - Inline sponsored cards every ~10 messages
   - Marquee banner at top

### Phase 2 (Post-Launch)
1. **Map Integration**
   - One-tap incident reporting (wrecks, hazards, lost pets)
   - "📍 Report" button → auto-location → category → post
   - Pins auto-generate chat messages

2. **Business Directory**
   - Verified local business profiles
   - Categories: Restaurants, Services, Shops
   - Reviews & ratings

3. **Premium Features**
   - Keep posts for 7 days (vs 24hr)
   - Pin important posts
   - Verified business badges

4. **Multi-City Expansion**
   - Austin, TX (2nd city - tech-savvy crowd)
   - Additional Louisiana cities

---

## Tech Stack

**Frontend:**
- Next.js 15 + TypeScript
- Tailwind CSS
- shadcn/ui components
- Framer Motion (animations)

**Backend:**
- Supabase (PostgreSQL + Auth + Realtime)
- Row Level Security (RLS) enabled
- WebSockets for live chat

**Hosting:**
- GoDaddy (domain: yallwall.com)
- Cloudflare (CDN + SSL)

**Future:**
- Mapbox or Google Maps (Phase 2)
- OneSignal (push notifications)

---

## Design Philosophy

**"Professional yet approachable"**

- **Colors:** 
  - Deep Navy (#0A1929) background - serious, trustworthy
  - Cream/Vanilla cards (#FEFDF9, #F8F6F1) - warm, readable
  - Coral accent (#FF6B4A) - urgency, actions
  
- **Typography:** Clean, readable, generous spacing

- **Mobile-First:** Everything designed for phone screens first

- **Accessibility:** High contrast, large touch targets, simple language

---

## Current Progress

✅ Landing page design (3 concepts built)
✅ Marquee banner component
✅ Card-based chat UI
✅ Time filter tabs
✅ Database schema designed
✅ Domain + Cloudflare configured
✅ Static site deployed to GoDaddy

🔄 In Progress:
- Supabase setup (auth + database)
- Google OAuth integration
- Real-time chat functionality

📋 Next:
- User authentication flows
- Message posting/retrieval
- Real-time subscriptions
- Mobile testing & optimization

---

## Project Structure

```
/home/chris/workspace/yallwall/
├── my-app/                 # Next.js application
│   ├── app/
│   │   ├── page.tsx        # Landing page
│   │   └── concept-cards/  # Chat demo (current focus)
│   ├── components/ui/      # shadcn components
│   ├── lib/supabase.ts     # Database client
│   └── .env.local          # API keys (not committed)
├── DATABASE_SCHEMA.sql     # Full database setup
├── SUPABASE_SETUP.md       # Setup instructions
└── DESIGN.md               # Design system & features
```

---

## Competitors We're Different From

**Facebook Groups:** Too slow, algorithm hides posts, not real-time
**Nextdoor:** Too formal, verification friction, not ephemeral
**Citizen:** Only emergencies, no community chat
**Discord:** Too complex for casual users, not location-based

**YallWall Advantage:** Simple, fast, ephemeral, local-only, mobile-first

---

## Revenue Model

1. **Local Business Ads** - Inline cards + banner
2. **Premium Subscriptions** - Longer-lasting posts, verified badges
3. **Featured Business Listings** - Directory prominence

---

## How OpenClaw Can Help

**Research Tasks:**
- "Find best practices for real-time chat database design"
- "Research how Citizen app handles location-based alerts"
- "Look up mobile chat UI patterns for accessibility"
- "Find examples of successful local community apps"

**Documentation:**
- "Write a privacy policy for a location-based chat app"
- "Create Terms of Service for YallWall"
- "Draft user onboarding copy"

**Technical:**
- "Research Supabase real-time limits and pricing"
- "Find the best Mapbox vs Google Maps comparison"
- "Look up WebSocket alternatives for chat"

**Marketing:**
- "Write launch announcement copy for social media"
- "Create a list of Austin local groups to promote to"
- "Draft email template for local business outreach"

---

## Success Metrics

- 100 active users in Austin (Month 1)
- 500 messages per day
- 10 local business advertisers
- Expand to 2nd city (Baton Rouge)

---

## The Story

The founder came up with this idea after 3 tornadoes touched down near his home in Central Louisiana (Cenla). He realized there was no real-time, local chat where neighbors could share urgent updates. Facebook was too slow, Nextdoor too formal. He wanted something as easy as texting but visible to the whole community.

YallWall was born from a genuine need: **"What if there was a place where everyone in town could talk right now?"**

Starting in Central Louisiana because it's home, and if it works here, it'll work anywhere.

---

**Any questions about the project? Ask the user for clarification before making assumptions.**

**When completing tasks:**
- Save files to /home/chris/workspace/yallwall/
- Update the appropriate documentation
- Test on mobile viewport sizes
- Keep the design consistent with the navy/cream/coral palette
