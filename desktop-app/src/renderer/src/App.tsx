import { useEffect } from 'react'
import { Switch, Route, useLocation } from 'wouter'
import HomeView from './views/home/view'
import LoginView from './views/login/view'
import { Routes } from './common/utils/routes'
import MenuView from './views/menu/view'
import ProductsView from './views/products/view'
import OrdersView from './views/orders/view'
import View404 from './common/components/404'
import AddProductView from './views/products/add-product/view'
import EditProductView from './views/products/edit-product/view'
import WaitersView from './views/waiters/view'
import AddWaiterView from './views/waiters/add-waiter/view'
import EditWaiterView from './views/waiters/edit-waiter/view'

export default function App() {
  const [, redirect] = useLocation()
  useEffect(() => {
    redirect('/home')
  }, [])

  return (
    <Switch>
      <Route path={Routes.home} component={HomeView} />
      <Route path={Routes.menu} component={MenuView} />
      <Route path={Routes.orders} component={OrdersView} />
      <Route path={Routes.login} component={LoginView} />

      <Route path={Routes.waiters} component={WaitersView} />
      <Route path={Routes.addWaiter} component={AddWaiterView} />
      <Route path={Routes.editWaiter} component={EditWaiterView} />

      <Route path={Routes.products} component={ProductsView} />
      <Route path={Routes.addProduct} component={AddProductView} />
      <Route path={Routes.editProduct} component={EditProductView} />
      <Route path={'*'} component={View404} />
    </Switch>
  )
}
