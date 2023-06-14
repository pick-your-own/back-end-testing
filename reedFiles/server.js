'use strict';

require('dotenv').config();
const axios = require('axios');
const { startGame } = require('./redline.js');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const colors = require('colors');
const { UserQueue } = require('./src/lib/UserQueue');
const { CharacterQueue } = require('./src/lib/CharacterQueue');
const { eventPool } = require('./eventPool');
const User = require('./src/models/User');
const Character = require('./src/models/Character');
const characterController = require('./src/controllers/characterController');
const userController = require('./src/controllers/userController');
const jwt = require('jsonwebtoken');

// const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/chatApp';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const io = new Server(parseInt(process.env.PORT), {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

let userQueue = new UserQueue();
let characterQueue = new CharacterQueue();

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error));

io.on('connection', (socket) => {
  console.log(
    colors.green('CLIENT CONNECTED TO SERVER: ') + colors.yellow(socket.id),
  );

  socket.emit(eventPool.USER_CHECK_ACCOUNT);

  socket.on(eventPool.USER_CHECK_ACCOUNT_RESPONSE, (hasAccount) => {
    socket.emit(
      hasAccount ? eventPool.USER_LOGIN : eventPool.USER_CREATE_ACCOUNT,
    );
  });

  socket.on(
    eventPool.USER_CREATE_ACCOUNT_RESPONSE,
    async (newUsername, newPassword, newEmail) => {
      if (!newUsername || !newPassword || !newEmail) {
        socket.emit('account_creation_cancelled', {
          message: 'Account creation cancelled.',
        });
        return;
      }

      try {
        const existingUser = await User.findOne({ username: newUsername });
        if (existingUser) {
          socket.emit('account_creation_failed', {
            message: 'Username is already taken',
          });
          return;
        }

        await userController.register(
          {
            body: {
              username: newUsername,
              password: newPassword,
              email: newEmail,
            },
          },
          {
            status: (statusCode) => ({
              json: (responseBody) => {
                if (statusCode === 201) {
                  const token = responseBody.token;
                  const user = { newUsername, token };
                  socket.user = user;

                  socket.emit(eventPool.USER_AUTHENTICATE_SUCCESS, { user });
                  socket.emit('account_creation_success', {
                    message: 'Account created successfully!',
                  });
                } else {
                  socket.emit('account_creation_failed', {
                    message: responseBody.message,
                  });
                }
              },
            }),
          },
        );
      } catch (error) {
        console.error('Error creating user:', error);
        socket.emit('account_creation_failed', {
          message: 'Could not create user',
        });
      }
    },
  );

  socket.on(eventPool.USER_AUTHENTICATE, async (username, password) => {
    try {
      const user = await User.findOne({ username });
      if (!user) throw new Error('User not found');

      const isPasswordMatch = await userController.login(
        password,
        user.password,
        user,
      );
      if (!isPasswordMatch) throw new Error('Password is incorrect');

      socket.user = user;
      socket.emit(eventPool.USER_AUTHENTICATE_SUCCESS, { user });
    } catch (error) {
      console.error('Error authenticating user:', error);
      socket.emit(eventPool.USER_AUTHENTICATE_ERROR, {
        message: 'Authentication failed',
      });
    }
  });

  socket.on(eventPool.USER_LOGOUT, () => {
    socket.emit(eventPool.USER_LOGOUT_SUCCESS);
  });

  const handleUserAuthenticationSuccess = async (socket, user) => {
    const { username } = user;
    socket.join(username); // User joins a room with their username

    try {
      // Check if the user has a default character
      if (user.defaultCharacter) {
        const character = await Character.findById(user.defaultCharacter);
        if (character) {
          socket.emit(eventPool.CHARACTER_JOIN_SUCCESS, { character });
          startGame(socket, character._id.toString()); // Pass the character ID as a string
        } else {
          throw new Error('Default character not found');
        }
      } else {
        // User does not have a default character, prompt them to create one
        socket.emit(eventPool.CHARACTER_CREATE, username);
      }
    } catch (error) {
      console.error('Error joining default character:', error);
      socket.emit(eventPool.CHARACTER_JOIN_ERROR, {
        message: 'Could not join default character',
      });
    }
  };

  socket.on(eventPool.USER_AUTHENTICATE_SUCCESS, async ({ user }) => {
    handleUserAuthenticationSuccess(socket, user);
  });

  // User leaves the game
  socket.on(eventPool.USER_LEAVE, async (username) => {
    try {
      await userQueue.removeUser(username);
      delete socket.user; // Remove user association with the socket
      socket.emit(eventPool.USER_LEAVE, { username });
      io.emit(eventPool.USER_LEAVE, { username });
    } catch (error) {
      console.error('Error removing user:', error);
      socket.emit(eventPool.USER_LEAVE_ERROR, {
        message: 'Could not remove user',
      });
    }
    socket.leave(username); // User leaves their room
  });

  // User creates a character
  // User creates a character
  socket.on(eventPool.CHARACTER_CREATE, async (username, characterData) => {
    console.log(`${username} created a new character: ${characterData.name}`);
    try {
      // Save the character to the database
      const character = await Character.create(characterData);

      // Update the user's defaultCharacter field with the created character's ID
      const user = await User.findOneAndUpdate(
        { username },
        { defaultCharacter: character._id },
        { new: true },
      );

      console.log(`Character ${character.name} created`);
      socket.emit(eventPool.CHARACTER_CREATE_SUCCESS, { character });
      socket.user = user; // Update the user object stored in the socket

      io.emit(eventPool.CHARACTER_CREATE, character);
    } catch (error) {
      console.error('Error creating character:', error);
      socket.emit(eventPool.CHARACTER_CREATE_ERROR, {
        message: 'Could not create character',
      });
    }
  });
  // socket.on(eventPool.eventPool.CHARACTER_CREATE, async (username, characterData) => {
  //   console.log(`${username} created a new character: ${characterData.name}`);
  //   try {
  //     // Save the character to the database
  //     const character = await Character.create(characterData);
  //     const user = await User.findOneAndUpdate(
  //       { username },
  //       { defaultCharacter: character.name },
  //       { new: true },
  //     );
  //     console.log(`Character ${character.name} created`);
  //     socket.emit(eventPool.CHARACTER_CREATE_SUCCESS, { character });
  //     socket.user = user; // Update the user object stored in the socket
  
  //     io.emit(eventPool.CHARACTER_CREATE, character);
  //   } catch (error) {
  //     console.error('Error creating character:', error);
  //     socket.emit(eventPool.CHARACTER_CREATE_ERROR, { message: 'Could not create character' });
  //   }
  // });
  
  
  // socket.on(eventPool.eventPool.CHARACTER_JOIN, async (characterName) => {
  //   console.log(`${characterName} joined the game`);
  //   try {
  //     // Find the character in the database by its name
  //     const character = await Character.findOne({ name: characterName });
  //     if (character) {
  //       console.log('Character joined');
  //       socket.emit(eventPool.eventPool.CHARACTER_JOIN_SUCCESS, { character });
  //       startGame(socket, characterName); // Pass the character name
  //     } else {
  //       throw new Error('Character not found');
  //     }
  //   } catch (error) {
  //     console.error('Error joining character:', error);
  //     socket.emit(eventPool.eventPool.CHARACTER_JOIN_ERROR, { message: 'Could not join character' });
  //   }
  // });
  
  
  socket.on(eventPool.CHARACTER_JOIN, async (characterId) => {
    try {
      // Find the character in the database
      const character = await Character.findById(characterId);
      console.log('Character joined');
      socket.emit(eventPool.CHARACTER_JOIN_SUCCESS, { character });
      startGame(socket, characterId); // Call the startGame function and pass the socket and characterId
    } catch (error) {
      console.error('Error joining character:', error);
      socket.emit(eventPool.CHARACTER_JOIN_ERROR, {
        message: 'Could not join character',
      });
    }
  });

  // Character leaves the game
  socket.on(eventPool.CHARACTER_LEAVE, async (characterId) => {
    try {
      // Remove the character from the database
      await Character.findByIdAndRemove(characterId);
      socket.emit(eventPool.CHARACTER_LEAVE_SUCCESS, { characterId });
      io.emit(eventPool.CHARACTER_LEAVE, { characterId });
    } catch (error) {
      console.error('Error leaving character:', error);
      socket.emit(eventPool.CHARACTER_LEAVE_ERROR, {
        message: 'Could not leave character',
      });
    }
  });

  // Character attacks
  socket.on(eventPool.CHARACTER_ACTION_ATTACK, async (characterId) => {
    let character = characterQueue.read(characterId);
    let message = '';
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/engines/davinci-codex/completions',
        {
          prompt: `${character.name} attacks the dragon. What happens next?`,
          max_tokens: 100,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        },
      );

      message = response.data.choices[0].text;
    } catch (error) {
      console.error('Error interacting with OpenAI API:', error);
    }
    console.log(message);

    // Emit the event with the updated message
    io.emit(eventPool.CHARACTER_ACTION_ATTACK, { characterId, message });
  });

  // Character defends
  socket.on(eventPool.CHARACTER_ACTION_DEFEND, async (characterId) => {
    let character = characterQueue.read(characterId);
    // Character defends, increase defense temporarily

    // Generate storyline response with OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: `${character.name} defends. What happens next?`,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
    );
    const message = response.data.choices[0].text;
    console.log(message);

    io.emit(eventPool.CHARACTER_ACTION_DEFEND, { characterId, message });
  });

  // Character heals
  socket.on(eventPool.CHARACTER_ACTION_HEAL, async (characterId) => {
    let character = characterQueue.read(characterId);
    // Character heals, increase health

    // Generate storyline response with OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: `${character.name} heals. What happens next?`,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
    );
    const message = response.data.choices[0].text;
    console.log(message);

    io.emit(eventPool.CHARACTER_ACTION_HEAL, { characterId, message });
  });

  // Character flees
  socket.on(eventPool.CHARACTER_ACTION_FLEE, async (characterId) => {
    let character = characterQueue.read(characterId);
    // Character flees, set health to full and decrease experience

    // Generate storyline response with OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions',
      {
        prompt: `${character.name} flees. What happens next?`,
        max_tokens: 100,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      },
    );
    const message = response.data.choices[0].text;
    console.log(message);

    io.emit(eventPool.CHARACTER_ACTION_FLEE, { characterId, message });
  });

  // Character performs a custom action
  socket.on(
    eventPool.CHARACTER_ACTION_CUSTOM,
    async (characterId, customAction) => {
      let character = characterQueue.read(characterId);
      let message = '';
      try {
        const response = await axios.post(
          'https://api.openai.com/v1/engines/davinci-codex/completions',
          {
            prompt: `${character.name} ${customAction}. What happens next?`,
            max_tokens: 100,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            },
          },
        );

        message = response.data.choices[0].text;
        console.log(message);
      } catch (error) {
        console.error('Error interacting with OpenAI API:', error);
      }

      // Emit the event with the updated message
      io.emit(eventPool.CHARACTER_ACTION_CUSTOM, { characterId, message });
    },
  );

  socket.on('disconnect', () => {
    console.log(colors.yellow(`CLIENT DISCONNECTED FROM SERVER: ${socket.id}`));
    if (socket.user) {
      const { username } = socket.user;
      socket.leave(username); // User leaves their room on disconnect
      userQueue.removeUser(username);
      io.emit(eventPool.USER_LEAVE, { username });
    }
  });
});
