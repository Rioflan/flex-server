"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = __importDefault(require("mongoose"));
var mongoDB_1 = __importDefault(require("./database/mongoDB"));
var socket_io_1 = __importDefault(require("socket.io"));
var model_1 = require("./models/model");
var app_1 = __importStar(require("./app"));
var DEFAULT_URI = mongoDB_1.default.getMongoUri(); //  get the URI from config file
var DEFAULT_PORT = 3000;
try {
    mongoose_1.default.connect(DEFAULT_URI, { useNewUrlParser: true }).catch(function (err) { return console.log(err); });
}
catch (err) {
    console.log(err);
}
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var server, websocket, pool;
        return __generator(this, function (_a) {
            server = app_1.default.listen(process.env.PORT || DEFAULT_PORT, function () {
                var port = server.address().port;
                console.log('App now running on port : ', port);
            });
            websocket = socket_io_1.default(server);
            pool = new Array();
            websocket.on('connect', function (socket) {
                socket.on('joinRoom', function (room) { return socket.join(room); });
                socket.on('leaveRoom', function (room) { return socket.leave(room); });
                socket.on('checkPlace', function (place) {
                    var index = pool.indexOf(place);
                    if (index > -1) {
                        socket.emit('leavePlace');
                        pool.splice(index, 1);
                        model_1.removePooledPlace(place);
                    }
                    else
                        socket.join(place);
                });
            });
            app_1.listOfRoutes(app_1.router, websocket, pool);
            return [2 /*return*/];
        });
    });
}
init();
