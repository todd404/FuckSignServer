var MongoClient = require('mongodb').MongoClient
var url = "mongodb://localhost"
var mongo;

MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    mongo = db;

    let dbo = db.db("fksign");
    console.log(dbo.collection("data").find({
        "_id": ObjectId("607f98048f4c06c5a6561c6b")
    }));
})