"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongo_json_1 = __importDefault(require("../config/mongo.json"));
var dotenv_1 = __importDefault(require("dotenv"));
var DATABASE_NAME = 'appdb';
dotenv_1.default.config();
var wrapper = {
    getMongoUri: function (mode, host, port, user, pass) {
        if (mode === void 0) { mode = mongo_json_1.default.mode; }
        if (host === void 0) { host = mongo_json_1.default.host; }
        if (port === void 0) { port = mongo_json_1.default.port; }
        if (user === void 0) { user = mongo_json_1.default.username; }
        if (pass === void 0) { pass = mongo_json_1.default.password; }
        if (mode === 'local') {
            // local mongo database URI
            return "mongodb://" + host + ":" + port + "/" + mongo_json_1.default.db;
        }
        if (mode === 'remote') {
            // mlab mongo database URI
            // default mlab database
            // let mongodbHost = config.host;
            // let mongodbPort = config.port;
            // let mongodbUser = config.username;
            // let mongodbPass = config.password;
            // custom mlab database URI
            // if (arguments.length === 5) {
            //   mongodbHost = host;
            //   mongodbPort = port;
            //   mongodbUser = user;
            //   mongodbPass = pass;
            // }
            // const mongoURI = `mongodb://${mongodbUser}:${mongodbPass}@${mongodbHost}:${mongodbPort}/${DATABASE_NAME}`;
            var mongoURI = process.env.DATABASE_URL;
            return mongoURI;
        }
    },
};
exports.default = wrapper;
