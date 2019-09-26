var user_mongoDB_router = require('express').Router();
var MongoClient = require('../config/mongoDbConnection');
var ObjectId = require('mongodb').ObjectID;
var url = "mongodb://localhost/config";


user_mongoDB_router.get('/', (req, res) => {
    res.send('User Details With MongoDB Methods');
});

user_mongoDB_router.get('/Allusers', (req, res) => {
    console.log(`Mongodb Application.`);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbase = db.db('mongodb');
        dbase.collection("users").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            res.send(result);
            db.close();
        });
    });
});

//Retrieve User

user_mongoDB_router.post('/getUsersById', (req, res) => {
    // console.log(`=>${JSON.stringify(req.body)}`);
    let reqData = req.body;

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbase = db.db('mongodb');
        dbase.collection("users").find({ _id: ObjectId(reqData._id) }).toArray((err, result) => {
            if (err) throw err;
            console.log(result);
            res.send(result);
            db.close();
        });
    });


});

//Create User
user_mongoDB_router.post('/userCreate', (req, res) => {
    debugger;
    console.log(req.body);
    let reqData = req.body;
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbase = db.db('mongodb');
        dbase.collection('users').insertOne(reqData, (err, result) => {
            if (err) throw err;
            console.log(`Result =>${JSON.stringify(result)}`);
            res.format({
                json: () => {
                    res.status(200).send({
                        message: "success"
                    });
                }
            })
            db.close();
        })
    })
});

//Edit user Details
user_mongoDB_router.post('/userEdit', (req, res) => {
    console.log(req.body);
    let reqData = req.body;
    MongoClient.connect(url, (err, db) => {
        if (err) throw err;
        var dbase = db.db('mongodb');
        dbase.collection('users').updateOne({ "_id": ObjectId(reqData._id) }, { $set: { "firstname": reqData.firstname, lastname: reqData.lastname, emailid: reqData.emailid, phoneno: reqData.phoneno } }, (err, result) => {
            if (err) throw err;
            console.log(`Result =>${JSON.stringify(result)}`);
            res.format({
                json: () => {
                    res.status(200).send({
                        message: "success"
                    });
                }
            })
            db.close();
        })
    })



})

// Delete User
user_mongoDB_router.post('/userDelete', (req, res) => {
    console.log(req.body);
    let reqData = req.body;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbase = db.db('mongodb');

        dbase.collection("users").deleteOne({ "_id": ObjectId(reqData._id) }, (err, obj) => {
            if (err) throw err;
            console.log(obj.result.n + " record(s) deleted");
            res.format({
                json: () => {
                    res.status(200).send({
                        message: "success"
                    });
                }
            })
            db.close();
        });

    })
});


module.exports = user_mongoDB_router;