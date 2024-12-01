export const translatePath = (path: string) => {
	switch (path) {
		case '/':
			return 'Login'
		case 'about':
			return 'Sobre nós'
		case 'contact':
			return 'Contato'
		case 'login':
			return 'Login'
		case 'register':
			return 'Cadastro'
		case 'dashboard':
			return 'Dashboard'
		case '[id]':
			return ''
		case 'tables':
			return 'Mesas'
		case 'users':
			return 'Usuários'
		case 'products':
			return 'Produtos'
		case 'categories':
			return 'Categorias'
		case 'orders':
			return 'Pedidos'
		default:
			return path
	}
}
