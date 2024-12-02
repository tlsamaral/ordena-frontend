import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { AuthContext } from '@/contexts/AuthContext'
import {
	Dice4,
	Home,
	Package,
	ReceiptText,
	User,
	UtensilsCrossed,
} from 'lucide-react'
import Link from 'next/link'
import { useContext } from 'react'
import { NavItem } from './nav-item'

export const navItems = [
	{ label: 'Dashboard', href: '/dashboard', icon: Home, adminPage: true },
	{ label: 'Produtos', href: '/products', icon: Package, adminPage: true },
	{ label: 'Usuários', href: '/users', icon: User, adminPage: true },
	{ label: 'Pedidos', href: '/orders', icon: ReceiptText, adminPage: false },
	{ label: 'Mesas', href: '/tables', icon: Dice4, adminPage: false },
]

export function Aside() {
	const { user } = useContext(AuthContext)

	const realNavItems = navItems.filter((item) => {
		if (user?.admin && item.adminPage) {
			return item
		} else if (!user?.admin && !item.adminPage) {
			return item
		}
	})

	return (
		<TooltipProvider>
			<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex dark:bg-zinc-950 bg-zinc-300">
				<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
					<Link
						href="#"
						className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full md:h-8 md:w-8 md:text-base bg-orange-300 text-zinc-900 dark:bg-orange-300 dark:text-zinc-900"
					>
						<UtensilsCrossed className="h-4 w-4 transition-all group-hover:scale-110" />
						<span className="sr-only">Acme Inc</span>
					</Link>
					{realNavItems.map((link, i) => (
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
