-- Combined migration file that includes all necessary database setup

-- Users table with complete profile fields
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY NOT NULL,
    avatar_url text,
    user_id text UNIQUE,
    token_identifier text NOT NULL,
    image text,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone,
    email text,
    name text,
    full_name text,
    -- Profile fields
    display_name text,
    bio text,
    date_of_birth date,
    gender text,
    reason text,
    interests text,
    profile_completed boolean DEFAULT false
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$
BEGIN
    -- Check if the policy for users exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'users' 
        AND policyname = 'Users can view own data'
    ) THEN
        -- Create policy to allow users to see only their own data
        EXECUTE 'CREATE POLICY "Users can view own data" ON public.users
                FOR SELECT USING (auth.uid()::text = user_id)';
    END IF;

    -- Check if the policy for users update exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'users' 
        AND policyname = 'Users can update own data'
    ) THEN
        -- Create policy to allow users to update only their own data
        EXECUTE 'CREATE POLICY "Users can update own data" ON public.users
                FOR UPDATE USING (auth.uid()::text = user_id)';
    END IF;

END
$$;

-- Highlights table
CREATE TABLE IF NOT EXISTS public.highlights (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
    text text NOT NULL,
    source text,
    tags text[],
    mood text,
    reflection text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Add RLS for highlights
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

-- Create policies for highlights
DO $$
BEGIN
    -- Check if the policy for highlights exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'highlights' 
        AND policyname = 'Users can view own highlights'
    ) THEN
        -- Create policy to allow users to see only their own highlights
        EXECUTE 'CREATE POLICY "Users can view own highlights" ON public.highlights
                FOR SELECT USING (auth.uid() = user_id)';
    END IF;

    -- Check if the policy for highlights insert exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'highlights' 
        AND policyname = 'Users can insert own highlights'
    ) THEN
        -- Create policy to allow users to insert their own highlights
        EXECUTE 'CREATE POLICY "Users can insert own highlights" ON public.highlights
                FOR INSERT WITH CHECK (auth.uid() = user_id)';
    END IF;

    -- Check if the policy for highlights update exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'highlights' 
        AND policyname = 'Users can update own highlights'
    ) THEN
        -- Create policy to allow users to update their own highlights
        EXECUTE 'CREATE POLICY "Users can update own highlights" ON public.highlights
                FOR UPDATE USING (auth.uid() = user_id)';
    END IF;

    -- Check if the policy for highlights delete exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'highlights' 
        AND policyname = 'Users can delete own highlights'
    ) THEN
        -- Create policy to allow users to delete their own highlights
        EXECUTE 'CREATE POLICY "Users can delete own highlights" ON public.highlights
                FOR DELETE USING (auth.uid() = user_id)';
    END IF;

END
$$;

-- Create a function that will be triggered when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id,
    user_id,
    email,
    name,
    full_name,
    avatar_url,
    token_identifier,
    created_at,
    updated_at
  ) VALUES (
    NEW.id,
    NEW.id::text,
    NEW.email,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.email,
    NEW.created_at,
    NEW.updated_at
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a new user is added to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update the function to handle user updates as well
CREATE OR REPLACE FUNCTION public.handle_user_update()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users
  SET
    email = NEW.email,
    name = NEW.raw_user_meta_data->>'name',
    full_name = NEW.raw_user_meta_data->>'full_name',
    avatar_url = NEW.raw_user_meta_data->>'avatar_url',
    updated_at = NEW.updated_at
  WHERE user_id = NEW.id::text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function when a user is updated in auth.users
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_update(); 