'use strict';

// define the packages
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

//configs
app.use(cors());



app.get('/location', (req, res) => {
  const locationData = require('./data/location.json');
  let resultLocation = new Location(locationData[0]);
  res.send(resultLocation);

});

function Location(obj) {
  this.search_query = obj.display_name;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

app.listen(PORT, console.log(`we are up on ${PORT}`));
