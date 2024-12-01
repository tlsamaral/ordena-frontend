import { Toaster } from '@/components/ui/toaster'
import { Head, Html, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en" className="min-w-screen">
			<Head />
			<body className="antialiased dark:bg-zinc-800 bg-slate-50">
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
