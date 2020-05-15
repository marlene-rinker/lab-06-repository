'use strict';

const pg = require('pg');
const superagent = require('superagent');

const client = new pg.Client(process.env.DATABASE_URL);
client.on('error', console.error);
client.connect();

function Location(obj, search_query) {
  this.search_query = search_query;
  this.formatted_query = obj.display_name;
  this.latitude = obj.lat;
  this.longitude = obj.lon;
}

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
          .then(resultFromLocationApi => getLocationApi(resultFromLocationApi, cityToFind, res))
          .catch(error => {
            console.log(error);
            res.send(error).status(500);
          });
      }
    })
}

function getLocationApi (resultFromLocationApi, cityToFind, res){
  const resultLocation = new Location(resultFromLocationApi.body[0], cityToFind);
  const sqlQuery = 'INSERT INTO locations (latitude, search_query, longitude, formatted_query) VALUES ($1, $2, $3, $4)';
  const sqlValues = [resultLocation.latitude, resultLocation.search_query, resultLocation.longitude, resultLocation.formatted_query];
  client.query(sqlQuery, sqlValues)
  res.send(resultLocation);
}

module.exports = getLocation;
