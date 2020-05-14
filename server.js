/* eslint-disable no-trailing-spaces */
'use strict';

// define the packages
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const app = express();

//configs
app.use(cors());

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();



app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/trails', getTrails);


function getLocation (req, res) {
  const cityToFind = req.query.city;
  const urlOfApi = 'https://us1.locationiq.com/v1/search.php';

  const queryParameters = { 
    q:cityToFind,
    key: process.env.GEOCODE_API_KEY,
    format: 'json'
  };

  const sqlQuery = 'SELECT * FROM locations WHERE search_query=$1';
  const sqlValues =[cityToFind];
  client.query(sqlQuery, sqlValues)
    .then(resultFromSql => {

      if(resultFromSql.rowCount >0){
        res.send(resultFromSql.rows[0]);
      }else {
        superagent.get(urlOfApi)
          .query(queryParameters)
          .then(resultFromLocationApi =>{
            const resultLocation = new Location(resultFromLocationApi.body[0], cityToFind);
            const sqlQuery = 'INSERT INTO locations (latitude, search_query, longitude, formatted_query) VALUES ($1, $2, $3, $4)';
            const sqlValues = [resultLocation.latitude, resultLocation.search_query, resultLocation.longitude, resultLocation.formatted_query];
            client.query(sqlQuery, sqlValues)
            res.send(resultLocation);
          })
          .catch(error => {
            console.log(error);
            res.send(error).status(500);
          });  
      }
    })
}



function getWeather (req, res) {

  const urlOfApi = 'https://api.weatherbit.io/v2.0/forecast/daily';
  const queryForSuper = {
    lat: req.query.latitude,
    lon: req.query.longitude,
    key: process.env.WEATHER_API_KEY
  };


  superagent.get(urlOfApi)
    .query(queryForSuper)
    .then(resultFromSuper => {
      let weatherStats = resultFromSuper.body.data;
      let result = weatherStats.map(obj =>{
        let resultWeather = new Weather(obj);
        return resultWeather;
      })
      res.send(result);
    })
    .catch(error => {
      console.log(error);
      res.send(error).status(500); 
    });  
}

function getTrails (req, res) {

  const urlOfApi = 'https://www.hikingproject.com/data/get-trails';
  const queryForSuper = {
    lat: req.query.latitude,
    lon: req.query.longitude,
    key: process.env.TRAIL_API_KEY
  };


  superagent.get(urlOfApi)
    .query(queryForSuper)
    .then(resultFromSuper => {
      let trailData = resultFromSuper.body.trails;
      let result = trailData.map(obj =>{
        let resultTrail = new Trail(obj);
        return resultTrail;
      })
      // console.log(resultFromSuper.body.trails);
      console.log(result);
      res.send(result);
    })
    .catch(error => {
      console.log(error);
      res.send(error).status(500); 
    });  
}

function Location(obj, search_query) {
  this.search_query = search_query;
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


function Trail(obj) {
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.conditions = obj.conditionDetails;
  let tDate = obj.conditionDate;
  this.condition_date = tDate.split(/\s(.+)/)[0];
  this.condition_time = tDate.split(/\s(.+)/)[1];
}

app.listen(PORT, console.log(`we are up on ${PORT}`));
