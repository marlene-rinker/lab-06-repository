'use strict';
const superagent = require('superagent');

function Trail(obj) {
  this.name = obj.name;
  this.location = obj.location;
  this.length = obj.length;
  this.stars = obj.stars;
  this.star_votes = obj.starVotes;
  this.summary = obj.summary;
  this.trail_url = obj.url;
  this.condition_date = obj.conditionDate.split(' ')[0];
  this.condition_time = obj.conditionDate.split(' ')[1];
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
    .then(resultFromSuper => getTrailsFromApi(resultFromSuper, res))
    .catch(error => {
      console.log(error);
      res.send(error).status(500);
    });
}

function getTrailsFromApi(resultFromSuper, res){
  let trailData = resultFromSuper.body.trails;
  let result = trailData.map(obj =>{
    let resultTrail = new Trail(obj);
    return resultTrail;
  })
  res.send(result);
}

module.exports = getTrails;
