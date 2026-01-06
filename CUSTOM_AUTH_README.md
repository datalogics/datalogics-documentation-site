# Custom Authentication Setup for Nuxt Studio

This setup implements Custom Auth as documented in the Nuxt Studio documentation. Here's how it works:

## How It Works

1. **User Management**: Users are stored in the `STUDIO_USERS` environment variable
   - Format: `email1:password1:name1,email2:password2:name2`
   - Example: `admin@datalogics.com:securepass123:Admin User,john@datalogics.com:password456:John Doe`

2. **Login Flow**:
   - User visits `/_studio` → Middleware checks auth → Redirects to `/studio/login` if not authenticated
   - User enters email/password on login page
   - `POST /api/studio/login` validates credentials
   - If valid, `setStudioUserSession()` creates the session
   - User redirected to `/_studio` where Studio detects the session

3. **Session Management**:
   - Studio automatically detects the session using `getStudioUserSession()`
   - Logout clears session via `clearStudioUserSession()`

## Files Created

✅ **`server/api/studio/login.ts`** - Login endpoint (matches docs example)
✅ **`server/api/studio/logout.ts`** - Logout endpoint (matches docs example)  
✅ **`server/api/studio/check.ts`** - Auth check endpoint
✅ **`pages/studio/login.vue`** - Login page UI
✅ **`middleware/studio-auth.ts`** - Protects `/_studio` route

## Verification Against Documentation

The implementation matches the official docs:

1. ✅ Uses `setStudioUserSession(event, user)` - Line 36 in login.ts
2. ✅ Uses `clearStudioUserSession(event)` - Line 5 in logout.ts
3. ✅ Required session fields: `name`, `email`, `providerId`, `avatar` - All present
4. ✅ Redirects after login - Uses `sendRedirect(event, '/')` as per docs
5. ✅ Personal Access Token required - Set via `STUDIO_GITHUB_TOKEN` env var

## Setup Steps

1. **Create GitHub Personal Access Token** (from `DatalogicsMkt` account)
2. **Add to Netlify Environment Variables**:
   - `STUDIO_GITHUB_TOKEN` = Your PAT
   - `STUDIO_USERS` = `email1:password1:name1,email2:password2:name2`

3. **Create Users**: 
   - Format: `email:password:displayname`
   - Multiple users separated by commas
   - Example: `ryan@datalogics.com:mypassword123:Ryan Porter,jane@datalogics.com:pass456:Jane Doe`

4. **Deploy** and test at `/_studio`

## How Accounts Work

- **No database needed** - Users are stored in environment variables
- **Passwords are plain text** (for simplicity) - Use strong passwords
- **To add users**: Update `STUDIO_USERS` env var in Netlify and redeploy
- **To remove users**: Remove from the `STUDIO_USERS` string

## Security Notes

⚠️ **Current setup uses plain text passwords** for simplicity. For production:
- Consider using bcrypt for password hashing
- Store hashed passwords in env vars
- Or migrate to a proper database/user management system

## Testing

1. Visit `/_studio` → Should redirect to `/studio/login`
2. Enter credentials from `STUDIO_USERS`
3. After login → Redirected to `/_studio` with Studio interface
4. All Git operations will use `DatalogicsMkt` account via the PAT
