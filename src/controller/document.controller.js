var document = require('express').Router();
var connection = require('../config/mysqlConnection');
var jwt = require('jsonwebtoken');
var config = require('../config/token'); // get our config file

document.get('/', (req, res) => {
    res.send('Document API Call');
});

//Create User
document.post('/insertDocType', (req, res) => {
    let token = req.get("Authorization");
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, (err, tokenRes) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        } else {
            console.log(req.body);
            let reqData = req.body;
            var adharcard = /^\d{12}$/;
            var passport = /^([A-Z a-z]){1}([0-9]){7}$/;
            var voterid = /^([A-Z a-z]){3}([0-9]){7}$/;
            var DL = /^([A-Z a-z]){2}([0-9]){13}$/;
            var pancard = /^([A-Za-z]){5}([0-9]){4}([A-Za-z]){1}?$/
            console.log(`doc_code =>${reqData.doc_code}`);
            if (reqData.doc_code == 101) {
                console.log(`Aadhar =>${reqData.doc_number.match(adharcard)}`);
                if (!reqData.doc_number.match(adharcard)) {
                    res.format({
                        json: () => {
                            res.status(422).send({
                                message: "Invalid Aadhar Number"
                            });
                        }
                    })
                } else {
                    insertDocumentInfo(req, res);
                }
            }
            else if (reqData.doc_code == 102) {
                console.log(`Passport =>${reqData.doc_number.match(passport)}`);
                if (!reqData.doc_number.match(passport)) {
                    res.format({
                        json: () => {
                            res.status(422).send({
                                message: "Invalid Passport Number"
                            });
                        }
                    })
                } else {
                    insertDocumentInfo(req, res);
                }
            }
            else if (reqData.doc_code == 103) {
                console.log(`Voter id =>${reqData.doc_number.match(voterid)}`);
                if (!reqData.doc_number.match(voterid)) {
                    res.format({
                        json: () => {
                            res.status(422).send({
                                message: "Invalid Voter Id Number"
                            });
                        }
                    })
                } else {
                    insertDocumentInfo(req, res);
                }
            }
            else if (reqData.doc_code == 104) {
                console.log(`Voter id =>${reqData.doc_number.match(DL)}`);
                if (!reqData.doc_number.match(DL)) {
                    res.format({
                        json: () => {
                            res.status(422).send({
                                message: "Invalid Driving License Number"
                            });
                        }
                    })
                } else {
                    insertDocumentInfo(req, res);
                }
            }
            else if (reqData.doc_code == 105) {
                console.log(`Pancard =>${reqData.doc_number.match(pancard)}`);
                if (!reqData.doc_number.match(pancard)) {
                    res.format({
                        json: () => {
                            res.status(422).send({
                                message: "Invalid pancard"
                            });
                        }
                    })
                } else {
                    insertDocumentInfo(req, res);
                }
            }
            else {
                console.log('sucess');
                res.format({
                    json: () => {
                        res.status(200).send({
                            message: "success"
                        });
                    }
                })
            }

        }

    })
});


function insertDocumentInfo(req, res) {
    console.log(req.body);
    let reqData = req.body;
    let stmt = `INSERT INTO document_type(doc_name,doc_code,doc_number,user_id) VALUES(?,?,?,?)`;
    let field = [reqData.doc_name, reqData.doc_code, reqData.doc_number, reqData.user_id];
    //console.log(`Fields =>${JSON.stringify(field)}`);
    connection.query(stmt, field, (err, results, fields) => {
        if (err) {
            return console.error(err.message);
        }
        // get inserted id
        console.log('Todo Id:' + results.insertId);
        res.format({
            json: () => {
                res.status(200).send({
                    message: "success"
                });
            }
        })
    });
}



//Create User
document.post('/updateDocInfo', (req, res) => {
    let token = req.get("Authorization");
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, (err, tokenRes) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        } else {
            console.log(req.body);
            let reqData = req.body;
            var adharcard = /^\d{12}$/;
            var passport = /^([A-Z a-z]){1}([0-9]){7}$/;
            var voterid = /^([A-Z a-z]){3}([0-9]){7}$/;
            var DL = /^([A-Z a-z]){2}([0-9]){13}$/;
            var pancard = /^([A-Za-z]){5}([0-9]){4}([A-Za-z]){1}?$/
            console.log(`doc_code =>${reqData.doc_code}`);
            if (reqData.doc_code == 101) {
                console.log(`Aadhar =>${reqData.doc_number.match(adharcard)}`);
                if (!reqData.doc_number.match(adharcard)) {
                    res.format({
                        json: () => {
                            res.status(422).send({
                                message: "Invalid Aadhar Number"
                            });
                        }
                    })
                } else {
                    updateDocumentInfo(req, res);
                }
            }
            else if (reqData.doc_code == 102) {
                console.log(`Passport =>${reqData.doc_number.match(passport)}`);
                if (!reqData.doc_number.match(passport)) {
                    res.format({
                        json: () => {
                            res.status(422).send({
                                message: "Invalid Passport Number"
                            });
                        }
                    })
                } else {
                    updateDocumentInfo(req, res);
                }
            }
            else if (reqData.doc_code == 103) {
                console.log(`Voter id =>${reqData.doc_number.match(voterid)}`);
                if (!reqData.doc_number.match(voterid)) {
                    res.format({
                        json: () => {
                            res.status(422).send({
                                message: "Invalid Voter Id Number"
                            });
                        }
                    })
                } else {
                    updateDocumentInfo(req, res);
                }
            }
            else if (reqData.doc_code == 104) {
                console.log(`Voter id =>${reqData.doc_number.match(DL)}`);
                if (!reqData.doc_number.match(DL)) {
                    res.format({
                        json: () => {
                            res.status(422).send({
                                message: "Invalid Driving License Number"
                            });
                        }
                    })
                } else {
                    updateDocumentInfo(req, res);
                }
            }
            else if (reqData.doc_code == 105) {
                console.log(`Pancard =>${reqData.doc_number.match(pancard)}`);
                if (!reqData.doc_number.match(pancard)) {
                    res.format({
                        json: () => {
                            res.status(422).send({
                                message: "Invalid pancard"
                            });
                        }
                    })
                } else {
                    updateDocumentInfo(req, res);
                }
            }
            else {
                console.log('sucess');
                res.format({
                    json: () => {
                        res.status(200).send({
                            message: "success"
                        });
                    }
                })
            }

        }

    })
});

function updateDocumentInfo(req, res) {
    console.log(req.body);
    let reqData = req.body;
    // INSERT INTO document_type(doc_name,doc_code,doc_number,user_id) VALUES(?,?,?,?)
    // update statment
    let sql = `UPDATE document_type SET doc_name = ? , doc_code = ? , doc_number = ? WHERE _id = ?`;

    let field = [reqData.doc_name, reqData.doc_code, reqData.doc_number, reqData._id];

    // execute the UPDATE statement
    connection.query(sql, field, (error, results, fields) => {
        if (error) {
            return console.error(error.message);
        }
        console.log('Rows affected:', results.affectedRows);
        res.format({
            json: () => {
                res.status(200).send({
                    message: "success"
                });
            }
        })
    });

}

//Retrieve User
document.post('/docTypeList', (req, res) => {
    let token = req.get("Authorization");
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, (err, tokenRes) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        } else {
            let reqData = req.body;
            connection.query('select * from document_type WHERE user_id = ?', [reqData.user_id], (err, rows, fields) => {
                if (!err) {
                    res.send(rows);
                }
                else {
                    console.log(err);
                }
            });
        }

    })

})

//Retrieve User
document.post('/docTypeListById', (req, res) => {
    let token = req.get("Authorization");
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, (err, tokenRes) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        } else {
            let reqData = req.body;
            connection.query('select * from document_type WHERE _id = ?', [reqData._id], (err, rows, fields) => {
                if (!err) {
                    res.send(rows);
                }
                else {
                    console.log(err);
                }
            });
        }

    })

})


// Delete User
document.post('/deleteDocInfo', (req, res) => {
    console.log(req.body);
    let reqData = req.body;
    // DELETE statment
    let sql = `DELETE FROM document_type WHERE _id = ?`;

    // delete a row with id 1
    connection.query(sql, reqData._id, (error, results, fields) => {
        if (error)
            return console.error(error.message);

        console.log('Deleted Row(s):', results.affectedRows);
        res.format({
            json: () => {
                res.status(200).send({
                    message: "success"
                });
            }
        })
    });

})

module.exports = document;