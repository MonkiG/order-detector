import { Link } from 'wouter'

export default function HomeView() {
  return (
    <div className="text-white flex flex-col items-center h-full pt-16">
      <h2 className="text-center text-4xl">
        Voice order detector <br /> desktop app
      </h2>
      <div className="mt-24 flex gap-10">
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
