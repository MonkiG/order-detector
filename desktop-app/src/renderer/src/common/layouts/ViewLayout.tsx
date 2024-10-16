import { useLocation } from 'wouter'
import SideBar from '../components/SideBar'
import ContentLayout from './ContentLayout'
import { ReactNode } from 'react'
import BackButton from '../components/BackButton'

interface Props {
  children: React.ReactNode
  viewTitle: string | ReactNode
}

export default function ViewLayout({ children, viewTitle }: Props) {
  const [location] = useLocation()
  return (
    <div className="flex">
      <SideBar location={location} />
      <ContentLayout>
        <div className="relative">
          {/**
           * TODO: Poner un svg a esta madre
           * */}
          <BackButton className="absolute top-1 left-0" />
          {typeof viewTitle === 'string' ? (
            <h2 className="text-center text-3xl font-bold">{viewTitle}</h2>
          ) : (
            viewTitle
          )}
        </div>
        {children}
      </ContentLayout>
    </div>
  )
}
