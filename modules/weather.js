'use strict';
const superagent = require('superagent');

function Weather(obj) {
  this.forecast = obj.weather.description;
  this.time = new Date(obj.ts * 1000).toDateString();
}

function getWeather (req, res) {
  const urlOfApi = 'https://api.weatherbit.io/v2.0/forecast/daily';
  const queryForSuper = {
    lat: req.query.latitude,
    lon: req.query.longitude,
    key: process.env.WEATHER_API_KEY,
    days: 7
  };

  superagent.get(urlOfApi)
    .query(queryForSuper)
    .then(resultFromSuper => getWeatherFromApi(resultFromSuper, res))
    .catch(error => {
      console.log(error);
      res.send(error).status(500);
    });
}

function getWeatherFromApi(resultFromSuper, res){
  let weatherStats = resultFromSuper.body.data;
  let result = weatherStats.map(obj =>{
    let resultWeather = new Weather(obj);
    return resultWeather;
  })
  res.send(result);

}

module.exports = getWeather;
