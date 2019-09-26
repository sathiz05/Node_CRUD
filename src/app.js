var server = require('./server');
var login = require('./controller/login.controller');
var usersWithMySQL = require('./controller/usersWithMySQL.controller');
var userWithMongoDb = require('./controller/usersWithMongoDb.controller');
var document = require('./controller/document.controller');
var upload = require('./controller/uploadImg.controller');
var bodyparser = require("body-parser");
var cors = require('cors')

server.use(cors());
server.use(bodyparser.json({limit:'50mb'}));
server.use(bodyparser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit:50000
  }));
server.use('/login', login);
server.use('/usersWithMySQL', usersWithMySQL);
server.use('/usersWithMongoDb', userWithMongoDb);
server.use('/document', document);
server.use('/upload', upload);