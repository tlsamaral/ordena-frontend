import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
	CircleUser,
	Home,
	LineChart,
	LogOut,
	Moon,
	Package,
	Package2,
	PanelLeft,
	Search,
	ShoppingCart,
	Users2,
	UtensilsCrossed,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from './ui/button'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { AuthContext, signOut } from '@/contexts/AuthContext'
import { useContext } from 'react'
import { navItems } from './aside'
import { NavItem } from './nav-item'
import { PageTrial } from './page-trial'
import { TextApp } from './text-app'
import { ToggleTheme } from './toggle-theme'
import { TooltipProvider } from './ui/tooltip'

export function Header() {
	const { user } = useContext(AuthContext)

	const realNavItems = navItems.filter((item) => {
		if (user?.admin) {
			return item
		} else if (!user?.admin && !item.adminPage) {
			return item
		}
	})

	return (
		<header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 bg-zinc-50 dark:bg-zinc-800">
			<Sheet>
				<SheetTrigger asChild>
					<Button size="icon" variant="outline" className="sm:hidden">
						<PanelLeft className="h-5 w-5 text-zinc-500 dark:text-zinc-50" />
						<span className="sr-only">Toggle Menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="sm:max-w-xs dark:bg-zinc-900">
					<TooltipProvider>
						<nav className="grid gap-6 text-lg font-medium">
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
					</TooltipProvider>
				</SheetContent>
			</Sheet>
			<div className="w-full flex justify-end sm:justify-between">
				<PageTrial />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="overflow-hidden gap-3">
							<TextApp className="font-medium text-base">{user?.name}</TextApp>
							<CircleUser className="h-8 w-8 text-zinc-950 dark:text-zinc-50" />
							<span className="sr-only">Toggle user menu</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Minha conta</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild>
							<ToggleTheme />
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={signOut}>
							<LogOut size={20} /> Sair
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	)
}
