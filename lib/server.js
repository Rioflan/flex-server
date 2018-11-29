"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoDB_1 = __importDefault(require("./database/mongoDB"));
var app_1 = __importDefault(require("./app"));
var DEFAULT_URI = mongoDB_1.default.getMongoUri(); //  get the URI from config file
var DEFAULT_PORT = 3000;
try {
    mongoose_1.default.connect(DEFAULT_URI, { useNewUrlParser: true }).catch(function (err) { return console.log(err); });
}
catch (err) {
    console.log(err);
}
var server = app_1.default.listen(process.env.PORT || DEFAULT_PORT, function () {
    var port = server.address().port;
    console.log('App now running on port : ', port);
});
