import { eventHandler } from 'h3'
import { clearStudioUserSession } from '#imports'

export default eventHandler(async (event) => {
  await clearStudioUserSession(event)
  return { ok: true }
})
