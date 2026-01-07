# GitHub OAuth Setup for Nuxt Studio

## Why OAuth Instead of PAT?

✅ **No expiration concerns** - OAuth tokens refresh automatically
✅ **Better security** - Users authenticate with their own GitHub accounts
✅ **Automatic Git access** - OAuth token is used automatically for publishing
✅ **Works with organization repos** - As long as you have write access

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
| `STUDIO_GITHUB_MODERATORS` | `your@email.com` | **Optional** - Comma-separated list of authorized emails |

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

## Step 6: Test OAuth Login

1. Navigate to `https://dev.datalogics.com/_studio`
2. You should see a **"Login with GitHub"** button
3. Click it → You'll be redirected to GitHub to authorize
4. Authorize the app → You'll be redirected back to Studio
5. Studio should now be active!

## How It Works

1. User clicks "Login with GitHub" → Redirected to GitHub
2. User authorizes the OAuth app → GitHub redirects back with a code
3. Studio exchanges code for OAuth token → Token stored in session
4. **OAuth token is automatically used for Git operations** - No PAT needed!
5. Token refreshes automatically - No expiration issues!

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
