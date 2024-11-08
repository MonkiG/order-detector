interface Props {
  children: React.ReactNode
}

export default function ContentLayout({ children }: Props): JSX.Element {
  return <div className="h-screen w-full bg-white text-black rounded-l-[45px] p-5">{children}</div>
}
