# GitHub OAuth Setup for Nuxt Studio

## Authentication Overview

This setup uses a **two-layer authentication system**:

1. **Auth0** - Protects admin pages (`/studio/token` and `/studio/login`)
2. **GitHub OAuth** - Provides access to Nuxt Studio for content editing

**Why OAuth Instead of PAT?**

✅ **No expiration concerns** - OAuth tokens refresh automatically
✅ **Better security** - Users authenticate with their own GitHub accounts
✅ **Automatic Git access** - OAuth token is used automatically for publishing
✅ **Works with organization repos** - As long as you have write access

## Step 0: Set Up Auth0 (Required First)

Before setting up GitHub OAuth, you need to configure Auth0 to protect the Studio admin pages.

### 0.1 Create Auth0 Account and Application

1. Go to [Auth0 Dashboard](https://manage.auth0.com/)
2. Create an account (free tier available)
3. Click **Applications** → **Applications** → **Create Application**
4. Configure:
   - **Application name**: `Datalogics Dev Site` (or your preferred name)
   - **Application type**: Select **"Regular Web Application"**
5. Go to **Settings** tab and configure URLs:
   - **Allowed Callback URLs**:
     ```
     http://localhost:3000/auth/callback,https://dev.datalogics.com/auth/callback
     ```
   - **Allowed Logout URLs**:
     ```
     http://localhost:3000,https://dev.datalogics.com
     ```
   - **Allowed Web Origins**:
     ```
     http://localhost:3000,https://dev.datalogics.com
     ```
6. Copy your **Domain**, **Client ID**, and **Client Secret**

### 0.2 Install Auth0 Nuxt SDK

```bash
npm install @auth0/auth0-nuxt
```

### 0.3 Configure Environment Variables

Add to your `.env` file and Netlify environment variables:

```bash
NUXT_AUTH0_DOMAIN=your-auth0-domain.us.auth0.com
NUXT_AUTH0_CLIENT_ID=your_client_id
NUXT_AUTH0_CLIENT_SECRET=your_client_secret
NUXT_AUTH0_SESSION_SECRET=<generate with: openssl rand -hex 64>
NUXT_AUTH0_APP_BASE_URL=https://dev.datalogics.com
```

**Generate session secret:**
- Mac/Linux: `openssl rand -hex 64`
- Windows PowerShell: See Auth0 Nuxt documentation

### 0.4 Create Auth0 User Accounts

1. Go to Auth0 Dashboard → **User Management** → **Users**
2. Click **Create User**
3. Add each admin's email address
4. Users will set their password on first login (or you can set a temporary password)

**Note**: Only admins who need to access `/studio/token` or `/studio/login` need Auth0 accounts. Regular users will authenticate directly with GitHub OAuth for Studio access.

## Step 1: Create Personal OAuth App

✅ **Yes, this works!** You can create a **personal OAuth app** (under your personal GitHub account) and it will work with organization repositories as long as:
- Your personal account has **admin or write access** to the repository
- Users who authenticate also have **write access** to the repository

**No organization admin access required!**

1. Go to: https://github.com/settings/developers (your personal account settings)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `Datalogics Documentation Studio`
   - **Homepage URL**: `https://dev.datalogics.com` (your production domain)
   - **Authorization callback URL**: `https://dev.datalogics.com/__nuxt_studio/auth/github`
4. Click **"Register application"**

**Important**: When users authenticate via this OAuth app, they'll use their own GitHub tokens for Git operations. Make sure any user who needs to publish has write access to `datalogics/datalogics-documentation-site`.

### For Local Development

If you want to test locally, you can add a second callback URL:
- Go to your OAuth app settings
- Add: `http://localhost:3000/__nuxt_studio/auth/github`

## Step 2: Get Your Credentials

After creating the OAuth app:

1. **Client ID** - You'll see this immediately (copy it)
2. **Client Secret** - Click **"Generate a new client secret"** and copy it immediately (you won't see it again!)

## Step 3: Add to Netlify Environment Variables

1. Go to Netlify Dashboard → **Site settings** → **Environment variables**
2. Add these variables:

| Key | Value | Notes |
|-----|-------|-------|
| `STUDIO_GITHUB_CLIENT_ID` | `<your_client_id>` | From Step 2 |
| `STUDIO_GITHUB_CLIENT_SECRET` | `<your_client_secret>` | From Step 2 |
| `STUDIO_GITHUB_MODERATORS` | `your@email.com` | **Required** - Comma-separated list of authorized emails |
| `STUDIO_LOGIN_SECRET` | `<random_secret_string>` | **Recommended** - Secret for time-based rotating tokens (see Security section below) |

### About STUDIO_GITHUB_MODERATORS (REQUIRED for Security)

**This is your access control!** This restricts who can even see/access Nuxt Studio.

- **If set**: Only users with matching email addresses can access Studio UI
- **If not set**: **ANY** GitHub user who authenticates can access Studio (dangerous!)

**CRITICAL**: Set this to restrict Studio access to repository admins only:

```bash
STUDIO_GITHUB_MODERATORS=admin1@datalogics.com,admin2@datalogics.com
```

**How Access Control Works:**
1. `STUDIO_GITHUB_MODERATORS` → Controls who can access Studio UI (restrict to admins)
2. Repository write access → Controls who can actually publish changes
3. Both must be satisfied: User must be in moderators list AND have write access to publish

**Example for repository admins only:**
```bash
# Only these emails can access Studio
STUDIO_GITHUB_MODERATORS=dlweb@datalogics.com,tech-lead@datalogics.com
```

This ensures that even if someone authenticates with GitHub, they won't see Studio unless their email is in this list.

### Protecting the Login Page (Optional but Recommended)

By default, the login page at `/studio/login` is publicly accessible (though not indexed by search engines). To add an extra layer of security, you can protect it with a **time-based rotating token** (like Google Authenticator).

**How it works:**
- Set `STUDIO_LOGIN_SECRET` environment variable with a random secret string
- Token automatically rotates **every hour** based on the secret + current time
- Users must access: `/studio/login?token=CURRENT_TOKEN`
- Without the token, the page returns 404 (hidden from normal users)
- Admins can visit `/studio/token` to get the current valid token

**Generate a secure secret:**
```bash
# On Linux/Mac
openssl rand -hex 32

# Or use any random string generator
```

**Example:**
```bash
STUDIO_LOGIN_SECRET=your_random_secret_string_here
```

**Getting the Current Token:**
1. Visit: `https://dev.datalogics.com/studio/token`
2. Copy the current token or full login URL
3. Token automatically refreshes every 5 minutes on the token page
4. Token is valid for 1 hour, then rotates to a new one

**Benefits:**
- ✅ **Dynamic tokens** - Changes every hour automatically
- ✅ **Easy access** - Admins can visit `/studio/token` to get current token
- ✅ **No external services** - Uses built-in crypto, completely free
- ✅ **Secure** - Token is derived from secret + time, can't be guessed
- ✅ **Backwards compatible** - Falls back to static token if `STUDIO_LOGIN_SECRET` not set

**Security layers:**
1. ✅ Secret token required to access login page (`STUDIO_LOGIN_TOKEN`)
2. ✅ Email must be in moderators list (`STUDIO_GITHUB_MODERATORS`)
3. ✅ GitHub OAuth authentication required
4. ✅ Repository write access required to publish changes
5. ✅ Page not indexed by search engines (robots.txt)

## Step 4: Remove Custom Auth Files

After switching to OAuth, you can remove:
- `server/api/studio/login.ts` (OAuth handles login)
- `server/api/studio/check.ts` (Studio handles this automatically)
- `server/api/studio/logout.ts` (Studio handles this automatically)
- `pages/studio/login.vue` (OAuth redirects to GitHub)
- `middleware/studio-auth.ts` (Studio handles auth automatically)

## Step 5: Redeploy

**Important**: Environment variables only apply to new deployments!

1. Trigger a new deployment:
   - Push a commit, or
   - Netlify Dashboard → **Deploys** → **Trigger deploy** → **Deploy site**

## Step 6: Test Authentication Flow

### Testing Auth0 Login

1. Navigate to `https://dev.datalogics.com/studio/token` or `https://dev.datalogics.com/studio/login`
2. You should be redirected to Auth0 login page
3. Log in with your Auth0 admin credentials
4. You'll be redirected back to the original page

### Testing GitHub OAuth (Studio Access)

1. Navigate to `https://dev.datalogics.com/studio/login` (after Auth0 login)
2. You should see a **"Login with GitHub"** button
3. Click it → You'll be redirected to GitHub to authorize
4. Authorize the app → You'll be redirected back to Studio
5. Your email will be validated against `STUDIO_GITHUB_MODERATORS`
6. If authorized, Studio should now be active!

## How It Works

### Complete Authentication Flow

```
1. Admin visits /studio/login
   ↓
2. Auth0 middleware checks authentication
   ↓
3. If not authenticated → Redirect to /auth/login (Auth0)
   ↓
4. Admin logs in with Auth0 credentials
   ↓
5. Auth0 redirects back to /studio/login
   ↓
6. Admin clicks "Login with GitHub"
   ↓
7. Redirected to GitHub for authorization
   ↓
8. GitHub redirects back with OAuth code
   ↓
9. Studio exchanges code for OAuth token → Token stored in session
   ↓
10. Email validated against STUDIO_GITHUB_MODERATORS
   ↓
11. If authorized → Studio activated
   ↓
12. OAuth token automatically used for Git operations
```

**Key Points:**
- **Auth0** protects admin pages (user management, audit logs)
- **GitHub OAuth** provides Studio access and Git permissions
- **Email validation** ensures only authorized users can publish
- **OAuth token refreshes automatically** - No expiration issues!

## Troubleshooting

### "Unauthorized" after login
- Check `STUDIO_GITHUB_MODERATORS` - your email must be in the list
- Verify you've authorized the OAuth app on GitHub

### Can't publish changes
- Verify you have **write access** to `datalogics/datalogics-documentation-site`
- Check that OAuth app requested `repo` scope (should be automatic)
- Check Netlify function logs for errors

### Callback URL mismatch
- Make sure callback URL in OAuth app matches exactly: `https://dev.datalogics.com/__nuxt_studio/auth/github`
- Check for trailing slashes, http vs https, etc.
