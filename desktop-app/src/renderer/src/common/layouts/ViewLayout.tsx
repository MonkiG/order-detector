import { useLocation } from 'wouter'
import SideBar from '../components/SideBar'
import ContentLayout from './ContentLayout'
import { ReactNode } from 'react'

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
          <button onClick={() => window.history.back()} className="absolute top-2 left-0">
            {'<-'}
          </button>
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
