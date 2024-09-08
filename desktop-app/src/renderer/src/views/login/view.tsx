import { ChangeEvent, FormEvent, useState } from 'react'
import { useLocation } from 'wouter'

export default function LoginView() {
  const [, redirect] = useLocation()

  const [data, setData] = useState({
    email: '',
    password: ''
  })

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    /**
     * TODO: Setear role en el local storage
     */
    window.localStorage.setItem('role', 'admin')
    redirect('/admin/')
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="text-white flex flex-col items-center">
      <h2 className="text-center text-4xl">
        Voice order detector <br /> desktop app login
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-1/2 mt-10">
        {Object.keys(data).map((x, i) => {
          if (x === 'password') {
            return (
              <div key={x + i}>
                <label htmlFor={x}>{x.charAt(0).toLocaleUpperCase() + x.slice(1)}</label>
                <PasswordInput
                  className="text-black"
                  name={x}
                  value={data.password}
                  onChange={handleInputChange}
                />
              </div>
            )
          }
          return (
            <div key={x + i} className="flex flex-col">
              <label htmlFor={x}>{x.charAt(0).toLocaleUpperCase() + x.slice(1)}</label>
              <input
                type={x}
                name={x}
                value={data[x]}
                className="text-black"
                onChange={handleInputChange}
              />
            </div>
          )
        })}
        <button
          type="submit"
          className="border-2 border-solid border-white hover:bg-[rgba(255,255,255,0.1)] rounded-md mt-10"
        >
          Log in
        </button>
      </form>
    </div>
  )
}

const PasswordInput = ({
  value,
  onChange,
  name,
  className
}: {
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  name: string
  className: string
}) => {
  const [view, setView] = useState(false)

  return (
    <div>
      <input
        type={view ? 'text' : 'password'}
        className={className}
        name={name}
        value={value}
        onChange={onChange}
      />
      <button
        onClick={() => {
          setView(!view)
        }}
        type="button"
        className="underline pl-2"
      >
        {view ? 'Hide password' : 'View password'}
      </button>
    </div>
  )
}
