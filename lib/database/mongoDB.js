"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var DATABASE_NAME = 'appdb';
dotenv_1.default.config();
var wrapper = {
    getMongoUri: function (mode, host, port, user, pass) {
        if (mode === void 0) { mode = process.env.DATABASE_MODE; }
        if (host === void 0) { host = process.env.DATABASE_HOST; }
        if (port === void 0) { port = process.env.DATABASE_PORT; }
        if (user === void 0) { user = process.env.DATABASE_USERNAME; }
        if (pass === void 0) { pass = process.env.DATABASE_PASSWORD; }
        if (mode === 'local') {
            // local mongo database URI
            return "mongodb://" + host + ":" + port + "/" + process.env.DATABASE_DB;
        }
        if (mode === 'remote') {
            // mlab mongo database URI
            // default mlab database
            // let mongodbHost = process.env.DATABASE_HOST;
            // let mongodbPort = process.env.DATABASE_PORT;
            // let mongodbUser = process.env.DATABASE_USERNAME;
            // let mongodbPass = process.env.DATABASE_PASSWORD;
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
