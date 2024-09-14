import { Link } from 'wouter'
import { Routes } from '../utils/routes'
import { useMemo } from 'react'

interface Props {
  location: string
}

export default function SideBar({ location }: Props) {
  const noShow = ['login', 'order', 'addProduct', 'editProduct', 'addWaiter', 'editWaiter']
  const sieBarRoutes = useMemo(
    () => Object.entries(Routes).filter(([x]) => !noShow.includes(x)),
    []
  )

  return (
    <aside className="flex flex-col mr-2 p-5 w-fit">
      <h2 className="text-center text-2xl text-white">
        Order detector <br />
        <span className="text-xl">Panel admin</span>
      </h2>

      <div className="flex flex-col mt-5 text-gray-500">
        {sieBarRoutes.map(([key, value]) => (
          <Link
            key={`${key}-${value}`}
            to={value}
            className={`${location === value && 'underline text-white'} hover:text-white hover:underline`}
          >
            {key.at(0)!.toLocaleUpperCase() + key.slice(1)}
          </Link>
        ))}
      </div>
    </aside>
  )
}
