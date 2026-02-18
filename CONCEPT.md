# YallWall Design Concept - "The Floating Wall"

## Core Concept
A living, breathing wall of local conversation. Messages float up and snap into place like magnets finding their home.

## Visual Identity

### Color Palette
```
Background:    #0A0A0A (Deep black)
Surface:       #141414 (Card backgrounds)
Border:        #262626 (Subtle separation)
Text Primary:  #FAFAFA (White)
Text Secondary:#737373 (Gray)
Accent:        #FF6B4A (Coral/Orange - for LIVE indicators only)
Success:       #22C55E (Green badges)
Premium:       #FFD93D (Gold for premium features)
```

### Typography
- **Logo**: Bold, wide tracking, all caps - YALLWALL
- **Headlines**: Inter Bold
- **Body**: Inter Regular
- **Messages**: Slightly larger (16-18px) for readability

## The "Floating Wall" Chat UI

### How It Works:
1. **New messages** float up from bottom like bubbles
2. **Snap into grid** - masonry layout, auto-arranging
3. **Size variants**:
   - Standard message: 1x1 card
   - Important/pinned: 2x1 or 2x2 cards
   - Image posts: Variable aspect ratio
   
4. **Time indicator**: Subtle "posted 2m ago" on each card
5. **24hr countdown**: Thin progress bar at bottom of card

### Card Design:
```
+------------------+
| Avatar  Username |  ← Top row
|                  |
| Message content  |  ← Main area
| goes here and    |
| wraps nicely...  |
|                  |
| [📍Location]     |  ← Optional location tag
|                  |
| ⏱️ 22h left    |  ← Time remaining indicator
+------------------+
```

## Page Structure

### 1. Landing Page
```
┌─────────────────────────────────────────┐
│         [YALLWALL LOGO - CENTER]        │
│                                         │
│     "Your City's Living Conversation"   │
│                                         │
│    [City Selector] [Join Chat Button]   │
│                                         │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│                                         │
│   [LIVE WALL PREVIEW - ANIMATED]       │
│   Cards floating, snapping into place   │
│                                         │
│   • "Storm warning east side" - 2m     │
│   • "Anyone seen my dog?" - 5m         │
│   • "Best tacos at Maria's rn" - 12m   │
│   • [Business Ad Card - Pinned]        │
│                                         │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│         FEATURES SECTION                │
│   - Ephemeral (24hr) messages          │
│   - Local business directory           │
│   - Emergency alerts                   │
│   - Premium: Keep posts longer         │
└─────────────────────────────────────────┘
```

### 2. Main Chat Wall Page
```
┌─────────────────────────────────────────┐
│ ← YALLWALL    AUSTIN, TX    [Profile] │
├─────────────────────────────────────────┤
│                                         │
│   ┌──────┐ ┌──────────┐ ┌──────┐      │
│   │ Msg  │ │  Msg 2   │ │ Msg3 │      │
│   │  1   │ │          │ │      │      │
│   └──────┘ └──────────┘ └──────┘      │
│                                         │
│   ┌──────────────┐ ┌──────────┐        │
│   │   [AD CARD]  │ │ Msg 4    │        │
│   │   Sponsored  │ │          │        │
│   └──────────────┘ └──────────┘        │
│                                         │
│   ┌──────┐ ┌──────┐ ┌──────────┐       │
│   │ Msg5 │ │ Msg6 │ │ Msg 7    │       │
│   └──────┘ └──────┘ └──────────┘       │
│                                         │
├─────────────────────────────────────────┤
│  [Message Input Area - Fixed Bottom]    │
│  [Type...] [📎] [📍] [Send]            │
└─────────────────────────────────────────┘
```

### 3. Business Directory Page
- Grid of business cards
- Filter by category
- Map view toggle
- "Promote your business" CTA

### 4. Premium Page
- Pricing tiers
- Feature comparison
- "Keep your posts longer" value prop
- "Support local communities"

## Key Interactions

### Micro-animations:
1. **New message**: Floats up from bottom, slight bounce on snap
2. **Message expires**: Card fades, shrinks, disappears
3. **Hover**: Card lifts (shadow increases), subtle scale(1.02)
4. **Live indicator**: Pulsing dot in header
5. **New ad slides in**: Slides from right, snaps into grid

### User Flows:
1. **First visit**: See landing → Select city → See wall preview → Sign up
2. **Daily use**: Open app → See live wall → Scroll/join conversation
3. **Business**: Browse directory → Claim listing → Upgrade to premium
4. **Emergency**: Alert banner appears → Can dismiss or click for details

## Premium Features:
- Keep posts for 7 days (vs 24hr)
- Pin important posts
- Business verified badge
- Analytics dashboard
- Priority support
- Ad-free experience

## Technical Considerations:
- **Grid layout**: CSS Grid with masonry (or react-masonry-css)
- **Animations**: Framer Motion for smooth float/snap
- **Real-time**: WebSockets for instant updates
- **Images**: Lazy loading for performance
- **Mobile**: Swipe cards, stack layout

## Mood Words:
- Alive
- Ephemeral
- Local
- Premium
- Community
- Modern
- Dark mode native
- Magnetic
- Flowing
