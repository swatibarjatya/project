var express = require('express');
var bodyParser = require('body-parser');
const cors = require('cors');

var fabricClient = require('./app.js');
var mongodb = require('./mongorepo.js');

var app = express();
app.use(bodyParser.json());

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use(function(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    next();
});

//Initialize and connect to the blockchain network
fabricClient.init();

//Connect to MongoDB
//mongodb.init();

app.get('/api/movies', async function (req, res) {
    var name = req.query.title;
    if(name){
        console.log('getting search movie');
        //let response = await fabricClient.QueryMovieByName(name);
        response = mongodb.queryMovieByName(name);
        console.log(response);

        res.type('json');
        res.send(JSON.parse(response));
    }
    else{
        console.log('getting all movies');
        //let response = await fabricClient.queryAllMovies();
        //console.log(JSON.parse(response)[0].Record);
        let movies = [];

        //await JSON.parse(response).map(movie => {
        //    movies.push(movie.Record);
        //});

        //call mongodb.queryAllMovies
        movies = await mongodb.queryAllMovies();
        console.log(movies);

        //res.setHeader("content-type", "application/json");
        res.type('json');
        res.send(movies);
        //res.send(JSON.parse(response));

    }
    

});

//create express route to save movie
app.post('/api/movies', async function (req, res) {
    console.log('saving movie');
    //read movie title, description, language from request body
    var movieNumber= req.body.movieNumber;
    var title = req.body.title;
    var durationInMin = req.body.durationInMin;
    var language = req.body.language;
    var releaseDate = req.body.releaseDate;
    var country = req.body.country;
    var genre = req.body.genre;

    //create json movie object
    var movie = {
        movieNumber: movieNumber,
        title: title,
        durationInMin: durationInMin,
        language: language,
        releaseDate: releaseDate,
        country: country,
        genre: genre
    };
   
    console.log("Saving movie in the blockchain network");
    //call fabricClient.createMovie and pass the movie object
    let fabResponse = await fabricClient.CreateMovie(movieNumber, title, durationInMin, language, releaseDate, country, genre);
    console.log(fabResponse);
    //let dbResponse1 = await mongodb.queryAllMovies();
    //console.log("Saving movie in the database MongoDB");
    //call mongodb.saveMovie and pass the movie object
    let dbResponse = await mongodb.saveMovie(movie);
    console.log(dbResponse);

    
    //send response back to the client
    res.type('json');
    res.status(200).send(dbResponse);
});




app.listen(8080, 'localhost');
console.log('Running on http://localhost:8080');