-- Recreate the profiles table and trigger

CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  city TEXT DEFAULT 'Austin',
  state TEXT DEFAULT 'TX',
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  tips_given INTEGER DEFAULT 0,
  tips_received INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  display_name TEXT;
  counter INTEGER := 1;
BEGIN
  base_username := COALESCE(NEW.raw_user_meta_data->>'user_name', split_part(NEW.email, '@', 1), 'user');
  base_username := regexp_replace(base_username, '[^a-zA-Z0-9_]', '', 'g');
  IF length(base_username) < 2 THEN base_username := 'user'; END IF;
  base_username := substr(base_username, 1, 20);
  
  final_username := base_username;
  WHILE EXISTS (SELECT 1 FROM profiles WHERE username = final_username) LOOP
    final_username := base_username || counter::text;
    counter := counter + 1;
    EXIT WHEN counter > 100;
  END LOOP;
  
  display_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', initcap(split_part(NEW.email, '@', 1)), 'New User');
  
  INSERT INTO profiles (id, username, display_name, avatar_url, city, state, tips_given, tips_received)
  VALUES (NEW.id, final_username, display_name, NEW.raw_user_meta_data->>'avatar_url', 'Austin', 'TX', 0, 0);
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

SELECT 'Fixed!' as status;
