const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'remotemysql.com',
    user: 'mquBitxjy3',
    password: 'FNJrevAtmW',
    database: 'mquBitxjy3'
});

connection.connect((err) => {
    if (!err) {
        console.log('Connection Established Successfully');
    } else {
        console.log(`Connection Failed : ${JSON.stringify(err)}`);
    }

});

module.exports = connection;