import type { LucideProps } from 'lucide-react'
import Link from 'next/link'
import { Router, useRouter } from 'next/router'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

interface NavItemProps {
  label: string
  href: string
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>
  >
}
export function NavItem({ label, href, icon: Icon }: NavItemProps) {
  const router = useRouter()
  const active = router.pathname === href

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8 ${active ? 'bg-accent' : ''}`}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}
