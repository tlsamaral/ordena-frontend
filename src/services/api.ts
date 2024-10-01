// biome-ignore lint/style/useNodejsImportProtocol: <explanation>
import type { ParsedUrlQuery } from 'querystring'
import { signOut } from '@/contexts/AuthContext'
import axios, { type AxiosError } from 'axios'
import type { GetServerSidePropsContext, PreviewData } from 'next'
import { parseCookies } from 'nookies'
import { AuthTokenError } from './errors/AuthTokenError'

export function setupAPIClient(
  ctx:
    | GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
    | undefined = undefined,
) {
  const cookies = parseCookies(ctx)

  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL as string,
    headers: {
      Authorization: `Bearer ${cookies['@nextauth.token']}`,
    },
  })

  api.interceptors.response.use(
    (response) => {
      return response
    },
    (error: AxiosError) => {
      if (error.response?.status === 401) {
        // qualquer erro 401 (nao autorizado) devemos deslogar o usuario
        // biome-ignore lint/suspicious/useValidTypeof: <explanation>
        if (typeof window !== undefined) {
          signOut()
        } else {
          return Promise.reject(new AuthTokenError())
        }
      }

      return Promise.reject(error)
    },
  )

  return api
}
