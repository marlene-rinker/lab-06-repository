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

//handlers
const getLocation = require('./modules/location.js');
const getWeather = require('./modules/weather.js');
const getTrails = require('./modules/trails.js');
const getMovies = require('./modules/movies.js');
const getRestaurants = require('./modules/restaurants.js');

// routes
app.get('/location', getLocation);
app.get('/weather', getWeather);
app.get('/trails', getTrails);
app.get('/movies', getMovies);
app.get('/yelp', getRestaurants);

app.listen(PORT, console.log(`we are up on ${PORT}`));
