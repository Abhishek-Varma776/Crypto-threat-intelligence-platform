# Government Official Authentication System

This document outlines the authentication and authorization system for the Crypto Threat Intelligence Platform, restricted to government officials only.

## Overview

The system implements role-based access control using:
- **Supabase Authentication** for user sign-up and login
- **Government Email Validation** to restrict access to official government domains
- **Database Verification** to ensure only approved officials can access the system
- **Row Level Security (RLS)** to protect user data

## System Architecture

### Allowed Government Domains

The system currently allows the following government email domains:
- `gov.in` - India Government
- `nic.in` - National Informatics Centre
- `dei.gov.in` - Department of Electronics and IT
- `ib.gov.in` - Intelligence Bureau
- `niacin.gov.in` - National Intelligence Agency
- `darpan.gov.in` - Government Portal

To add more domains, edit `/app/auth/sign-up/page.tsx` and modify the `ALLOWED_GOVT_DOMAINS` array.

## Database Schema

### government_officials Table

```sql
CREATE TABLE public.government_officials (
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
```

**Key Fields:**
- `id`: Links to auth.users table
- `is_verified`: Controls whether user can access the system
- `email`: Government email address
- `full_name`, `department`: User profile information

### Row Level Security Policies

- **SELECT**: Users can only view their own profile
- **UPDATE**: Users can only update their own profile
- **INSERT**: Auto-triggered by signup (via database trigger)

### Auto-Population Trigger

When a user signs up:
1. A new auth.users record is created
2. Database trigger `on_auth_user_created` fires
3. A new government_officials record is created with `is_verified = FALSE`
4. User metadata (full_name, department) from signup is stored

## Setup Instructions

### 1. Initialize the Database

Run the database initialization script to create tables and policies:

```bash
node scripts/init-db.mjs
```

This will:
- Create the `government_officials` table
- Enable Row Level Security
- Create RLS policies
- Create the auto-population trigger

### 2. Verify the Setup

Check that the table exists in Supabase:
1. Go to Supabase Dashboard → SQL Editor
2. Run: `SELECT * FROM public.government_officials;`
3. Should return empty result (no users yet)

## User Workflows

### Sign-Up Flow

1. User visits `/auth/sign-up`
2. Fills in:
   - Full Name
   - Department
   - Government Email (must match allowed domains)
   - Password (min 8 characters)
3. System validates:
   - Email domain is in ALLOWED_GOVT_DOMAINS
   - Passwords match
   - Password is strong enough
4. Account created with `is_verified = FALSE`
5. User sees success page with instructions

### Login Flow

1. User visits `/auth/login`
2. Enters email and password
3. System checks:
   - Email/password are correct
   - Account exists in government_officials table
   - `is_verified = TRUE`
4. If verified, redirected to dashboard
5. If not verified, shown error message

### Admin Verification

To approve a new user, an admin must:

**Via Supabase Dashboard:**
1. Go to SQL Editor
2. Run:
```sql
UPDATE public.government_officials 
SET is_verified = TRUE 
WHERE email = 'official@gov.in';
```

**Or via Supabase UI:**
1. Go to Table Editor
2. Find the user in government_officials
3. Change is_verified from FALSE to TRUE

## Protected Routes

The following pages require authentication:

- `/` - Main dashboard
- `/wallets` - Wallet listing
- `/high-risk` - High-risk wallets
- `/alerts` - Alerts system
- `/cases` - Case management
- `/settings` - User settings

Unauthenticated users are redirected to `/auth/login`.

## Authentication Components

### Auth Pages

- **`/app/auth/login/page.tsx`** - Login form with government email validation
- **`/app/auth/sign-up/page.tsx`** - Registration form for new officials
- **`/app/auth/error/page.tsx`** - Error messages (unverified, unauthorized, etc.)
- **`/app/auth/sign-up-success/page.tsx`** - Success confirmation page

### Protected Components

- **`/app/page.tsx`** - Main dashboard with auth check
- **`/components/sidebar.tsx`** - Logout button functionality

### Supabase Integration

- **`/lib/supabase/client.ts`** - Client-side Supabase setup
- **`/lib/supabase/server.ts`** - Server-side Supabase setup
- **`/lib/supabase/proxy.ts`** - Session management middleware
- **`/middleware.ts`** - Route protection middleware

## Environment Variables

Required environment variables (set via Vercel/Supabase integration):

```
NEXT_PUBLIC_SUPABASE_URL          # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY     # Public anon key
SUPABASE_SERVICE_ROLE_KEY         # Secret service role key
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL  # Post-auth redirect (optional)
```

## Security Features

1. **Email Validation**: Only official government domains allowed
2. **Password Security**: Minimum 8 characters, hashed by Supabase
3. **Row Level Security**: Users can only access their own data
4. **Session Management**: HTTP-only cookies, secure session handling
5. **Admin Approval**: Manual verification step before access
6. **Rate Limiting**: Built-in Supabase auth rate limits

## Troubleshooting

### "Only government official email addresses are allowed"
- Check email domain is in ALLOWED_GOVT_DOMAINS
- Verify email format is correct
- Check domain list in sign-up page

### "Your account is pending verification by an administrator"
- Admin needs to set `is_verified = TRUE` in database
- Check government_officials table for the user record
- Ensure email matches exactly

### "The server rendered text didn't match the client" (hydration error)
- This has been fixed in the TopBar component
- The component now uses an `isHydrated` flag to prevent mismatches

### Table doesn't exist
- Run the database initialization script: `node scripts/init-db.mjs`
- Check Supabase logs for any errors
- Ensure service role key has proper permissions

## Testing

### Test Sign-Up
1. Use email: `testuser@gov.in`
2. Password: `TestPassword123`
3. Wait for admin verification

### Test Login
1. Admin verifies the account first
2. Use same credentials to login
3. Should be redirected to dashboard

### Test Unauthorized Access
1. Try accessing `/` without logging in
2. Should be redirected to `/auth/login`
3. Try accessing with unverified account
4. Should see error page

## Customization

### Add More Government Domains

Edit `/app/auth/sign-up/page.tsx`:

```typescript
const ALLOWED_GOVT_DOMAINS = [
  'gov.in',
  'nic.in',
  'dei.gov.in',
  // Add your domains here
  'myagency.gov.in',
]
```

### Change Password Requirements

Edit `/app/auth/sign-up/page.tsx` handleSignUp function:

```typescript
if (password.length < 12) {  // Change minimum length
  setError('Password must be at least 12 characters long')
  return
}
```

### Modify Database Fields

1. Add new columns to government_officials table
2. Update signup metadata in `/app/auth/sign-up/page.tsx`
3. Update RLS policies as needed

## Support & Monitoring

### Check User Approval Status
```sql
SELECT email, is_verified, created_at FROM public.government_officials;
```

### View Login Attempts
- Check Supabase Auth logs in dashboard
- Monitor failed login attempts for security

### Bulk Approve Users
```sql
UPDATE public.government_officials 
SET is_verified = TRUE 
WHERE department = 'Ministry of Defense';
```

## Next Steps

1. Run database initialization: `node scripts/init-db.mjs`
2. Test sign-up flow with a government email
3. Approve the account via Supabase dashboard
4. Test login and dashboard access
5. Deploy to production

---

**Last Updated**: 2026-02-27
**System**: Crypto Threat Intelligence Platform (CACS-X)
**Auth Type**: Government Official Only (Restricted Access)
