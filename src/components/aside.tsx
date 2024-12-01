import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import {
	Dice4,
	Home,
	Package,
	ReceiptText,
	Settings,
	User,
	UtensilsCrossed,
} from 'lucide-react'
import Link from 'next/link'
import { NavItem } from './nav-item'
import { Button } from './ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from './ui/dropdown-menu'

export const navItems = [
	{ label: 'Dashboard', href: '/dashboard', icon: Home },
	{ label: 'Produtos', href: '/products', icon: Package },
	{ label: 'Usuários', href: '/users', icon: User },
	{ label: 'Pedidos', href: '/orders', icon: ReceiptText },
	{ label: 'Mesas', href: '/tables', icon: Dice4 },
]

export function Aside() {
	return (
		<TooltipProvider>
			<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex dark:bg-zinc-950 bg-zinc-300">
				<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
					<Link
						href="/dashboard"
						className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full md:h-8 md:w-8 md:text-base bg-orange-300 text-zinc-900 dark:bg-orange-300 dark:text-zinc-900"
					>
						<UtensilsCrossed className="h-4 w-4 transition-all group-hover:scale-110" />
						<span className="sr-only">Acme Inc</span>
					</Link>
					{navItems.map((link, i) => (
						<NavItem
							key={link.href}
							href={link.href}
							icon={link.icon}
							label={link.label}
						/>
					))}
				</nav>
			</aside>
		</TooltipProvider>
	)
}
