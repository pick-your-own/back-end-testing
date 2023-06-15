'use strict';

const mongoose = require('mongoose');

const lootSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  rarity: {
    type: String,
    required: true,
  },
  gs: {
    type: Number,
    required: true,
  },
});

const Loot = mongoose.model('loot', lootSchema);

module.exports = {
  Loot,
};