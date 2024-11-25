import { Link } from 'wouter'
import logo from '../../assets/brand-logo.jpeg'
export default function HomeView(): JSX.Element {
  return (
    <div className=" bg-[#f5c84c] flex flex-col items-center h-full pt-16">
      <figure className="flex flex-col items-center">
        <img src={logo} alt="" srcSet="" className="w-1/5 rounded-full" />
        <figcaption>
          <h2 className="text-center text-4xl">
            Voice order detector <br /> desktop app
          </h2>
        </figcaption>
      </figure>
      <div className="mt-10 flex gap-10">
        <Link
          to="/menu"
          className="text-xl border-2 border-solid border-white p-5 rounded-md hover:bg-[rgba(255,255,255,0.1)]"
        >
          Go to Panel Admin
        </Link>
        <Link
          to="/kitchen"
          className="text-xl border-2 border-solid border-white p-5 rounded-md hover:bg-[rgba(255,255,255,0.1)]"
        >
          Open Kitchen screen
        </Link>
      </div>
    </div>
  )
}
