import { Link } from 'wouter'
import { Routes } from '../utils/routes'
import { useMemo } from 'react'
import brandLogo from './../../assets/brand-logo.jpeg'
import {
  ChefHatIcon,
  HouseIcon,
  PackageIcon,
  ShoppingBagIcon,
  SquareMenuIcon,
  UsersIcon
} from 'lucide-react'

interface Props {
  location: string
}

export default function SideBar({ location }: Props): JSX.Element {
  const noShow = ['login', 'order', 'addProduct', 'editProduct', 'addWaiter', 'editWaiter', 'pay']
  const sieBarRoutes = useMemo(
    () => Object.entries(Routes).filter(([x]) => !noShow.includes(x)),
    []
  )

  const icons = {
    '/home': <HouseIcon size={40} />,
    '/menu': <SquareMenuIcon size={40} />,
    '/orders': <ShoppingBagIcon size={40} />,
    '/products': <PackageIcon size={40} />,
    '/waiters': <UsersIcon size={40} />,
    '/kitchen': <ChefHatIcon size={40} />
  }
  return (
    <aside className="flex flex-col mr-2 p-5  bg-[#f5c84c] text-black w-[250px]">
      <figure className="flex flex-col items-center">
        <img src={brandLogo} alt="" srcSet="" className="w-1/2 rounded-full" />

        <figcaption>
          <h2 className="text-center text-2xl ">
            Order detector <br />
            <span className="text-xl">Panel admin</span>
          </h2>
        </figcaption>
      </figure>

      <div className="flex flex-col mt-5 gap-5">
        {sieBarRoutes.map(([key, value]) => (
          <Link
            key={`${key}-${value}`}
            to={value}
            className={`${location === value && 'underline '} hover:text-white hover:underline flex items-center gap-1`}
          >
            {icons[value]} {key.at(0)!.toLocaleUpperCase() + key.slice(1)}
          </Link>
        ))}
      </div>
    </aside>
  )
}
