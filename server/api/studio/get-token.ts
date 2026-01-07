// Endpoint for admins to get the current valid login token
// This generates a time-based token that rotates periodically
import { eventHandler, createError } from 'h3'
import { createHash } from 'node:crypto'

export default eventHandler(async (event) => {
  // Get the base secret from environment
  const baseSecret = process.env.STUDIO_LOGIN_SECRET || process.env.STUDIO_LOGIN_TOKEN || ''
  
  if (!baseSecret) {
    throw createError({
      statusCode: 500,
      message: 'STUDIO_LOGIN_SECRET is not configured'
    })
  }

  // Generate time-based token
  // Token rotates every hour (you can change this to daily, etc.)
  const timeWindow = Math.floor(Date.now() / (1000 * 60 * 60)) // Hourly rotation
  // For daily rotation: Math.floor(Date.now() / (1000 * 60 * 60 * 24))
  
  // Create token by hashing: secret + time window
  const tokenData = `${baseSecret}-${timeWindow}`
  const token = createHash('sha256')
    .update(tokenData)
    .digest('hex')
    .substring(0, 16) // Use first 16 characters for shorter token

  // Also calculate next token (for display purposes)
  const nextTimeWindow = timeWindow + 1
  const nextTokenData = `${baseSecret}-${nextTimeWindow}`
  const nextToken = createHash('sha256')
    .update(nextTokenData)
    .digest('hex')
    .substring(0, 16)

  // Calculate when current token expires
  const expiresAt = new Date((timeWindow + 1) * 1000 * 60 * 60)
  const timeUntilExpiry = expiresAt.getTime() - Date.now()
  const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60))

  return {
    token,
    nextToken,
    expiresAt: expiresAt.toISOString(),
    minutesUntilExpiry,
    loginUrl: `/studio/login?token=${token}`,
    note: 'Token rotates every hour. Bookmark this page for easy access.'
  }
})
