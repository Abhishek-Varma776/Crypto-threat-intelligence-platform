# Setup Checklist - Government Official Authentication

Complete this checklist to get your authentication system running.

## Pre-Flight Checks

- [ ] Supabase is connected (check Vercel Dashboard → Integrations)
- [ ] Environment variables are set (NEXT_PUBLIC_SUPABASE_URL, etc.)
- [ ] You have access to Supabase dashboard

## Step 1: Database Initialization (5 minutes)

- [ ] Run database setup: `node scripts/init-db.mjs`
- [ ] Check the output for success messages
- [ ] Verify table exists in Supabase dashboard:
  - Go to SQL Editor
  - Run: `SELECT * FROM public.government_officials;`
  - Should return empty (no users yet)

## Step 2: Install & Start App

- [ ] Dependencies already installed (handled automatically)
- [ ] Start dev server: `npm run dev`
- [ ] App running on `http://localhost:3000`

## Step 3: Test Complete Flow

### 3.1 Sign Up Test
- [ ] Navigate to `http://localhost:3000/auth/sign-up`
- [ ] Fill form:
  - Full Name: `Test Officer`
  - Department: `Ministry of Test`
  - Email: `test@gov.in` (must be allowed domain)
  - Password: `TestPass123`
- [ ] Click "Sign up"
- [ ] See success page with approval instructions
- [ ] Check database - user should have `is_verified = FALSE`

### 3.2 Login Before Approval Test
- [ ] Navigate to `http://localhost:3000/auth/login`
- [ ] Try logging in with test account
- [ ] Should see error: "Your account is pending verification"
- [ ] ✅ Correct behavior!

### 3.3 Admin Approval Test
- [ ] Navigate to `http://localhost:3000/admin/officials`
- [ ] Find your test account in the list
- [ ] Status should show "Pending" (yellow badge)
- [ ] Click "Approve" button
- [ ] User status should change to "Verified" (green badge)

### 3.4 Login After Approval Test
- [ ] Navigate to `http://localhost:3000/auth/login`
- [ ] Login with test account
- [ ] Should successfully log in
- [ ] Should see dashboard with "Welcome" message
- [ ] ✅ Success!

## Step 4: Test Security Features

### 4.1 Email Domain Validation
- [ ] Try signing up with `test@gmail.com`
- [ ] Should see error: "Only government official email addresses are allowed"
- [ ] ✅ Email validation working!

### 4.2 Password Requirements
- [ ] Try signing up with password shorter than 8 chars
- [ ] Should see error about password length
- [ ] ✅ Password validation working!

### 4.3 Unauthenticated Access
- [ ] Open private/incognito window
- [ ] Navigate directly to `http://localhost:3000/`
- [ ] Should redirect to `/auth/login`
- [ ] ✅ Route protection working!

### 4.4 Logout Test
- [ ] While logged in, find logout button in sidebar
- [ ] Click "Logout"
- [ ] Should redirect to login page
- [ ] Try accessing dashboard - redirected to login
- [ ] ✅ Logout working!

## Step 5: Customize for Your Needs

### 5.1 Update Allowed Domains (if needed)
- [ ] Edit `/app/auth/sign-up/page.tsx`
- [ ] Find `ALLOWED_GOVT_DOMAINS` array
- [ ] Add your government domains
- [ ] Test signup with new domain

### 5.2 Customize Success Messages (optional)
- [ ] Edit `/app/auth/sign-up-success/page.tsx`
- [ ] Customize approval instructions
- [ ] Save and test

### 5.3 Update Error Messages (optional)
- [ ] Edit `/app/auth/error/page.tsx`
- [ ] Customize error messages
- [ ] Test error flow

## Step 6: Database Management (Optional)

### Check All Users
```sql
SELECT email, full_name, department, is_verified, created_at 
FROM public.government_officials 
ORDER BY created_at DESC;
```

### Bulk Approve Users
```sql
UPDATE public.government_officials 
SET is_verified = TRUE 
WHERE department = 'Ministry of Defense';
```

### Remove a User
```sql
DELETE FROM public.government_officials 
WHERE email = 'user@gov.in';
```

## Step 7: Prepare for Production

- [ ] Test all flows again (signup, login, logout)
- [ ] Remove test accounts from database
- [ ] Review security settings in `/AUTH_SETUP.md`
- [ ] Consider email verification setup (optional)
- [ ] Consider 2FA implementation (optional)
- [ ] Set production domain in Supabase
- [ ] Update `ALLOWED_GOVT_DOMAINS` with real agencies
- [ ] Deploy to Vercel with `vercel deploy --prod`

## Step 8: Post-Deployment

- [ ] Test signup and login on production
- [ ] Create real admin account for team
- [ ] Document admin procedures for your team
- [ ] Set up backup/recovery procedures
- [ ] Monitor auth logs in Supabase dashboard
- [ ] Test error scenarios (network issues, database down, etc.)

## Files Checklist

### Auth Files
- [ ] `/app/auth/login/page.tsx` - Login form ✅
- [ ] `/app/auth/sign-up/page.tsx` - Signup form ✅
- [ ] `/app/auth/error/page.tsx` - Error page ✅
- [ ] `/app/auth/sign-up-success/page.tsx` - Success page ✅
- [ ] `/app/auth/layout.tsx` - Auth layout ✅

### Core Application
- [ ] `/app/page.tsx` - Dashboard (updated with auth) ✅
- [ ] `/app/layout.tsx` - Root layout ✅
- [ ] `/components/sidebar.tsx` - Sidebar with logout ✅
- [ ] `/components/top-bar.tsx` - Top bar (hydration fixed) ✅

### Supabase Integration
- [ ] `/lib/supabase/client.ts` - Client setup ✅
- [ ] `/lib/supabase/server.ts` - Server setup ✅
- [ ] `/lib/supabase/proxy.ts` - Session proxy ✅
- [ ] `/middleware.ts` - Route middleware ✅

### Database
- [ ] `/scripts/init-db.mjs` - Database initialization ✅
- [ ] `/scripts/001_create_government_officials.sql` - Table creation ✅
- [ ] `/scripts/002_create_officials_trigger.sql` - Trigger creation ✅

### Documentation
- [ ] `/AUTH_SETUP.md` - Detailed setup guide ✅
- [ ] `/IMPLEMENTATION_SUMMARY.md` - Technical overview ✅
- [ ] `/QUICK_START.md` - Quick reference ✅
- [ ] `/SETUP_CHECKLIST.md` - This file ✅

### Configuration
- [ ] `/package.json` - Supabase dependencies added ✅

## Troubleshooting Checklist

If you encounter issues:

### Database Issues
- [ ] Check: `node scripts/init-db.mjs` runs without errors
- [ ] Verify: Can access Supabase dashboard
- [ ] Verify: Environment variables are set
- [ ] Check: `SELECT * FROM public.government_officials;` in SQL editor

### Sign-Up Issues
- [ ] Email domain in ALLOWED_GOVT_DOMAINS list?
- [ ] Password at least 8 characters?
- [ ] Passwords match (confirm password correct)?
- [ ] Check browser console for errors

### Login Issues
- [ ] Account verified in database (`is_verified = TRUE`)?
- [ ] Email/password correct?
- [ ] Try refreshing page and logging in again
- [ ] Check Supabase Auth logs

### Route Protection Issues
- [ ] Logged in but still redirected to login?
- [ ] Try clearing cookies and logging in again
- [ ] Check middleware.ts is in root directory
- [ ] Verify environment variables are set

### Hydration Errors
- [ ] TopBar component already fixed
- [ ] If you see other hydration errors, check:
  - No dynamic content without `useEffect`
  - All server/client components labeled correctly
  - Date/time values consistent between server and client

## Quick Command Reference

```bash
# Start development
npm run dev

# Initialize database
node scripts/init-db.mjs

# Build for production
npm run build

# Deploy to Vercel
vercel deploy

# Deploy to production
vercel deploy --prod
```

## Success Indicators

You'll know everything is working when:

✅ Users can sign up with government emails
✅ Unverified users see pending message on login
✅ Admin can approve users in the panel
✅ Approved users can log in and access dashboard
✅ Unauthenticated users redirected to login
✅ Logout clears session properly
✅ Non-government emails are rejected

## Next Steps After Setup

1. **Team Training**: Show your admin team how to approve users
2. **Domain Configuration**: Update ALLOWED_GOVT_DOMAINS with real agencies
3. **User Onboarding**: Create process for new official registrations
4. **Monitoring**: Set up alerts for failed login attempts
5. **Backup**: Regular database backups
6. **Audit**: Periodic security audits

---

## Support

If you get stuck:
1. Check `/AUTH_SETUP.md` for detailed explanations
2. Check `/QUICK_START.md` for common issues
3. Review Supabase logs in dashboard
4. Check browser console for JavaScript errors

**Estimated Setup Time**: 15-30 minutes

Good luck! 🎉
