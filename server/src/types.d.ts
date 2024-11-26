export type ReturnTuple<T> = [Error | null, T | null]

export interface AddData {
  type: 'order'
  data: {
    waiter: {
      name: string
      id: string
    }
    table: string
    products: {
      amount: number
      id: string
    }[]
    notes: string | null
  }
}
