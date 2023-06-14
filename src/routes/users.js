'use strict';

const express = require('express');
const router = express.Router();
const { User } = require('../models/User');

router.get('/users', async (req, res, next) => {
  try {
    let users = await User.find();

    res.status(200).send(users);
  } catch (error) {
    next(error);
  }
});

router.post('/user', async(req, res, next) => {
  try {
    let newUser = await User.create(req.body);

    res.status(200).send(newUser);
  } catch (error) {
    console.error(error.message);
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    res.status(200).send(req.user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;