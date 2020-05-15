'use strict';

const superagent = require('superagent');

function Restaurant(obj){
  this.name = obj.name;
  this.image_url = obj.image_url;
  this.price = obj.price;
  this.rating = obj.rating;
  this.url = obj.url;
}

function getRestaurants (req, res) {
  const urlOfApi = 'https://api.yelp.com/v3/businesses/search';
  const yelpQuery = req.query.search_query;
  const queryForSuper = {
    location: yelpQuery
  };

  superagent.get(urlOfApi)
    .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`)
    .query(queryForSuper)
    .then(resultFromSuper => getRestaurantsFromApi(resultFromSuper, res))
    .catch(error => {
      console.log(error);
      res.send(error).status(500);
    });
}

function getRestaurantsFromApi(resultFromSuper, res){
  let restData = resultFromSuper.body.businesses;
  let result = restData.map(obj =>{
    let resultRest = new Restaurant(obj);
    return resultRest;
  })
  res.send(result);
}

module.exports = getRestaurants;
