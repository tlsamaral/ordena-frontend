import { jwtDecode } from 'jwt-decode'
import { parseCookies } from 'nookies'
export const getUserIdFromToken = () => {
  try {
    const cookies = parseCookies()
    const token = cookies['@nextauth.token']
    if (token) {
      const decodedToken = jwtDecode(token)
      return decodedToken.sub
    }
  } catch (error) {
    console.error('Erro ao decodificar o token:', error)
  }
  return null
}
