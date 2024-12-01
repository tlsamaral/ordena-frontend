import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from './ui/button'

export function ToggleTheme() {
	const { setTheme, theme } = useTheme()

	const toggleTheme = () => {
		setTheme(theme === 'dark' ? 'light' : 'dark')
	}

	return (
		<Button variant="ghost" className="p-0 px-2" onClick={toggleTheme}>
			<SunIcon size={20} className="text-yellow-500 dark:hidden" />
			<MoonIcon size={20} className="hidden dark:block" />
			<span>Alterar tema</span>
			<span className="sr-only">Alterar tema</span>
		</Button>
	)
}
