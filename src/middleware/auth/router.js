'use strict';

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Users } = require('./models');
// const base64 = require('base-64');
const basicAuth = require('./middleware/');

router.post('/signup', async (request, response, next) => {
  try {
    request.body.password = await bcrypt.hash(request.body.password, 10);
    const record = await Users.create(request.body);
    response.status(200).json(record);
  } catch (error) {
    response.status(403).send('Error Creating User');
  }
});



router.post('/signin', basicAuth, async (request, response, next) => {

  try {
    response.status(200).json(user);

  } catch (error) {
    next('Invalid Login. message: ', error.message); }

});

module.exports = router;