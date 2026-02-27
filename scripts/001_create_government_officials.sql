-- Create government_officials table with RLS policies
CREATE TABLE IF NOT EXISTS public.government_officials (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  department TEXT,
  position TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS on the table
ALTER TABLE public.government_officials ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view their own profile" 
ON public.government_officials FOR SELECT 
USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.government_officials FOR UPDATE 
USING (auth.uid() = id);

-- Policy: Allow inserts for new users (via trigger)
CREATE POLICY "Allow inserts for authenticated users" 
ON public.government_officials FOR INSERT 
WITH CHECK (auth.uid() = id);
