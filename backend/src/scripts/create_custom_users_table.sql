-- Create custom users table for custom authentication (not using Supabase auth)
CREATE TABLE IF NOT EXISTS public.custom_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Drop the old RLS policies if they exist and disable RLS for custom auth
ALTER TABLE public.custom_users DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_custom_users_email ON public.custom_users(email);

-- Optional: Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_custom_users_updated_at ON public.custom_users;

CREATE TRIGGER update_custom_users_updated_at
    BEFORE UPDATE ON public.custom_users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
