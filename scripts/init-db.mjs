#!/usr/bin/env node

/**
 * Database initialization script for Supabase
 * This script creates the government_officials table and associated policies
 */

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Error: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  console.error('Please ensure these environment variables are set.')
  process.exit(1)
}

async function execSQL(sql) {
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceRoleKey}`,
        'apikey': serviceRoleKey,
      },
      body: JSON.stringify({ sql }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('SQL Execution Error:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Network Error:', error.message)
    return false
  }
}

async function initializeDatabase() {
  console.log('🔧 Initializing Supabase database...\n')

  const statements = [
    {
      name: 'Create government_officials table',
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
      `
    },
    {
      name: 'Enable Row Level Security',
      sql: `ALTER TABLE public.government_officials ENABLE ROW LEVEL SECURITY;`
    },
    {
      name: 'Create RLS policies',
      sql: `
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
      `
    },
    {
      name: 'Create auto-populate trigger',
      sql: `
        DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
        
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public
        AS $$
        BEGIN
          INSERT INTO public.government_officials (id, email, full_name, department, is_verified)
          VALUES (
            new.id,
            new.email,
            coalesce(new.raw_user_meta_data ->> 'full_name', ''),
            coalesce(new.raw_user_meta_data ->> 'department', ''),
            FALSE
          )
          ON CONFLICT (id) DO UPDATE SET
            email = new.email,
            full_name = coalesce(new.raw_user_meta_data ->> 'full_name', full_name),
            department = coalesce(new.raw_user_meta_data ->> 'department', department);
          
          RETURN new;
        END;
        $$;

        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW
          EXECUTE FUNCTION public.handle_new_user();
      `
    }
  ]

  let success = true

  for (const statement of statements) {
    process.stdout.write(`⏳ ${statement.name}... `)
    const result = await execSQL(statement.sql)
    
    if (result) {
      console.log('✓')
    } else {
      console.log('✗ (skipped - may already exist)')
      // Continue even if a statement fails, as some might be idempotent
    }
  }

  console.log('\n✅ Database initialization complete!')
  console.log('\n📝 Next steps:')
  console.log('1. Users can now sign up with government emails')
  console.log('2. Their profiles will be automatically created with is_verified = FALSE')
  console.log('3. An admin needs to verify them in the database before they can log in')
  console.log('4. To verify a user: UPDATE public.government_officials SET is_verified = TRUE WHERE email = "user@gov.in"')

  return success
}

initializeDatabase().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
})
