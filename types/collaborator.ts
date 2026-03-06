export interface CollaboratorUser {
  id: number
  first_name: string
  last_name: string
  email: string
}

export interface Company {
  id: number
  name: string
  web_page: string
  discord_tag: string
  discord_emoji: string
  logo: string
  primary_color: string
  secondary_color: string
}

export interface Position {
  id: number
  name: string
  area_fk: number
}

export interface Country {
  id: number
  name: string
}

export interface Department {
  id: number
  country: Country
  name: string
  postal_code: string
}

export interface Place {
  id: number
  department: Department
  name: string
  postal_code: string
}

export interface Room {
  id: number
  name: string
  picture: string
  order: number
  capacity: number
  available: boolean
  place: number | null
}

export interface DaySchedule {
  id: number
  room: Room
  day: string
  breakfast: boolean
  breakfast_vegan: boolean
  lunch: boolean
  lunch_vegan: boolean
  dinner: boolean
  dinner_vegan: boolean
  breakfast_confirmed: boolean
  breakfast_vegan_confirmed: boolean
  lunch_confirmed: boolean
  lunch_vegan_confirmed: boolean
  dinner_confirmed: boolean
  dinner_vegan_confirmed: boolean
}

export interface WeekSchedule {
  id: number
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
  first_day_of_week: string
  colaborator: number
}

export interface Collaborator {
  id: number
  user: CollaboratorUser
  company: Company[]
  position: Position[]
  place: Place
  discord_id: string
  public_key: string
  lead: boolean
  birthday: string
  gender: string
  phone: string
  profile_picture: string
  priorized: boolean
  number_of_days: number
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
  sunday: boolean
  in_game_service: boolean
  in_el_fiestas_service: boolean
  schedule_user: boolean
  lead_by: number
  doors: string[]
  rooms: number[]
  schedule: WeekSchedule
}
