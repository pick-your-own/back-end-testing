'use strict';

require('dotenv').config({ path: '../../.env' });
const io = require('socket.io-client');
const mongoose = require('mongoose');
const socket = io('http://localhost:3001');
const inquirer = require('inquirer');
const { eventPool } = require('../src/eventPool');
const { Dungeon } = require('../src/models/Dungeon');

console.log('RAWR');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async () => {
  console.log('Connected to Mongo');
  const dungeons = await Dungeon.find({});
  console.log(dungeons);
  const dungeon = dungeons[0];
  console.log(dungeon);
  const events = dungeon.events;
  console.log(events);
  const event = events[0];
  console.log(event);
  const eventObj = eventPool[event];
  console.log(eventObj);
  const eventInstance = new eventObj();
  console.log(eventInstance);
  const eventResult = await eventInstance.run();
  console.log(eventResult);
  process.exit();
});


socket.on(eventPool.DUNGEON_CREATE, () => {
  console.log('Dungeon Created');
});

socket.on(eventPool.DUNGEON_JOIN, () => {
  console.log('Dungeon Joined');
});

socket.on(eventPool.DUNGEON_START, () => {
  console.log('Dungeon Started');
});

socket.on(eventPool.DUNGEON_LEAVE, () => {
  console.log('Dungeon Left');
});



//? Text Based Dungeon Generator

// Function to generate a random encounter based on player's gear score and enemy level
function generateEncounter(playerGearScore, enemyLevel) {
  // Implement your logic here to generate an encounter based on playerGearScore and enemyLevel
  // You can use your own formulas or rules to determine the encounter difficulty, rewards, etc.

  // For example, you can generate a random encounter message
  const encounterMessage = `You encounter a level ${enemyLevel} enemy. Prepare for battle!`;

  // You can also generate rewards, experience points, etc., based on the encounter difficulty

  return {
    message: encounterMessage,
    // Include other properties as needed for the encounter, such as rewards, experience points, etc.
  };
}

// Function to handle the attack action
async function handleAttackAction(playerGearScore, enemyLevel) {
  // Implement your battle mechanics here based on playerGearScore and enemyLevel
  // Determine the outcome of the attack, calculate damage, update player/enemy health, etc.

  let playerHealth = 100;
  let enemyHealth = 100;

  // Calculate damage based on player gear score and enemy level
  const playerDamage = Math.floor(Math.random() * playerGearScore);
  const enemyDamage = Math.floor(Math.random() * enemyLevel);

  // Update player/enemy health, handle defeat/victory conditions, etc.
  playerHealth -= enemyDamage;
  enemyHealth -= playerDamage;
  
  console.log(`You dealt ${playerDamage} damage to the enemy.`);
  console.log(`The enemy dealt ${enemyDamage} damage to you.`);

  // Assuming the battle continues
  // Check defeat/victory conditions
  if (playerHealth <= 0) {
    console.log('You have been defeated. Game over.');
    // Implement game over logic here, such as resetting progress or ending the game
  } else if (enemyHealth <= 0) {
    console.log('Congratulations! You have defeated the enemy.');
    // Implement victory logic here, such as gaining rewards or progressing to the next level
    const loot = eventPool.CHARACTER_ACTION_PICKUP;

    // Process the loot event
    console.log(`You have received ${loot} from the enemy.`);
  } else {
    console.log(`Player Health: ${playerHealth}`);
    console.log(`Enemy Health: ${enemyHealth}`);
    // The battle continues since neither the player nor the enemy is defeated
    // You can continue the battle or provide more options to the player
  }
}

// Function to create a dungeon room and await encounters
async function createDungeonRoom(playerGearScore, roomLevel) {
  console.log('Welcome to the dungeon room!');

  let exitRoom = false; // Variable to control loop termination

  while (!exitRoom) {
    // Generate a random enemy level based on the room level
    const enemyLevel = roomLevel + Math.floor(Math.random() * 3);

    // Generate an encounter based on the player's gear score and the enemy level
    const encounter = generateEncounter(playerGearScore, enemyLevel);

    console.log(encounter.message);

    // Fetch the player's chosen action from the event pool
    const playerAction = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: Object.values(eventPool), // Use the event pool choices for the prompt
    });

    // Handle the player's chosen action
    if (playerAction.action === eventPool.CHARACTER_ACTION_ATTACK) {
      await handleAttackAction(playerGearScore, enemyLevel);
    } else if (playerAction.action === eventPool.CHARACTER_ACTION_DEFEND) {
      console.log('You defend against the enemy attack.');
    } else if (playerAction.action === eventPool.CHARACTER_ACTION_HEAL) {
      console.log('You heal yourself.');
    } else if (playerAction.action === eventPool.CHARACTER_ACTION_CUSTOM) {
      console.log('You perform a custom action.'); 
    } else if (playerAction.action === eventPool.CHARACTER_ACTION_FLEE) {
      console.log('You managed to escape from the dungeon room.');
      exitRoom = true;
    }
  }

  console.log('Exiting the dungeon room.');
}

//! Example usage
const playerGearScore = 100;
const roomLevel = 5;

createDungeonRoom(playerGearScore, roomLevel);

module.exports = { generateEncounter, createDungeonRoom, handleAttackAction };