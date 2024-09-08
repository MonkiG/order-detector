import { type ObjectId } from 'mongodb'

export interface OrderProduct {
  id: ObjectId
  name: string
  showInScreen: boolean
  details: string
}
