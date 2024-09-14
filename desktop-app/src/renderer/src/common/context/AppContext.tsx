import { createContext, useContext, useEffect, useReducer } from 'react'
import { Product, Waiter } from '../types'
import config from '../utils/config'
import httpClient from '../utils/httpClient'
import { getAllWaiters } from '@renderer/views/waiters/services'

interface ContextState {
  products: Product[]
  waiters: Waiter[]
}
const initialState: ContextState = {
  products: [],
  waiters: []
}

type ActionType =
  | { type: 'DELETE_PRODUCT'; payload: { id: string } }
  | { type: 'SET_PRODUCTS'; payload: { products: Product[] } }
  | { type: 'EDIT_PRODUCT'; payload: { id: string; product: Partial<Product> } }
  | { type: 'ADD_PRODUCT'; payload: { product: Product } }
  | { type: 'SET_WAITERS'; payload: { waiters: Waiter[] } }
  | { type: 'DELETE_WAITER'; payload: { id: string } }
  | { type: 'ADD_WAITER'; payload: { waiter: Waiter } }
  | { type: 'EDIT_WAITER'; payload: { id: string; waiter: Partial<Waiter> } }

const ProductsContext = createContext<{
  state: ContextState
  dispatch: React.Dispatch<ActionType>
  getProductById: (id: string) => Product | undefined
  getWaiterById: (id: string) => Waiter | undefined
}>({
  state: initialState,
  dispatch: () => null,
  getProductById: (_id: string) => undefined,
  getWaiterById: (_id: string) => undefined
})

function productsReducer(state: typeof initialState, action: ActionType) {
  if (action.type === 'DELETE_PRODUCT') {
    return { ...state, products: state.products.filter((x) => x.id !== action.payload.id) }
  }

  if (action.type === 'SET_PRODUCTS') {
    return { ...state, products: action.payload.products }
  }

  if (action.type === 'EDIT_PRODUCT') {
    return {
      ...state,
      products: state.products.map((x) =>
        x.id === action.payload.id ? { ...x, ...action.payload.product } : x
      )
    }
  }

  if (action.type === 'ADD_PRODUCT') {
    return { ...state, products: [...state.products, action.payload.product] }
  }

  if (action.type === 'SET_WAITERS') {
    return { ...state, waiters: action.payload.waiters }
  }

  if (action.type === 'DELETE_WAITER') {
    return { ...state, waiters: state.waiters.filter((x) => x.id != action.payload.id) }
  }

  if (action.type === 'ADD_WAITER') {
    return { ...state, waiters: [...state.waiters, action.payload.waiter] }
  }

  if (action.type === 'EDIT_WAITER') {
    return {
      ...state,
      waiters: state.waiters.map((x) =>
        x.id === action.payload.id ? { ...x, ...action.payload.waiter } : x
      )
    }
  }
  return state
}

const PRODUCTS_ENDPOINT = `${config.API_URL}/product`

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, initialState)

  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await httpClient(PRODUCTS_ENDPOINT, { method: 'GET' })
        dispatch({ type: 'SET_PRODUCTS', payload: { products: data as Product[] } })
      } catch (error) {
        console.log(error)
      }
    }

    getProducts()
  }, [])

  useEffect(() => {
    ;(async () => {
      const [, waiters] = await getAllWaiters()
      dispatch({ type: 'SET_WAITERS', payload: { waiters: waiters } })
    })()
  }, [])

  const getProductById = (id: string) => state.products.find((x) => x.id === id)
  const getWaiterById = (id: string) => state.waiters.find((x) => x.id === id)

  return (
    <ProductsContext.Provider value={{ state, dispatch, getProductById, getWaiterById }}>
      {children}
    </ProductsContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(ProductsContext)
  if (!context) throw new Error('You must be inside the context')

  return context
}
