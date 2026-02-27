# Quick Start Guide - Government Official Authentication

Get the authentication system running in 5 minutes!

## Step 1: Initialize Database (2 minutes)

The database needs to be set up with the government_officials table and policies.

```bash
# Run the initialization script
node scripts/init-db.mjs
```

✅ This will:
- Create `government_officials` table
- Enable Row Level Security (RLS)
- Create auto-population trigger
- Set up verification workflows

## Step 2: Start the App

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Step 3: Test the Sign-Up Flow

1. Go to: `http://localhost:3000/auth/sign-up`
2. Fill in:
   - **Full Name**: `John Doe`
   - **Department**: `Ministry of Defense`
   - **Email**: `john@gov.in` (must use allowed government domain)
   - **Password**: `TestPass123` (min 8 characters)
3. Click "Sign up"
4. You should see the success page

## Step 4: Approve the User

Now the user needs admin approval. Go to:

```
http://localhost:3000/admin/officials
```

You should see the newly created user with status "Pending". Click **Approve** to verify them.

## Step 5: Test Login

1. Go to: `http://localhost:3000/auth/login`
2. Enter:
   - **Email**: `john@gov.in`
   - **Password**: `TestPass123`
3. Click "Login"
4. ✅ You should be logged in and see the dashboard!

## Allowed Government Email Domains

Users can only sign up with these email domains:
- `@gov.in`
- `@nic.in`
- `@dei.gov.in`
- `@ib.gov.in`
- `@niacin.gov.in`
- `@darpan.gov.in`

## Key Files

| File | Purpose |
|------|---------|
| `/app/auth/login/page.tsx` | Login form |
| `/app/auth/sign-up/page.tsx` | Registration form |
| `/app/auth/error/page.tsx` | Error messages |
| `/app/admin/officials/page.tsx` | Admin approval panel |
| `/lib/supabase/client.ts` | Supabase client setup |
| `scripts/init-db.mjs` | Database initialization |
| `/AUTH_SETUP.md` | Detailed documentation |

## Test Accounts

Create test accounts by signing up at `/auth/sign-up`:

```
Email: admin@gov.in          Department: IT Ministry
Email: officer@nic.in        Department: National IT
Email: analyst@dei.gov.in    Department: Electronics
```

Then approve them in the admin panel.

## Common Commands

### Approve a user (via Supabase SQL)
```sql
UPDATE public.government_officials 
SET is_verified = TRUE 
WHERE email = 'john@gov.in';
```

### View all users
```sql
SELECT email, full_name, department, is_verified, created_at 
FROM public.government_officials 
ORDER BY created_at DESC;
```

### Delete a user
```sql
DELETE FROM public.government_officials 
WHERE email = 'john@gov.in';
```

## Troubleshooting

### "Only government official email addresses are allowed"
❌ **Problem**: Email domain not in the approved list
✅ **Solution**: Use one of the allowed domains (e.g., `@gov.in`)

### "Your account is pending verification"
❌ **Problem**: User is not approved yet
✅ **Solution**: Go to `/admin/officials` and click "Approve"

### "CACS-X runs on government credentials only" (dashboard)
❌ **Problem**: Not logged in
✅ **Solution**: Go to `/auth/login` and log in

### "Database initialization failed"
❌ **Problem**: Supabase environment variables not set
✅ **Solution**: 
1. Check that Supabase is connected in Vercel
2. Verify env vars are set
3. Run: `node scripts/init-db.mjs` again

## Features Summary

✅ **Sign-Up**
- Government email validation
- Full name & department tracking
- Password strength requirements
- Auto-create user profile in database

✅ **Login**
- Email/password authentication
- Account verification check
- Secure session management
- Auto-redirect if not verified

✅ **Admin Panel**
- View all registered officials
- Approve/reject applications
- See registration timestamps
- One-click verification

✅ **Security**
- Row Level Security (RLS)
- Email domain whitelist
- Password hashing
- HTTP-only cookies
- Secure logout

## Next Steps

### For Development
1. ✅ Database initialized
2. ✅ Test sign-up/login
3. Customize allowed domains in `/app/auth/sign-up/page.tsx`
4. Deploy to Vercel

### For Production
1. ✅ Database initialized
2. Set up email verification (Supabase)
3. Implement two-factor authentication
4. Add audit logging
5. Restrict admin panel access
6. Deploy with HTTPS

## Dashboard Routes

Once logged in, users can access:
- `/` - Main dashboard
- `/wallets` - Wallet data
- `/high-risk` - High-risk analysis
- `/alerts` - Alert system
- `/cases` - Case management
- `/settings` - User settings

## Security Notes

🔒 **Current Security Level**: Basic
- Email domain validation ✓
- Admin approval required ✓
- Row Level Security ✓
- Session management ✓

🔐 **Recommended Additions** (not implemented):
- Email verification
- Two-factor authentication
- Audit logging
- IP whitelisting
- Rate limiting

## Getting Help

- See `/AUTH_SETUP.md` for detailed documentation
- See `/IMPLEMENTATION_SUMMARY.md` for technical details
- Check `/scripts/init-db.mjs` for database setup

---

**Ready to go!** Your government-only authentication system is now ready to use. 🎉

For production deployment, review `/AUTH_SETUP.md` security section.
