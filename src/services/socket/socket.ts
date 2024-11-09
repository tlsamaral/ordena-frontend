// src/socket.ts
import { type Socket, io } from 'socket.io-client'

const SOCKET_URL = process.env.NEXT_PUBLIC_BASE_URL as string

let socket: Socket

export const initializeSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL)
    console.log('Socket.IO client initialized')
  }
  return socket
}

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error('Socket.IO client has not been initialized')
  }
  return socket
}
