import { ProductToKitchen } from './models/Product'

export type ReturnTuple<T> = [Error | null, T | null]

export interface AddData {
  type: 'order'
  data: {
    waiter: string
    table: string | number
    products: ProductToKitchen[]
    notes: string | null
  }
}
