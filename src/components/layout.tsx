import { useRouter } from 'next/router'
import { Aside } from './aside'
import { Header } from './header'

interface LayoutProps {
  children: React.ReactNode
}
export function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const publicRoutes = ['/', '/login', '/404']

  if (publicRoutes.includes(router.pathname)) {
    return <>{children}</>
  }
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Aside />

      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header />
        {children}
      </div>
    </div>
  )
}
