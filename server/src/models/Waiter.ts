import { ObjectId } from 'mongodb'

export interface Waiter {
  id: ObjectId
  name: string
  lastName: string
  active: boolean
  createdAt: string
  updatedAt: string
}
