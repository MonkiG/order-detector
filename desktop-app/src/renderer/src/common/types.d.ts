export interface Product {
  id: string
  name: string
  price: number | string
  description: string
  showInScreen: boolean
}

export interface Waiter {
  id: string
  name: string
  lastName: string
  active: boolean
  createdAt: string
  updatedAt: string
}
