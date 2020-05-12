/* eslint-disable no-trailing-spaces */
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
  weatherStats.map(obj =>{
    let resultWeather = new Weather(obj);
    theWeather.push(resultWeather);
  });
  res.send(theWeather);
});

function Location(obj) {
  this.search_query = obj.display_name;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}


function Weather(obj) {
  this.forecast = obj.weather.description;
  let xDate = Date.parse(obj.datetime);
  let dateTime = new Date(xDate);
  this.time = dateTime.toDateString();
}

app.listen(PORT, console.log(`we are up on ${PORT}`));
