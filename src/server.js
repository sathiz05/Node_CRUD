var express = require('express');
var app = express();
var port = process.env.PORT || 3000;



app.listen(port, ()=>{
    console.log("Server start and listening port 3001");
});



module.exports = app;