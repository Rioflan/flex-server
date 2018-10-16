"use strict";
var DATABASE_NAME = "appdb";
var COLLECTION = "users";
var config = require("../../config/mongo");
module.exports = {
    getMongoUri: function (mode, host, port, user, pass) {
        if (config.mode == "local") {
            //local mongo database URI
            return "mongodb://" + config.host + ":" + config.post + "/" + config.db;
        }
        if (mode == "remote") {
            //mlab mongo database URI
            //default mlab database
            var mongodbHost = config.host;
            var mongodbPort = config.port;
            var mongodbUser = config.username;
            var mongodbPass = config.password;
            //custom mlab database URI
            if (arguments.length == 5) {
                mongodbHost = host;
                mongodbPort = port;
                mongodbUser = user;
                mongodbPass = pass;
            }
            return ("mongodb://" +
                mongodbUser +
                ":" +
                mongodbPass +
                "@" +
                mongodbHost +
                ":" +
                mongodbPort +
                "/" +
                DATABASE_NAME);
        }
    }
};
