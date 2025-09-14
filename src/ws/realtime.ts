import type { Server as SocketIOServer } from 'socket.io';

let ioRef: SocketIOServer | null = null;

export function registerRealtime(io: SocketIOServer) {
  ioRef = io;
  io.on('connection', socket => {
    socket.on('poll:join', (pollId: string) => {
      socket.join(`poll:${pollId}`);
    });
    socket.on('poll:leave', (pollId: string) => {
      socket.leave(`poll:${pollId}`);
    });
  });
}

export async function broadcastPollResults(pollId: string, options: Array<{ id: string; text: string; votes: number }>) {
  if (!ioRef) return;
  // Broadcast to poll room (more efficient) or all clients (challenge requirement)
  ioRef.to(`poll:${pollId}`).emit('poll:results', { pollId, options });
}


