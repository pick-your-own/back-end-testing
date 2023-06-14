'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');


// io server singleton
const io = new Server(server);
const cors = require('cors');

const mongoose = require('mongoose');

const userRouter = require('./routes/users');
const lootRouter = require('./routes/loot');
const dungeonRouter = require('./routes/dungeons');

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));
// app.use(userRouter);

app.use(cors());
app.use(express.json());
app.use(lootRouter);
app.use(userRouter);
app.use(dungeonRouter);

// const rooms = new Map();

// create / allow for connections to server
io.on('connection', (socket) => {
  socket.emit('inq');

  // notification for player join room
  socket.on('userJoined', () => {
    console.log('User joined');
    socket.emit('menu');
  });

  socket.on('joinChat', (socket)=>{
    socket.join('room1');
    socket.to('room1').emit(`${socket.id} has joined the chat`);
  });

  socket.on('joinFriends', (socket)=>{
    socket.join('room2');
    socket.to('room1').emit(`${socket.id} has joined chat`);
  });

  socket.on('playAlone', (socket)=>{
    socket.join('room4');
    socket.to('room4').emit(`${socket.id} has joined chat`);
  });

  socket.on('joinRandoms', (socket)=>{
    socket.join('room5');
    socket.to('room5').emit(`${socket.id} has joined chat`);
  });

  // notification for chat message
  socket.on('chat message', (message) => {
    console.log(`Received message from ${socket.id}: ${message}`);
    // broadcasts chat to everyone
    socket.broadcast.emit('chat message', message);
  });
  // notification for player disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.onAny((event, payload) => {
    let timestamp = new Date(Date.now());
    // this logs everything
    console.log(event, timestamp, payload);
  });
});

const start = (PORT) => {
  server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
};

module.exports = {
  start,
  server,
};
