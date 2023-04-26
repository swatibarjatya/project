const mongoose = require("mongoose");


console.log('Connecting to MongoDB');
mongoose.connect('mongodb://127.0.0.1:27017/ReelDeal',
  {
    useNewUrlParser: true,
    //useFindAndModify: false,
    useUnifiedTopology: true
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
  let movies = db.collection("movies").find({}).toArray();
  console.log(movies);
});

const schema = new mongoose.Schema({
    title: String
  });

const MoviesModel = mongoose.model('Movies', schema);

exports.queryAllMovies = function() {
    console.log("Connecting to MongoDB");
    //let response = await db.collection("movies").find({}).toArray();
    
    let response = MoviesModel.find({});
    
    console.log(response);
    return response;
}

exports.queryMovieByName = function(name) {
    let response = MoviesModel.find({title:name});
    console.log(response);
    return response;
}

exports.saveMovie = function(movie) {
    console.log("Connecting to MongoDB");
    MoviesModel.create(movie);
    return movie;
}