'use strict';

const express = require('express');
const router = express.Router();
const { Dungeon } = require('../models/dungeon');

router.get('/dungeons', async (req, res, next) => {
  try {
    let dungeons = await Dungeon.find();

    res.status(200).send(dungeons);
  } catch (error) {
    next(error);
  }
});

router.post('/user', async(req, res, next) => {
  try {
    let newDungeon = await Dungeon.create(req.body);

    res.status(200).send(newDungeon);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
});

module.exports = router;
