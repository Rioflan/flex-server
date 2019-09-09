"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
var mongodb = require('mongodb');
dotenv.config();
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
        if (mode === "remote") {
            // mlab mongo database URI
            // default mlab database
            var mongodbHost = process.env.DATABASE_HOST;
            var mongodbPort = process.env.DATABASE_PORT;
            var mongodbUser = process.env.DATABASE_USERNAME;
            var mongodbPass = process.env.DATABASE_PASSWORD;
            var mongoURI = process.env.DATABASE_URL === "" ? // temporary before a fix is done
                "mongodb://" + mongodbUser + ":" + mongodbPass + "@" + mongodbHost + ":" + mongodbPort + "/" + process.env.DATABASE_DB
                : process.env.DATABASE_URL; // temporary before a fix is done
            return mongoURI;
        }
    },
    getUserPhotoWrapper: function (user_id) {
        return new Promise(function (resolve, reject) {
            getUserPhoto(user_id, function (successResponse) {
                process.stdout.write('RESOLVED!!!!!!!!!!!!\n');
                resolve(successResponse);
            });
        });
    },
};
exports.default = wrapper;
function getUserPhoto(user_id, callback) {
    var url = 'mongodb://localhost:27017/flex';
    mongodb.MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
        var db = client.db("flex");
        if (err) {
            process.stdout.write('Sorry unable to connect to MongoDB Error:', err + '\n');
        }
        else {
            process.stdout.write('CONNECTION OK \n');
            var bucket = new mongodb.GridFSBucket(db, {
                chunkSizeBytes: 1024,
                bucketName: 'Avatars'
            });
            process.stdout.write('BUCKET CREATED \n');
            var str = '';
            var gotData = 0;
            bucket.openDownloadStreamByName(user_id)
                .on('error', function (error) {
                process.stdout.write('Error:-', error + '\n');
            })
                .on('data', function (data) {
                ++gotData;
                str += data.toString('utf8');
            })
                .on('end', function () {
                process.stdout.write('done!');
                callback(str);
            });
        }
    });
}
