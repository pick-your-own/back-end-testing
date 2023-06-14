'use strict';

const express = require('express');
const router = express.Router();
const { Loot } = require('../models/loot');

router.get('/loot', async (req, res, next) => {
  try {
    let allLoot = await Loot.find();

    res.status(200).send(allLoot);
  } catch (error) {
    next(error);
  }
});

router.post('/loot', async (req, res, next) => {
  try {
    let newItem = await Loot.create(req.body);

    res.status(200).send(newItem);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
