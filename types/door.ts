import type { Company } from './collaborator'

export interface Door {
  id: string
  name: string
  picture: string
  company: Company
}
