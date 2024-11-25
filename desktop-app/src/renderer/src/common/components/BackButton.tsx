import { useEffect, useState } from 'react'

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string
}
export default function BackButton({ className }: Props): JSX.Element | null {
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    const updateBackButtonState = (): void => {
      setCanGoBack(window.history.length > 1) // Si hay más de una entrada en el historial
    }

    // Actualiza al cargar y cada vez que cambie el estado del historial
    window.addEventListener('popstate', updateBackButtonState)
    updateBackButtonState()

    // Cleanup
    return (): void => {
      window.removeEventListener('popstate', updateBackButtonState)
    }
  }, [])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault()
    window.history.back()
  }

  if (!canGoBack) {
    return null
  }

  return (
    <a onClick={handleClick} className={`cursor-pointer ${className}`}>
      <svg
        viewBox="0 0 16 16"
        height={30}
        width={30}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
          {' '}
          <path
            d="M8 10L8 14L6 14L-2.62268e-07 8L6 2L8 2L8 6L16 6L16 10L8 10Z"
            fill="#000000"
          ></path>{' '}
        </g>
      </svg>
    </a>
  )
}
