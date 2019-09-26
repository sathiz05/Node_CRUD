var user_mySql_router = require('../config/router.controller');
var connection = require('../config/mysqlConnection');
var jwt = require('jsonwebtoken');
var config = require('../config/token'); // get our config file

user_mySql_router.get('/', (req, res) => {
    res.send('User Details With MySQL Methods');
});

//Retrieve User
user_mySql_router.post('/Allusers', (req, res) => {
    let token = req.get("Authorization");
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, (err, tokenRes) => {
        if (err) {  
            console.log(err);
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        } else {
            let reqData = req.body;
            connection.query('select * from users WHERE signup_id = ?', [reqData.userID], (err, rows, fields) => {
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

user_mySql_router.post('/getUsersById', (req, res) => {
    let token = req.get("Authorization");
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    jwt.verify(token, config.secret, (err, tokenRes) => {
        if (err) {
            console.log(err);
            return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        } else {
            console.log(req.body);
            let reqData = req.body;
            let stmt = `SELECT * FROM users WHERE _id = ?`;
            let field = [reqData._id];
            //console.log(`Fields =>${JSON.stringify(field)}`);
            connection.query(stmt, field, (err, results, fields) => {
                if (err) {
                    console.error(err.message);
                }
                console.log(results);
                res.send(results);
            });

        }
    });
});


//Create User
user_mySql_router.post('/userCreate', (req, res) => {
    console.log(req.body);
    let reqData = req.body;
    let stmt = `INSERT INTO users(firstname,lastname,emailid,phoneno,signup_id) VALUES(?,?,?,?,?)`;
    let field = [reqData.firstname, reqData.lastname, reqData.emailid, reqData.phoneno, reqData.signup_id];
    //console.log(`Fields =>${JSON.stringify(field)}`);
    connection.query(stmt, field, (err, results, fields) => {
        console.log(`Parameter Values =>
            err =>${JSON.stringify(err)},
            results =>${JSON.stringify(results)},
            fields =>${JSON.stringify(fields)}
        `)
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


});

//Edit user Details
user_mySql_router.post('/userEdit', (req, res) => {
    console.log(req.body);
    let reqData = req.body;

    // update statment
    let sql = `UPDATE users SET firstname = ? , lastname = ? , emailid = ? , phoneno = ? WHERE _id = ?`;

    let field = [reqData.firstname, reqData.lastname, reqData.emailid, reqData.phoneno, reqData._id];

    // execute the UPDATE statement
    connection.query(sql, field, (error, results, fields) => {
        console.log(`Parameter Values =>
            err =>${JSON.stringify(error)},
            results =>${JSON.stringify(results)},
            fields =>${JSON.stringify(fields)}
        `)
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


})


// Delete User
user_mySql_router.post('/userDelete', (req, res) => {
    console.log(req.body);
    let reqData = req.body;
    // DELETE statment
    let sql = `DELETE FROM users WHERE _id = ?`;

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

module.exports = user_mySql_router;