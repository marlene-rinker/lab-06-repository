'use strict';
const superagent = require('superagent');

function Movie(obj){
  this.title = obj.title;
  this.overview = obj.overview;
  this.average_votes = obj.vote_average;
  this.total_votes = obj.vote_count;
  this.image_url = 'https://image.tmdb.org/t/p/w500'+obj.poster_path;
  this.popularity = obj.popularity;
  this.released_on = obj.release_date;
}

function getMovies (req, res) {
  const urlOfApi = 'https://api.themoviedb.org/3/search/movie';
  const queryForSuper = {
    api_key: process.env.MOVIE_API_KEY,
    query: req.query.search_query
  };

  superagent.get(urlOfApi)
    .query(queryForSuper)
    .then(resultFromSuper => getMoviesFromAPI (resultFromSuper, res))
    .catch(error => {
      console.log(error);
      res.send(error).status(500);
    });
}

function getMoviesFromAPI (resultFromSuper, res){
  let movieData = resultFromSuper.body.results;
  let result = movieData.map(obj =>{
    let resultMovie = new Movie(obj);
    return resultMovie;
  })
  res.send(result);
}

module.exports = getMovies;
