/**
 * Mock endpoint: GET /api/balance/me
 *
 * Returns the authenticated user's current balance.
 *
 * To switch to the real API, replace with:
 *   const token = getCookie(event, 'token.access')
 *   return $fetch(`${useRuntimeConfig().public.baseURL}/api/balance/`, {
 *     headers: { Authorization: `Bearer ${token}` },
 *   })
 */
export default defineEventHandler(() => {
  return {
    total: 20000,
    currency: 'COP',
  }
})
