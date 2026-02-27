import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  console.log('Setting up government_officials table...')

  try {
    // Create government_officials table
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
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

        ALTER TABLE public.government_officials ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "Users can view their own profile" ON public.government_officials;
        CREATE POLICY "Users can view their own profile" 
        ON public.government_officials FOR SELECT 
        USING (auth.uid() = id);

        DROP POLICY IF EXISTS "Users can update their own profile" ON public.government_officials;
        CREATE POLICY "Users can update their own profile" 
        ON public.government_officials FOR UPDATE 
        USING (auth.uid() = id);

        DROP POLICY IF EXISTS "Allow inserts for authenticated users" ON public.government_officials;
        CREATE POLICY "Allow inserts for authenticated users" 
        ON public.government_officials FOR INSERT 
        WITH CHECK (auth.uid() = id);

        DROP FUNCTION IF EXISTS public.handle_new_user();
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public
        AS $$
        BEGIN
          INSERT INTO public.government_officials (id, email, full_name, department)
          VALUES (
            new.id,
            new.email,
            coalesce(new.raw_user_meta_data ->> 'full_name', null),
            coalesce(new.raw_user_meta_data ->> 'department', null)
          )
          ON CONFLICT (id) DO NOTHING;
          RETURN new;
        END;
        $$;

        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW
          EXECUTE FUNCTION public.handle_new_user();
      `
    })

    if (tableError) {
      console.error('Error setting up table:', tableError)
      // Try alternative approach - direct SQL
      console.log('Attempting alternative setup...')
      return false
    }

    console.log('✓ Database setup completed successfully!')
    return true
  } catch (error) {
    console.error('Setup error:', error)
    return false
  }
}

setupDatabase()
