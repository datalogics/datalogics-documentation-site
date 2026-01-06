import { eventHandler, readBody, createError, sendRedirect } from 'h3'
import { setStudioUserSession } from '#imports'

export default eventHandler(async (event) => {
  const { email, password } = await readBody<{ email?: string, password?: string }>(event)

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      message: 'Email and password are required'
    })
  }

  // Get admin credentials from environment variables
  const adminEmail = process.env.STUDIO_ADMIN_EMAIL
  const adminPassword = process.env.STUDIO_ADMIN_PASSWORD
  const adminName = process.env.STUDIO_ADMIN_NAME || 'Admin'

  // Validate credentials
  if (email !== adminEmail || password !== adminPassword) {
    throw createError({
      statusCode: 401,
      message: 'Invalid credentials'
    })
  }

  await setStudioUserSession(event, {
    providerId: adminEmail || email,
    name: adminName,
    email: adminEmail || email,
    avatar: ''
  })

  // Return success - client will redirect to Studio
  return { ok: true }
})
