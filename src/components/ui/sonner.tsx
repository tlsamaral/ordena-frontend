import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast: `
						group toast 
						bg-zinc-950 text-zinc-100 border-zinc-700 shadow-lg
						group-[.toaster]:bg-zinc-900 group-[.toaster]:text-zinc-100
					`,
					description: "text-zinc-400",
					actionButton: `
						bg-zinc-600 text-zinc-100 
						hover:bg-zinc-500
					`,
					cancelButton: `
						bg-zinc-700 text-zinc-200 
						hover:bg-zinc-600
					`,
				},
			}}
			{...props}
		/>
	);
};

export { Toaster };
