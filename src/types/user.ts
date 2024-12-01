export interface User {
	id: string
	name: string
	email: string
	admin: boolean
	permission: boolean
}

export type Users = User[]
