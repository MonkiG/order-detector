import { type ObjectId } from 'mongodb'

export interface Product {
  id: ObjectId
  name: string
  price: number
  description: string
  showInScreen: boolean
}

export type ProductRequestDto = Omit<Product, 'id'>

export interface IProductToKitchen {
  id: ObjectId
  name: string
  amount: number | string
}
