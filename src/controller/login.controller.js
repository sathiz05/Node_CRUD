
var loginRouter = require('express').Router();
var crypto = require('crypto'), algorithm = 'aes-256-ctr', password = 'RJ23edrf';
const fs = require("fs");
var Promise = require('promise');
var connection = require('../config/mysqlConnection');
var config = require('../config/token'); // get our config file
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


loginRouter.get('/', function (req, res) {
    res.send("Login service initiated...");
});

loginRouter.post('/signup', function (req, res) {

    // console.log(req.body);
    let reqData = req.body;

    //Calling the encrypt function and printing the encrypted content				
    var encryptPsw = encrypt(reqData.password);
    // console.log(encryptPsw);

    /* //calling the decrypt function and printing the decrypted content
    var d = decrypt("a3d2410a4999");
    console.log(d); */

    //console.log(`Fields =>${JSON.stringify(field)}`);
    retrieveValue(reqData.username, "").then((results) => {
        console.log(results.length);
        if (results.length > 0) {
            res.format({
                json: () => {
                    res.status(200).send({
                        message: "Username already exist."
                    });
                }
            })
        } else {
            let stmt = `INSERT INTO login(username,password,email,mobile_no) VALUES(?,?,?,?)`;
            let field = [reqData.username, encryptPsw, reqData.email, reqData.mobile_no];
            connection.query(stmt, field, (err, results, fields) => {
                if (err) {
                    return res.status(500).send("There was a problem registering the user.");
                }
                retrieveValue("", results.insertId).then((results) => {
                    console.log('Todo Id:' + JSON.stringify(results));
                    // console.log('Todo Id:' + JSON.stringify(fields));
                    var token = jwt.sign({ username: results[0].username }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    //   res.status(200).send({ auth: true, token: token });
                    res.format({
                        json: () => {
                            res.status(200).send({
                                message: "success",
                                auth: true,
                                token: token,
                                fields: results
                            });
                        }
                    })
                });
            });
        }
    }).catch((err) => {
        res.status(500).send("There was a problem registering the user.");
    });


});



/* GET Hello World page. */
loginRouter.post('/loginUser', function (req, res) {
    console.log(req.body)
    let reqData = req.body;
    var encryptPsw = encrypt(reqData.password);
    console.log(reqData.username, encryptPsw);
    loginRetrieveValue(reqData.username, encryptPsw).then((results) => {
        console.log(results);
        if (results.length > 0) {
            console.log(results[0]._id);
            retrieveValue("", results[0]._id).then((results) => {
                console.log('Todo Id:' + JSON.stringify(results));
                // console.log('Todo Id:' + JSON.stringify(fields));
                var token = jwt.sign({ username: results[0].username }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                });
                //   res.status(200).send({ auth: true, token: token });
                res.format({
                    json: () => {
                        res.status(200).send({
                            message: "success",
                            auth: true,
                            token: token,
                            fields: results
                        });
                    }
                })
            });

        } else {
            res.format({
                json: () => {
                    res.status(200).send({
                        message: "Invalid User",
                        auth: false,
                        token: null,
                    });
                }
            })
        }
    });

});

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password)
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function retrieveValue(username, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM login WHERE username = ? OR _id = ?`, [username, id], (err, results, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    })
}
function loginRetrieveValue(username, id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM login WHERE username = ? AND password = ?`, [username, id], (err, results, fields) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    })
}

module.exports = loginRouter;