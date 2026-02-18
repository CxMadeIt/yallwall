# YallWall.com - Design Document

## Vision
A live, local text chat + business directory hybrid for communities. Every city gets their own YallWall.

## Core Features

### 1. Live Local Chat 💬
- Real-time text chat (WebSockets)
- Location-based rooms (city/region)
- Message reactions, threading
- "Watch" mode for severe weather/alerts
- Anonymous or registered users

### 2. Local Business Directory 📍
- Business profiles with photos, hours, contact
- Categories: Restaurants, Services, Shops, etc.
- Reviews & ratings
- "Verified Local Business" badges

### 3. Smart Advertising System 💰
- **Inline Cards**: Every 10-15 messages, show a local business card
- **Marquee Banner**: Top banner ad space
- **Sponsored Posts**: Businesses can pin announcements
- Geo-targeted ads (only show to users in that city)

### 4. User Engagement 🏆
- **Badges**: "First Responder", "Weather Watcher", "Local Guide", "Helper"
- **Milestones**: Posts made, helpful reactions received
- **Reputation System**: Trusted contributors get verified badges
- **Leaderboard**: Top contributors this week/month

## Design System (Airbnb-Level Polish)

### Colors
- Primary: Warm coral/orange (#FF6B4A) - friendly, urgent, local
- Secondary: Deep teal (#2A9D8F) - trust, community
- Background: Warm off-white (#FAF9F7) - paper-like, approachable
- Text: Charcoal (#2D3436) - readable, professional
- Accent: Golden yellow (#FFD93D) - badges, highlights

### Typography
- Headings: Inter (clean, modern)
- Body: Inter or system-ui
- Chat: Monospace for timestamps

### Components
- Rounded corners (16px) - friendly
- Soft shadows - depth without harshness
- Card-based layout - scannable
- Micro-interactions - delightful

## User Flows

### Landing Page
1. Hero: "Your City's Living Room"
2. City selector (dropdown or auto-detect)
3. Live preview of chat activity
4. "Join the Conversation" CTA
5. Featured local businesses

### Chat Interface
1. Header: City name, online count, weather alert banner
2. Message feed (newest at bottom)
3. Input area with emoji, image upload
4. Sidebar: Online users, trending topics, directory quick-links
5. Inline business cards every 10-15 messages

### Directory
1. Grid/map toggle view
2. Category filters
3. Search
4. Business cards with photos, ratings, quick actions

## Tech Stack
- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS
- **UI Library**: shadcn/ui
- **Real-time**: Socket.io
- **Database**: PostgreSQL + Redis
- **Auth**: NextAuth.js (anonymous + registered)
- **File Storage**: Cloudflare R2 or AWS S3
- **Maps**: Mapbox or Google Maps

## MVP Scope (Phase 1)
1. Single city (Austin, TX as pilot)
2. Anonymous chat only
3. Basic business directory (manual entries)
4. Inline ad cards (hardcoded for demo)
5. Simple badges system

## Future Phases
- Multi-city support
- User registration & profiles
- Business self-serve portal
- Mobile app
- AI moderation
- Emergency alert integration

## Inspiration
- Reddit (community feel)
- Nextdoor (local focus)
- Twitch chat (real-time energy)
- Airbnb (design polish)
- Citizen app (urgency/safety)
