-- YallWall Database Schema
-- Run this in Supabase SQL Editor after creating your project

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  city TEXT DEFAULT 'Cenla',
  state TEXT DEFAULT 'LA',
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  tips_given INTEGER DEFAULT 0,
  tips_received INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE (main chat posts)
-- ============================================
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  location_name TEXT, -- e.g., "East Austin"
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  likes INTEGER DEFAULT 0,
  tips INTEGER DEFAULT 0,
  is_hot BOOLEAN DEFAULT FALSE,
  is_important BOOLEAN DEFAULT FALSE,
  is_business BOOLEAN DEFAULT FALSE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- REPLIES TABLE (thread comments)
-- ============================================
CREATE TABLE replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TIPS TABLE (tip transactions)
-- ============================================
CREATE TABLE tips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tipper_id UUID REFERENCES profiles(id) NOT NULL,
  recipient_id UUID REFERENCES profiles(id) NOT NULL,
  message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
  amount INTEGER DEFAULT 1, -- number of coins
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER_LIKES TABLE (track who liked what)
-- ============================================
CREATE TABLE user_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  message_id UUID REFERENCES messages(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, message_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_expires_at ON messages(expires_at);
CREATE INDEX idx_messages_city ON messages(location_name);
CREATE INDEX idx_replies_message_id ON replies(message_id);
CREATE INDEX idx_tips_recipient ON tips(recipient_id);
CREATE INDEX idx_tips_tipper ON tips(tipper_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_likes ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, update only their own
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Messages: Readable by all, insert/update only by owner
CREATE POLICY "Messages are viewable by everyone"
  ON messages FOR SELECT USING (true);

CREATE POLICY "Users can create messages"
  ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own messages"
  ON messages FOR UPDATE USING (auth.uid() = user_id);

-- Replies: Readable by all, insert by authenticated users
CREATE POLICY "Replies are viewable by everyone"
  ON replies FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create replies"
  ON replies FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Tips: Readable by all, insert by authenticated (the tipper)
CREATE POLICY "Tips are viewable by everyone"
  ON tips FOR SELECT USING (true);

CREATE POLICY "Users can send tips"
  ON tips FOR INSERT WITH CHECK (auth.uid() = tipper_id);

-- Likes: Readable by all, insert/delete by owner
CREATE POLICY "Likes are viewable by everyone"
  ON user_likes FOR SELECT USING (true);

CREATE POLICY "Users can like messages"
  ON user_likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike messages"
  ON user_likes FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update tips count on profile
CREATE OR REPLACE FUNCTION update_profile_tips()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment tips_received for recipient
  UPDATE profiles 
  SET tips_received = tips_received + NEW.amount,
      updated_at = NOW()
  WHERE id = NEW.recipient_id;
  
  -- Increment tips_given for tipper
  UPDATE profiles 
  SET tips_given = tips_given + NEW.amount,
      updated_at = NOW()
  WHERE id = NEW.tipper_id;
  
  -- Increment tips on the message
  UPDATE messages 
  SET tips = tips + NEW.amount
  WHERE id = NEW.message_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update counts when tip is added
CREATE TRIGGER on_tip_created
  AFTER INSERT ON tips
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_tips();

-- Function to update likes count on message
CREATE OR REPLACE FUNCTION update_message_likes()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE messages SET likes = likes + 1 WHERE id = NEW.message_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE messages SET likes = likes - 1 WHERE id = OLD.message_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_like_change
  AFTER INSERT OR DELETE ON user_likes
  FOR EACH ROW
  EXECUTE FUNCTION update_message_likes();

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  -- Generate base username from email (before @) or use 'user' as fallback
  base_username := COALESCE(
    NEW.raw_user_meta_data->>'username',
    split_part(NEW.email, '@', 1),
    'user'
  );
  
  -- Clean username: lowercase, alphanumeric only, no spaces
  base_username := lower(regexp_replace(base_username, '[^a-zA-Z0-9]', '', 'g'));
  
  -- If empty after cleaning, use 'user'
  IF length(base_username) = 0 THEN
    base_username := 'user';
  END IF;
  
  final_username := base_username;
  
  -- Check if username exists, if so add a number
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::text;
  END LOOP;
  
  -- Insert profile with safe values
  INSERT INTO profiles (
    id, 
    username, 
    display_name, 
    avatar_url,
    city,
    state
  ) VALUES (
    NEW.id,
    final_username,
    COALESCE(
      NEW.raw_user_meta_data->>'full_name',
      NEW.raw_user_meta_data->>'name',
      initcap(final_username)
    ),
    NEW.raw_user_meta_data->>'avatar_url',
    'Austin',
    'TX'
  )
  ON CONFLICT (id) DO NOTHING;  -- In case profile already exists
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't prevent user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create profile after signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- REALTIME SUBSCRIPTIONS (enable live updates)
-- ============================================

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE replies;
ALTER PUBLICATION supabase_realtime ADD TABLE tips;

-- ============================================
-- EXAMPLE QUERIES (for reference)
-- ============================================

-- Get messages with user info (join)
-- SELECT m.*, p.username, p.display_name, p.avatar_url
-- FROM messages m
-- JOIN profiles p ON m.user_id = p.id
-- WHERE m.expires_at > NOW()
-- ORDER BY m.created_at DESC;

-- Get replies for a message
-- SELECT r.*, p.username, p.display_name, p.avatar_url
-- FROM replies r
-- JOIN profiles p ON r.user_id = p.id
-- WHERE r.message_id = 'message-uuid-here'
-- ORDER BY r.created_at ASC;
