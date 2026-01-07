// Server endpoint to validate a token (for client-side middleware)
import { eventHandler, readBody, createError } from 'h3'
import { createHash } from 'node:crypto'

export default eventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const providedToken = body.token as string | undefined

  if (!providedToken) {
    return { valid: false }
  }

  // Get the base secret from environment
  const baseSecret = process.env.STUDIO_LOGIN_SECRET || process.env.STUDIO_LOGIN_TOKEN || ''
  
  if (!baseSecret) {
    return { valid: false }
  }

  // Check current time window (hourly rotation)
  const timeWindow = Math.floor(Date.now() / (1000 * 60 * 60))
  
  // Check current token
  const currentTokenData = `${baseSecret}-${timeWindow}`
  const currentToken = createHash('sha256')
    .update(currentTokenData)
    .digest('hex')
    .substring(0, 16)
  
  // Also check previous time window (in case token just rotated)
  const prevTimeWindow = timeWindow - 1
  const prevTokenData = `${baseSecret}-${prevTimeWindow}`
  const prevToken = createHash('sha256')
    .update(prevTokenData)
    .digest('hex')
    .substring(0, 16)
  
  // Validate token matches current or previous window
  const valid = providedToken === currentToken || providedToken === prevToken

  return { valid }
})
