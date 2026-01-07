# GitHub Token Setup for Nuxt Studio

## The Problem
403 errors when publishing from Studio indicate your GitHub token either:
- ❌ Not set in Netlify environment variables
- ❌ Has insufficient permissions
- ❌ Is expired or invalid

## Solution: Create Fine-Grained Personal Access Token

### Step 1: Create the Token

1. Go to: https://github.com/settings/personal-access-tokens/new?type=fine_grained
2. Fill in:
   - **Token name**: `Datalogics Studio Production`
   - **Expiration**: Choose based on your security policy
   - **Description**: `Token for Nuxt Studio to publish content changes`

### Step 2: Configure Repository Access

- **Resource owner**: Select `datalogics` (the organization)
- **Repository access**: Select `Only select repositories`
- **Repositories**: Choose `datalogics/datalogics-documentation-site`

### Step 3: Set Permissions

Under **Repository permissions**, you need:

1. **Contents** → **Read and write**
   - This allows Studio to:
     - Read repository files
     - Create commits
     - Push changes
     - Create blobs (which is failing in your 403 error)

2. **Metadata** → **Read-only** (automatically included)

**Important**: Make sure "Contents" is set to **Read and write**, not just "Read"!

### Step 4: Generate and Copy Token

1. Click **Generate token**
2. **IMMEDIATELY copy the token** - you won't be able to see it again!
3. The token will start with something like `github_pat_...`

### Step 5: Add to Netlify

1. Go to your Netlify site dashboard
2. Navigate to: **Site settings** → **Environment variables**
3. Add a new variable:
   - **Key**: `STUDIO_GITHUB_TOKEN`
   - **Value**: Paste your token (the full token starting with `github_pat_...`)
4. **Save**

### Step 6: Redeploy

After adding the token, **trigger a new deployment**:
- Either push a commit to your repo, or
- Go to Netlify Dashboard → **Deploys** → **Trigger deploy** → **Deploy site**

The environment variable is only available to new deployments!

## Verification

After redeploying, try publishing again. The 403 errors should be gone.

## Common Issues

### Token Not Working?
- ✅ Verify token starts with `github_pat_`
- ✅ Check Contents permission is "Read and write" (not just "Read")
- ✅ Ensure repository is selected correctly
- ✅ Make sure you've redeployed after adding the token

### Still Getting 403?
- Check Netlify function logs for more details
- Verify the token hasn't expired
- Make sure you're using a **Fine-grained** token (not Classic)

## Alternative: Classic Token

If Fine-grained tokens don't work, you can use a Classic token:

1. Go to: https://github.com/settings/tokens/new?type=beta
2. Select scopes:
   - ✅ `repo` (Full control of private repositories)
3. Generate and use it the same way
