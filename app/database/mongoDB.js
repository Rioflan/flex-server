var DATABASE_NAME = 'appdb';
var COLLECTION = 'users';
var config = require('../../config/mlab');


module.exports = {
  getMongoUri : function(type, host, port, user, pass)
  {
    if(type == "local")//local mongo database URI
    {
      //default local database URI
      var localHost = "localhost";
      var localPort = "27017";

      //custom local database URI
      if(arguments.length == 3)
      {
        localHost = host;
        localPort = port;
      }

      return "mongodb://" + localHost + ":" + localPort + "/" + DATABASE_NAME;
    }

    if(type == "mlab")//mlab mongo database URI
    {
      //default mlab database
      var mongodbHost = config.host;
      var mongodbPort = config.port;
      var mongodbUser = config.username;
      var mongodbPass = config.password;

      //custom mlab database URI
      if(arguments.length == 5)
      {
        mongodbHost = host;
        mongodbPort = port;
        mongodbUser = user;
        mongodbPass = pass;
      }

      return 'mongodb://' + mongodbUser + ':' + mongodbPass + '@' +mongodbHost +
      ':' + mongodbPort + '/' + DATABASE_NAME;
    }
  }
}
