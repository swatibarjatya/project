var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/?directConnection=true&ssl=false";
//var url = "mongodb://localhost:27017/ReelDeal";
var dbo;

exports.init = function() {
    console.log("Connecting to MongoDB");
   /* MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        console.log("Connecting to database!");
        dbo = db.db("ReelDeal");
        console.log("Database connected!");
    });
}*/
MongoClient.connect(url, function(err, client) {
    console.log("Connected successfully to server");
  
    const db = client.db('ReelDeal');
  
    // Perform database operations
    db.collection('documents').insertOne({
        movieNumber: 6,
        title: "happy",
        durationInMin: 2.14,
        language: "snaskrit",
        releaseDate: "12-2-23",
        country: "india",
        genre: "comedy"
    }, function(err, result) {
      console.log("Inserted a document into the collection");
      //client.close();
    });
  });
}
exports.queryAllMovies = async function() {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;

        console.log("Connecting to database!");
        dbo = db.db("ReelDeal");
        console.log("Database connected!");

        let response = dbo.collection("movies").find({}).toArray();
        return response;
    });
   // let response = await dbo.collection("movies").find({}).toArray();
   // return response;
}

exports.QueryMovieByName = async function(name) {
    let response = await dbo.collection("movies").find({title:name}).toArray();
    return response;
}

exports.saveMovie = async function(movie) {
    console.log("Connecting to MongoDB");
    try{
    MongoClient.connect(url, function(err, client) {
        console.log("Connecting to database!");
        if (err) {throw err; console.log(err);}
        var dbo = client.db("ReelDeal");
        dbo.collection("movies").insertOne(movie, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          client.close();
        });
      });
    }catch(err){
        console.log(err);
    }
    //let response = await dbo.collection("movies").insertOne(movie);
    //return response;
}