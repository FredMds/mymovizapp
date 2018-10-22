var express = require('express');
var request = require('request');
var mongoose = require('mongoose');
var router = express.Router();

var options = { server: { socketOptions: {connectTimeoutMS: 30000 } }};
mongoose.connect('mongodb://FredMds:azerty01@ds227570.mlab.com:27570/mymoviesapp', options , function(err) {
  console.log(err);
});

var movieSchema = mongoose.Schema({
  poster_path:String,
  overview:String,
  title:String,
  idMovieDB:Number,
});
var MovieModel = mongoose.model("movie", movieSchema);

/* GET home page. */
router.get('/', function(req, res, next) {
   res.json({ message: 'route/' });
});

router.get('/movie', function(req, res, next) {
  request("https://api.themoviedb.org/3/discover/movie?api_key=733abf41c3f78b3fc77edce583b33e92&language=fr-FR&sort_by=popularity.desc&include_adult=true&include_video=false&page=20", function(error, response, body) {
    body = JSON.parse(body);
    res.json( body );
});
});

router.get('/mymovies', function(req, res, next) {
  MovieModel.find(function(err, movies) {
    res.json({movies});
  });
});

router.post('/mymovies', function(req, res, next) {
  var movie = new MovieModel({
    poster_path: req.body.poster_path,
    overview:req.body.overview,
    title:req.body.title,
    idMovieDB:req.body.idMovieDB
  });
console.log("movie envoyé", {movie});

    movie.save(function(error, movie){
      MovieModel.find(function(err, movies) {
        console.log(movies);
        res.json({ movies });
      });
    });
  console.log(movie);
});

router.delete('/mymovies/:idMovieDB', function(req, res, next) {
  MovieModel.remove({
    idMovieDB: req.params.idMovieDB
  },function(error) {
    MovieModel.find(function(err, movies) {
      console.log(movies);
      res.json({ movies });
    });
});
});
module.exports = router;
