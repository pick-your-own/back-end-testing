'use strict';

const io = require('socket.io-client');
const inquirer = require('inquirer');

const socket = io('http://localhost:3001');
console.log('YO');

socket.on('inq', () => {
  console.log('oi');
  inquirer.prompt({
    name: 'userName',
    type: 'input',
    message: 'Choose your difficulty!',
  })
    .then((answer) => {
      console.log(`You chose ${answer.userName}`);
      socket.emit('userJoin');
    });
});
