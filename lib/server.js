"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoDB_1 = __importDefault(require("./database/mongoDB"));
var socket_io_1 = __importDefault(require("socket.io"));
var place_1 = __importDefault(require("./models/place"));
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
var websocket = socket_io_1.default(server);
var pool = new Array();
websocket.on('connect', function (socket) {
    socket.on('joinRoom', function (room) {
        var index = pool.indexOf(room);
        if (index > -1) {
            socket.emit('leavePlace');
            pool.splice(index, 1);
        }
        else {
            socket.join(room);
        }
    });
    socket.on('leaveRoom', function (room) { return socket.leave(room); });
});
place_1.default.watch({ fullDocument: 'updateLookup' }).on('change', function (changes) {
    var place = changes.fullDocument;
    if (place && place.using === false) {
        if (websocket.sockets.adapter.rooms[place.id])
            websocket.in(place.id).emit('leavePlace');
        else
            pool = pool.concat([place.id]);
    }
});
