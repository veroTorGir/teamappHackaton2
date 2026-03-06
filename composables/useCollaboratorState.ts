import type { Collaborator } from '~/types/collaborator'

/**
 * Global collaborator state — set once on dashboard load,
 * readable from any component including layout modals.
 */
export const useCollaboratorState = () => {
  const collaborator = useState<Collaborator | null>('collaborator', () => null)
  return { collaborator }
}
