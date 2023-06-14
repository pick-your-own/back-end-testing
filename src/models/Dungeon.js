'use strict';

const mongoose = require('mongoose');

const dungeonSchema = new mongoose.Schema({
  // gs = gearscore
  gs: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  monsters: {
    type: Array,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
});

const Dungeon = mongoose.model('Dungeon', dungeonSchema);

module.exports = {
  Dungeon,
};