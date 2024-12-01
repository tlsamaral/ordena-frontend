'use client'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { translatePath } from '@/utils/translate-path'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export function PageTrial() {
	const [isClient, setIsClient] = useState(false)
	const router = useRouter()

	useEffect(() => {
		setIsClient(true)
	}, [])

	if (!isClient) return null // Evita problemas no SSR

	const { pathname } = router
	const pathSegments = pathname
		.split('/')
		.filter((segment) => segment !== '[id]')
		.filter((segment) => segment)

	return (
		<Breadcrumb className="ml-1 hidden sm:flex">
			<BreadcrumbList>
				{pathSegments.map((segment, index) => {
					const href = `/${pathSegments.slice(0, index + 1).join('/')}`
					const isLast = index === pathSegments.length - 1

					return (
						<BreadcrumbItem key={`${href}-${index}`}>
							{isLast ? (
								<BreadcrumbPage>{translatePath(segment)}</BreadcrumbPage>
							) : (
								<>
									<BreadcrumbLink href={href}>
										{translatePath(segment)}
									</BreadcrumbLink>
									<BreadcrumbSeparator />
								</>
							)}
						</BreadcrumbItem>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}
