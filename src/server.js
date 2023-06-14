'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require('socket.io');
// const { User, Character } = require('./models');
const { eventPool } = require('./eventPool');
// const { characterController, userController } = require('./controllers');

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

const connectedClients = new Map();// new code

// create / allow for connections to server
io.on('connection', (socket) => {
  connectedClients.set(socket.id, socket); // new code
  socket.emit(eventPool.GAME_INQ);

  // notification for player join room
  socket.on(eventPool.JOIN, () => {
    console.log('player logged in');
    socket.emit(eventPool.ROOM_MENU);
  });

  socket.on(eventPool.CHAT_JOINED, (room) => {
    socket.join(room);
    socket.emit(eventPool.CHAT_MESSAGE, `${socket.id} has joined chat`);
    console.log(room);
    console.log('++++++++', socket.rooms);
    
  });

  // notification for chat message
  socket.on(eventPool.SEND_MESSAGE, (message) => {
    // console.log(`Received message from ${socket.id}: ${message}`);
    // broadcasts chat to everyone
    io.emit(eventPool.SEND_MESSAGE,  message);
  });
  
  // // User creates a character
  // socket.on(eventPool.CHARACTER_CREATE, async (username, characterData) => {
  //   console.log(`${username} created a new character: ${characterData.name}`);
  //   try {
  //     // Save the character to the database
  //     const character = await Character.create(characterData);

  //     // Update the user's defaultCharacter field with the created character's ID
  //     const user = await User.findOneAndUpdate(
  //       { username },
  //       { defaultCharacter: character._id },
  //       { new: true },
  //     );

  //     console.log(`Character ${character.name} created`);
  //     socket.emit(eventPool.CHARACTER_CREATE_SUCCESS, { character });
  //     socket.user = user; // Update the user object stored in the socket

  //     io.emit(eventPool.CHARACTER_CREATE, character);
  //   } catch (error) {
  //     console.error('Error creating character:', error);
  //     socket.emit(eventPool.CHARACTER_CREATE_ERROR, {
  //       message: 'Could not create character',
  //     });
  //   }
  // });
  // socket.on(eventPool.CHARACTER_JOIN, async (characterId) => {
  //   try {
  //     // Find the character in the database
  //     const character = await Character.findById(characterId);
  //     console.log('Character joined');
  //     socket.emit(eventPool.CHARACTER_JOIN_SUCCESS, { character });
  //     startGame(socket, characterId); // Call the startGame function and pass the socket and characterId
  //   } catch (error) {
  //     console.error('Error joining character:', error);
  //     socket.emit(eventPool.CHARACTER_JOIN_ERROR, {
  //       message: 'Could not join character',
  //     });
  //   }
  // });
  // // Character attacks
  // socket.on(eventPool.CHARACTER_ACTION_ATTACK, async (characterId) => {
  //   let character = characterQueue.read(characterId);
  //   let message = '';
  //   try {
  //     const response = await axios.post(
  //       'https://api.openai.com/v1/engines/davinci-codex/completions',
  //       {
  //         prompt: `${character.name} attacks the dragon. What happens next?`,
  //         max_tokens: 100,
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //         },
  //       },
  //     );

  //     message = response.data.choices[0].text;
  //   } catch (error) {
  //     console.error('Error interacting with OpenAI API:', error);
  //   }
  //   console.log(message);

  //   // Emit the event with the updated message
  //   io.emit(eventPool.CHARACTER_ACTION_ATTACK, { characterId, message });
  // });

  // // Character defends
  // socket.on(eventPool.CHARACTER_ACTION_DEFEND, async (characterId) => {
  //   let character = characterQueue.read(characterId);
  //   // Character defends, increase defense temporarily

  //   // Generate storyline response with OpenAI API
  //   const response = await axios.post(
  //     'https://api.openai.com/v1/engines/davinci-codex/completions',
  //     {
  //       prompt: `${character.name} defends. What happens next?`,
  //       max_tokens: 100,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //       },
  //     },
  //   );
  //   const message = response.data.choices[0].text;
  //   console.log(message);

  //   io.emit(eventPool.CHARACTER_ACTION_DEFEND, { characterId, message });
  // });

  // // Character heals
  // socket.on(eventPool.CHARACTER_ACTION_HEAL, async (characterId) => {
  //   let character = characterQueue.read(characterId);
  //   // Character heals, increase health

  //   // Generate storyline response with OpenAI API
  //   const response = await axios.post(
  //     'https://api.openai.com/v1/engines/davinci-codex/completions',
  //     {
  //       prompt: `${character.name} heals. What happens next?`,
  //       max_tokens: 100,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //       },
  //     },
  //   );
  //   const message = response.data.choices[0].text;
  //   console.log(message);

  //   io.emit(eventPool.CHARACTER_ACTION_HEAL, { characterId, message });
  // });

  // // Character flees
  // socket.on(eventPool.CHARACTER_ACTION_FLEE, async (characterId) => {
  //   let character = characterQueue.read(characterId);
  //   // Character flees, set health to full and decrease experience

  //   // Generate storyline response with OpenAI API
  //   const response = await axios.post(
  //     'https://api.openai.com/v1/engines/davinci-codex/completions',
  //     {
  //       prompt: `${character.name} flees. What happens next?`,
  //       max_tokens: 100,
  //     },
  //     {
  //       headers: {
  //         Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //       },
  //     },
  //   );
  //   const message = response.data.choices[0].text;
  //   console.log(message);

  //   io.emit(eventPool.CHARACTER_ACTION_FLEE, { characterId, message });
  // });

  // // Character performs a custom action
  // socket.on(
  //   eventPool.CHARACTER_ACTION_CUSTOM,
  //   async (characterId, customAction) => {
  //     let character = characterQueue.read(characterId);
  //     let message = '';
  //     try {
  //       const response = await axios.post(
  //         'https://api.openai.com/v1/engines/davinci-codex/completions',
  //         {
  //           prompt: `${character.name} ${customAction}. What happens next?`,
  //           max_tokens: 100,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
  //           },
  //         },
  //       );

  //       message = response.data.choices[0].text;
  //       console.log(message);
  //     } catch (error) {
  //       console.error('Error interacting with OpenAI API:', error);
  //     }

  //     // Emit the event with the updated message
  //     io.emit(eventPool.CHARACTER_ACTION_CUSTOM, { characterId, message });
  //   },
  // );
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
