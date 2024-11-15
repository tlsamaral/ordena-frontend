// src/socket.ts
import { getUserIdFromToken } from '@/utils/getUserIdByToken'
import { type Socket, io } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_URL as string

let socket: Socket

export const initializeSocket = (): Socket => {
  const userId = getUserIdFromToken()
  const socket = io('http://localhost:3333', {
    auth: { userId: userId },
  })

  socket.on('connect', () => {
    console.log('Connected with WS Server')
  })

  socket.on('connect_error', (err) => {
    console.error('Error on connection:', err)
  })
  return socket
}

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error('Socket.IO client has not been initialized')
  }
  return socket
}
