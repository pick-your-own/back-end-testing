'use strict';

require('dotenv').config({ path: '../../.env' });
const io = require('socket.io-client');
const inquirer = require('inquirer');
const mongoose = require('mongoose');
const socket = io('http://localhost:3001');
const { eventPool } = require('../../src/eventPool');
const { User } = require('../../src/models/User');
const readline = require('readline');

console.log('YO');

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => console.error('MongoDB connection error:', error));

let username = '';

socket.on(eventPool.GAME_INQ, () => {

  inquirer.prompt({
    name: 'username',
    type: 'input',
    message: 'Log in with username:',
  })
    .then((answer) => {
      const enteredUsername = answer.username;
      // Check if username exists in the database
      User.findOne({ name: enteredUsername }).exec()
        .then((user) => {
          if (user) {
            inquirer.prompt({
              name: 'password',
              type: 'password',
              message: 'Enter your password:',
            })
              .then((answer) => {
                const enteredPassword = answer.password;
                // Compare the entered password with the password in the database
                if (enteredPassword === user.password) {
                  username = user.name;
                  socket.emit(eventPool.JOIN);
                } else {
                  console.log('Incorrect password');
                }
              });
          } else {
            console.log('Username not found');
            inquirer.prompt([
              {
                name: 'signupUsername',
                type: 'input',
                message: 'Create a username:',
              },
              {
                name: 'signupPassword',
                type: 'password',
                message: 'New password',
              },
            ])
              .then((answer) => {
                const newUsername = answer.signupUsername;
                const newPassword = answer.signupPassword;
                // Create a new user in the database
                const newUser = new User({ name: newUsername, password: newPassword });
                newUser.save()
                  .then(() => {
                    console.log('User created');
                    socket.emit('addUser', newUser);
                  })
                  .catch((error) => {
                    console.error('Error creating user:', error);
                  });
              });
          }
        })
        .catch((error) => {
          console.error('Error querying user:', error);
        });
    });
});

socket.on(eventPool.ROOM_MENU, () => {
  inquirer.prompt([
    {
      name: 'menuChoice',
      type: 'rawlist',
      message: 'Welcome to Dungeon Hopper\nChoose an option:',
      choices: [
        { name: 'Chat', value: 1 },
        { name: 'Play with friends', value: 2 },
        { name: 'Play alone', value: 3 },
        { name: 'Play with randoms', value: 4 },
      ],
    },
  ])
    .then((answer) => {
      const selectedOption = answer.menuChoice;
      switch (selectedOption) {
      case 1:
        console.log('Selected: Chat');
        socket.emit(eventPool.CHAT_JOINED, 'Chat');
        break;
      case 2:
        console.log('Selected: Play with friends');
        socket.emit(eventPool.CHAT_JOINED, 'joinFriends');
        break;
      case 3:
        console.log('Selected: Play alone');
        socket.emit(eventPool.CHAT_JOINED, socket.id);
        break;
      case 4:
        console.log('Selected: Play with randoms');
        socket.emit(eventPool.CHAT_JOINED, 'joinRandoms');
        break;
      default:
        console.log('Invalid option');
        break;
      }
    });
});

socket.on(eventPool.CHAT_MESSAGE, () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const sendMessage = () => {
    rl.question('Enter message (or type "exit" to quit): ', (message) => {
      // console.log(message);
      if (message.toLowerCase() === 'exit') {
        rl.close();
        socket.emit(eventPool.JOIN);
        return;
      }
      socket.emit(eventPool.SEND_MESSAGE, { sender: username, message });  // Emit the message to all clients
      sendMessage();
    });
  };

  sendMessage();
});

socket.on(eventPool.SEND_MESSAGE, (data) => {
  const { sender, message } = data;
  const formattedMessage = `${colorGreenLight}${sender.padStart(70)}:${colorReset} ${colorCyan}${message}`;
  console.log(formattedMessage);
  socket.emit(eventPool.CHAT_MESSAGE, { sender, message });  // Broadcast the message to all clients except the sender
});

socket.on(eventPool.CHAT_JOINED, (payload) => {
  console.log(payload);
});

socket.on(eventPool.CLOSE, () => {
  process.exit(0);
});

const colorReset = '\x1b[0m';
const colorCyan = '\x1b[36m';
const colorGreenLight = '\x1b[92m';
