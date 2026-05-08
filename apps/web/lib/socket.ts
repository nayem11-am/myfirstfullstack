import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';

class SocketService {
  public socket: Socket | null = null;

  public connect(workspaceId: string, userId: string, userName?: string) {
    if (this.socket?.connected) return;

    this.socket = io(SOCKET_URL, {
      query: { workspaceId, userId, userName: userName || '' },
      transports: ['websocket'],

      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    console.log(`🔌 Socket connecting to ${SOCKET_URL} (Workspace: ${workspaceId})`);
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      console.log('🔴 Socket disconnected');
    }
  }

  public emit(event: string, data: any) {
    if (this.socket) {
      this.socket.emit(event, data);
    }
  }

  public on(event: string, callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }
}

export const socketService = new SocketService();
