'use strict';

// define the packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

//configs
app.use(cors());




app.listen(PORT, console.log(`we are up on ${PORT}`));
