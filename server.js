/* eslint-disable no-trailing-spaces */
'use strict';

// define the packages
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

//configs
app.use(cors());



app.get('/location', getLocation);
app.get('/weather', getWeather);


function getLocation (req, res) {
  const cityToFind = req.query.city;
  const urlOfApi = 'https://us1.locationiq.com/v1/search.php';

  const queryParameters = { 
    q:cityToFind,
    key: process.env.GEOCODE_API_KEY,
    format: 'json'
  };

  superagent.get(urlOfApi)
    .query(queryParameters)
    .then(resultFromLocationApi =>{
      let resultLocation = new Location(resultFromLocationApi.body[0]);
      console.log(resultLocation);
      res.send(resultLocation);
    })
    .catch(error => {
      console.log(error);
      res.send(error).status(500);
    });  
}



function getWeather (req, res) {
  const weatherData = require('./data/weather.json');
  const theWeather = [];
  let weatherStats = weatherData.data;
  weatherStats.map(obj =>{
    let resultWeather = new Weather(obj);
    theWeather.push(resultWeather);
  });
  res.send(theWeather);
}

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
