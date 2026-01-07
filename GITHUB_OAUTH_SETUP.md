# GitHub OAuth Setup for Nuxt Studio

## Simple Setup - Just GitHub OAuth

This setup uses **GitHub OAuth directly** - one click, done.

✅ **Simple** - Just GitHub OAuth, no complex layers
✅ **Secure** - Email validation restricts access
✅ **Automatic** - OAuth tokens refresh automatically
✅ **Works with organization repos** - As long as you have write access

## Step 1: Create GitHub OAuth App

1. Go to: https://github.com/settings/developers (your personal account settings)
2. Click **"New OAuth App"**
3. Fill in:
   - **Application name**: `Datalogics Documentation Studio`
   - **Homepage URL**: `https://dev.datalogics.com` (your production domain)
   - **Authorization callback URL**: `https://dev.datalogics.com/__nuxt_studio/auth/github`
4. Click **"Register application"**

### For Local Development

Add a second callback URL:
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

### About STUDIO_GITHUB_MODERATORS (REQUIRED for Security)

**This is your access control!** This restricts who can access Nuxt Studio.

- **If set**: Only users with matching email addresses can access Studio UI
- **If not set**: **ANY** GitHub user who authenticates can access Studio (dangerous!)

**CRITICAL**: Set this to restrict Studio access to authorized users only:

```bash
STUDIO_GITHUB_MODERATORS=admin1@datalogics.com,admin2@datalogics.com
```

**How Access Control Works:**
1. `STUDIO_GITHUB_MODERATORS` → Controls who can access Studio UI
2. Repository write access → Controls who can actually publish changes
3. Both must be satisfied: User must be in moderators list AND have write access to publish

## Step 4: Redeploy

**Important**: Environment variables only apply to new deployments!

1. Trigger a new deployment:
   - Push a commit, or
   - Netlify Dashboard → **Deploys** → **Trigger deploy** → **Deploy site**

## Step 5: Test Login

1. Navigate to `https://dev.datalogics.com/studio/login`
2. Click **"Login with GitHub"**
3. Authorize the app on GitHub
4. Your email will be validated against `STUDIO_GITHUB_MODERATORS`
5. If authorized, Studio should now be active!

## How It Works

### Simple Authentication Flow

```
1. User visits /studio/login
   ↓
2. Clicks "Login with GitHub"
   ↓
3. Redirected to GitHub for authorization
   ↓
4. GitHub redirects back with OAuth code
   ↓
5. Studio exchanges code for OAuth token → Token stored in session
   ↓
6. Email validated against STUDIO_GITHUB_MODERATORS
   ↓
7. If authorized → Studio activated
   ↓
8. OAuth token automatically used for Git operations
```

**Key Points:**
- **One click** - Direct GitHub OAuth, no extra steps
- **Email validation** - Only authorized emails can access
- **Automatic Git access** - OAuth token used for publishing
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
