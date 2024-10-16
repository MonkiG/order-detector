interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  className?: string
}
export default function BackButton({ className }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.history.back()
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
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
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
