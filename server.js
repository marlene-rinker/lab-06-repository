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

app.get('/weather', (req, res) => {
  const weatherData = require('./data/weather.json');
  const theWeather = [];
  let weatherStats = weatherData.data;
  // console.log(weatherData.data);
  weatherStats.forEach(obj => {
    let resultWeather = new Weather (obj);
    console.log(resultWeather);
  });



});

function Location(obj) {
  this.search_query = obj.display_name;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

function Weather(obj) {
  this.forecast = obj.forecast;
  this.time = obj.time;
}

app.listen(PORT, console.log(`we are up on ${PORT}`));
