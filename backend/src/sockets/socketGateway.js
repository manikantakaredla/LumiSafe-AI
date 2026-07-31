import { Server } from 'socket.io';

let io;

export const initSocketGateway = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // For development
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket.IO] Client connected: ${socket.id}`);
    
    // Allow clients to join role-specific rooms
    socket.on('join_role', (role) => {
      const room = `role:${role.toLowerCase().replace(' ', '-')}`;
      socket.join(room);
      console.log(`[Socket.IO] Client ${socket.id} joined ${room}`);
    });

    socket.on('disconnect', () => {
      console.log(`[Socket.IO] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized!");
  return io;
};

// Helper to broadcast event to a specific room or universally
export const broadcastEvent = (event, payload, room = null) => {
  if (!io) return;
  if (room) {
    io.to(room).emit(event, payload);
  } else {
    io.emit(event, payload); // Broadcast to all
  }
};
