# YallWall Supabase Setup Guide

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click **"New Project"**
3. Organization: Create or select yours
4. Project name: `yallwall`
5. Database password: **Save this somewhere safe!**
6. Region: Choose closest to your users (US East/Central)
7. Click **"Create new project"**

Wait ~2 minutes for project to initialize.

## Step 2: Get Your API Keys

1. In Supabase dashboard, click **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://abcdef123456.supabase.co`)
   - **anon/public** key (starts with `eyJ...`)

## Step 3: Add to Environment Variables

Create `/home/chris/workspace/yallwall/my-app/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Replace with your actual values from Step 2.

## Step 4: Run Database Schema

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `DATABASE_SCHEMA.sql`
4. Paste into SQL Editor
5. Click **"Run"**

✅ This creates all tables, indexes, and security policies!

## Step 5: Set Up Authentication (Choose One)

### Option A: Email + Password (Easiest)

Already enabled by default. Users can sign up with email/password.

### Option B: Google OAuth (Better UX)

1. Supabase dashboard → **Authentication** → **Providers**
2. Find **Google** and enable it
3. You'll need to create OAuth credentials in Google Cloud Console
4. Add the Client ID and Secret to Supabase

### Option C: Magic Links

1. Supabase dashboard → **Authentication** → **Providers** → **Email**
2. Enable "Confirm email" or "Magic link"
3. Users get emailed a login link

## Step 6: Test the Connection

Add this test to your app temporarily:

```typescript
import { createServerClient } from '@/lib/supabase';

async function testConnection() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from('profiles').select('*');
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connected! Profiles:', data);
  }
}
```

## What's Set Up

### Tables Created:
- `profiles` - User profiles (extends auth.users)
- `messages` - Main chat posts
- `replies` - Thread comments
- `tips` - Tip transactions
- `user_likes` - Track who liked what

### Security:
- Row Level Security (RLS) enabled on all tables
- Users can only edit their own data
- Public read access for messages/replies

### Realtime:
- Live updates enabled for messages, replies, tips
- Changes appear instantly in all connected clients

### Auto-Features:
- Profile auto-created on signup
- Tip counts auto-update on both users
- Like counts auto-update on messages
- Messages auto-expire after 24 hours

## Next Steps

1. Build login/signup UI
2. Connect real messages to database
3. Add real-time subscriptions
4. Implement tipping system

## Troubleshooting

**"Invalid API key"** - Double-check your `.env.local` file

**"Permission denied"** - RLS policies are blocking it. Check SQL schema ran correctly.

**"Realtime not working"** - Check that you enabled realtime in the SQL schema (last section).
