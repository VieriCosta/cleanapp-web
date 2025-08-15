// src/lib/socket.ts
import { io, Socket } from 'socket.io-client';
import { getTokens } from '../store/auth.storage';

let socket: Socket | null = null;

export function getSocket() {
  if (socket?.connected) return socket;

  const apiUrl = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3000/api';
  const baseUrl = apiUrl.replace(/\/api\/?$/, ''); // ex: http://localhost:3000

  const tokens = getTokens();
  socket = io(baseUrl, {
    transports: ['websocket'],
    auth: { token: tokens?.accessToken },
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
