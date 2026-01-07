// Server endpoint to check if a user's email is authorized
import { eventHandler, readBody } from 'h3'

export default eventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}))
  const userEmail = body.email as string | undefined

  if (!userEmail) {
    return { authorized: false, reason: 'No email provided' }
  }

  // Get moderators list from environment
  const moderatorsEnv = process.env.STUDIO_GITHUB_MODERATORS || ''
  
  if (!moderatorsEnv.trim()) {
    // No moderators list = allow all (Studio will handle this)
    return { authorized: true, reason: 'No moderators list configured' }
  }

  // Parse moderators list (comma-separated emails)
  const moderators = moderatorsEnv
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0)

  if (moderators.length === 0) {
    return { authorized: true, reason: 'Empty moderators list' }
  }

  // Check if user's email is in the moderators list
  const emailLower = userEmail.toLowerCase().trim()
  const authorized = moderators.includes(emailLower)

  return {
    authorized,
    email: emailLower,
    reason: authorized 
      ? 'Email is authorized' 
      : 'Email is not in moderators list'
  }
})
