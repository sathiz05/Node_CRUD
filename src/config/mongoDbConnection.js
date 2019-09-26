var MongoClient = require('mongodb').MongoClient;


var url = "mongodb://localhost/config";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    console.log("Database created!");
    var dbase = db.db('mongodb');
    dbase.createCollection("users", function (err, res) {
        if (err) throw err;
        console.log("Collection is created!");
        db.close();
    });
});


module.exports = MongoClient;