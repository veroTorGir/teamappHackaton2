/**
 * Base API composable.
 * Wraps $fetch to provide a consistent interface for all API calls.
 * Automatically injects the Bearer token from the auth cookie.
 * On 401: attempts token refresh; if refresh also fails with 401, signs out.
 */
export const useApi = () => {
  const token = useCookie('token.access')
  const { refresh, signOut } = useAuth()

  const authHeaders = (): Record<string, string> =>
    token.value ? { Authorization: `Bearer ${token.value}` } : {}

  const withAuth = (options?: Parameters<typeof $fetch>[1]) => ({
    ...options,
    headers: {
      ...authHeaders(),
      ...(options?.headers as Record<string, string> ?? {}),
    },
  })

  const request = async <T>(path: string, options?: Parameters<typeof $fetch>[1]): Promise<T> => {
    try {
      return await $fetch<T>(path, withAuth(options)) as T
    } catch (error: any) {
      if (error?.status === 401 || error?.response?.status === 401) {
        try {
          await refresh()
          return await $fetch<T>(path, withAuth(options)) as T
        } catch (refreshError: any) {
          if (refreshError?.status === 401 || refreshError?.response?.status === 401) {
            await signOut()
          }
          throw refreshError
        }
      }
      throw error
    }
  }

  const get = <T>(path: string, options?: Parameters<typeof $fetch>[1]): Promise<T> =>
    request<T>(path, options)

  const post = <T>(path: string, body: unknown, options?: Parameters<typeof $fetch>[1]): Promise<T> =>
    request<T>(path, { method: 'POST', body: body as never, ...options })

  const put = <T>(path: string, body: unknown, options?: Parameters<typeof $fetch>[1]): Promise<T> =>
    request<T>(path, { method: 'PUT', body: body as never, ...options })

  const patch = <T>(path: string, body: unknown, options?: Parameters<typeof $fetch>[1]): Promise<T> =>
    request<T>(path, { method: 'PATCH', body: body as never, ...options })

  const del = <T>(path: string, options?: Parameters<typeof $fetch>[1]): Promise<T> =>
    request<T>(path, { method: 'DELETE', ...options })

  return { get, post, put, patch, del }
}
