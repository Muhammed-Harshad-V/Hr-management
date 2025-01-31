let io;

const initSocket = (server) => {
  if (io) {
    console.log("Socket.io already initialized");
    return; // Prevent multiple initializations
  }

  io = require('socket.io')(server); // Initialize socket.io with the server instance
  console.log("Socket.io initialized");

  // Handle connections here
  io.on('connection', (socket) => {
    console.log('A user connected via WebSocket');
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};

const getIo = () => {
  if (!io) {
    throw new Error("Socket.io is not initialized. Please call initSocket() first.");
  }
  return io; // Return the socket.io instance
};

module.exports = { initSocket, getIo };
