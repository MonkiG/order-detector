import { type ObjectId } from 'mongodb'
import { type Product } from './Product'

export type Table = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8' | 'T9'

export interface Order {
  id: ObjectId
  products: Product[]
  waiter: string | number
  partial: boolean
  open: boolean
  table: Table
  createdAt: string
}
