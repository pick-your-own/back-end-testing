'use strict';

require('dotenv').config();

const PORT = process.env.PORT;
const { start } = require('./src/server');

// app.use() = express;


try{
  start(PORT);    
}
catch(error){
  console.error(error);
}
