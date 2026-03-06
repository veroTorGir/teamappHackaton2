export interface FoodRoom {
  id: number
  name: string
  picture: string
  order: number
  capacity: number
  available: boolean
  place: unknown
}

export interface FoodSchedule {
  id: number
  day: string
  room: FoodRoom | number
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
