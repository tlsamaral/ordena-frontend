import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { Home, Package, Package2, Settings, User } from "lucide-react";
import Link from "next/link";
import { NavItem } from "./nav-item";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const navItems = [
	{ label: "Dashboard", href: "/dashboard", icon: Home },
	{ label: "Products", href: "/products", icon: Package },
	{ label: "Users", href: "/users", icon: User },
];

export function Aside() {
	return (
		<TooltipProvider>
			<aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex bg-zinc-950">
				<nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
					<Link
						href="#"
						className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
					>
						<Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
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
				<nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
					<Tooltip>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<TooltipTrigger asChild>
									<Button
										variant="ghost"
										size="icon"
										className="overflow-hidden rounded-full"
									>
										<Settings className="h-5 w-5" />
										<span className="sr-only">Settings</span>
									</Button>
								</TooltipTrigger>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuLabel>Preferences</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Set Theme</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Logout</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
						<TooltipContent side="right">Settings</TooltipContent>
					</Tooltip>
				</nav>
			</aside>
		</TooltipProvider>
	);
}
