'use strict';

require('dotenv').config({ path: '../../.env' });
const io = require('socket.io-client');
const inquirer = require('inquirer');
const mongoose = require('mongoose');
const socket = io('http://localhost:3001');
const { eventPool } = require('../../src/eventPool');
const { Dungeon } = require('../../src/models/Dungeon');

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

// const dungeon = new Dungeon({
//   name: 'Test Dungeon',
//   events: ['testEvent'],
// });

// dungeon.save().then(() => {
//   console.log('Dungeon Saved');
//   process.exit();
// });

// const testEvent = new TestEvent();

// testEvent.run().then((result) => {
//   console.log(result);
//   process.exit();
// });



