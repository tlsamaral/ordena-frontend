import { cn } from '@/lib/utils'

interface TextAppProps extends React.HTMLAttributes<HTMLSpanElement> {
	children: React.ReactNode
	className?: string
}
export function TextApp({ children, className, ...props }: TextAppProps) {
	return (
		<span
			className={cn('text-zinc-950 dark:text-zinc-50', className)}
			{...props}
		>
			{children}
		</span>
	)
}
