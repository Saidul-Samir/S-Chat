const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
  },
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

let users = {};

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('new-user-joined', (name) => {
    users[socket.id] = name;
    socket.broadcast.emit('user-joined', name);
    console.log(`${name} joined the chat`);
  });

  socket.on('send', (message) => {
    socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
  });

  socket.on('disconnect', () => {
    socket.broadcast.emit('user-left', users[socket.id]);
    delete users[socket.id];
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
