import type { Collaborator } from '~/types/collaborator'

export const useCollaboratorApi = () => {
  const api = useApi()
  const config = useRuntimeConfig()

  return {
    getMe: (): Promise<Collaborator[]> =>
      api.get(`${config.public.baseURL}/api/colaborator/?from=me`),
  }
}
