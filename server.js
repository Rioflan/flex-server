const express = require('express');             //call express
const bodyParser = require("body-parser");      //call body-parser
const mongoose = require("mongoose");           //call mongoose
const dbconfig = require('./app/database/mongoDB');

var app = express();                            //use express on our app
var router = express.Router();                  // get an instance of the express Router
require('./app/routes/post')(router);
require('./app/routes/get')(router);
require('./app/routes/auth')(router);

// configure app to use bodyParser() => get data from http request (POST)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var DEFAULT_URI = dbconfig.getMongoUri(); //get the URI from config file
var DEFAULT_PORT = 3000;

mongoose.connect(DEFAULT_URI, {useNewUrlParser: true});

router.use(function(req, res, next) {
  console.log(req.connection.remoteAddress);
  next();
});

router.get('/', function(req, res) {
  res.json({ message: 'pong' });
});

app.use('/ping', router);             //define the default route

var server = app.listen(process.env.PORT || DEFAULT_PORT, function () {
  var port = server.address().port;
  console.log("App now running on port : ", port);
});
