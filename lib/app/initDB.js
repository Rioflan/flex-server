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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
//import * as mongoose from 'mongoose';
var mongoose = require("mongoose");
var mongoDB_1 = __importDefault(require("./database/mongoDB"));
var place_1 = __importDefault(require("./models/place"));
var apikey_1 = __importDefault(require("./models/apikey"));
var credentials_json_1 = __importDefault(require("./credentials.json"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/**
 * API TOKEN
 */
var usermail = process.env.USERMAIL || credentials_json_1.default.usermail;
var username = process.env.USERNAME || credentials_json_1.default.username;
var password = process.env.PASSWORD || credentials_json_1.default.password;
var hashedPassword = bcryptjs_1.default.hashSync(password, 8);
console.log("IMPORTING....");
/**
 * PLACES
 */
var floor3 = {
    "number": 3,
    "V": {
        "RER": 26,
        "MILIEU": 17,
        "BOIS": 22
    },
    "B": {
        "RER": 34,
        "MILIEU": 0,
        "BOIS": 43
    },
    "R": {
        "RER": 36,
        "MILIEU": 13,
        "BOIS": 56
    }
};
var floor4 = {
    "number": 4,
    "V": {
        "RER": 23,
        "MILIEU": 13,
        "BOIS": 23
    },
    "B": {
        "RER": 40,
        "MILIEU": 0,
        "BOIS": 35
    },
    "R": {
        "RER": 44,
        "MILIEU": 0,
        "BOIS": 59
    }
};
var floorX = {
    "number": 0,
    "V": {
        "SEINE": 23,
        "COUR": 13
    },
    "B": {
        "SEINE": 23,
        "COUR": 13
    },
    "R": {
        "SEINE": 23,
        "COUR": 13
    }
};
var floors = [floor3, floor4];
var floorsX = [floorX];
var zones = ["V", "B", "R"];
var sides = ["RER", "MILIEU", "BOIS"];
var sides2 = ["SEINE", "COUR"];
var nbFloors = floors.length;
var nbZones = zones.length;
var nbSides = sides.length;
(function () { return __awaiter(_this, void 0, void 0, function () {
    var totalX, indexFloor, indexZone, indexSide, number, zone, side, nbPlaces, numPlace, id, total, indexFloor, indexZone, indexSide, number, zone, side, nbPlaces, numPlace, id, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 24, , 25]);
                mongoose.connect(mongoDB_1.default.getMongoUri(), { useNewUrlParser: true });
                mongoose.set('useFindAndModify', false);
                // RAJOUT DU USER API
                console.log("ADD API USER");
                return [4 /*yield*/, apikey_1.default.create({
                        name: username,
                        email: usermail,
                        api_key: hashedPassword,
                        creation: Date.now(),
                    }, function (err, user) {
                        console.log(err);
                    })];
            case 1:
                _a.sent();
                return [4 /*yield*/, apikey_1.default.findOne({ email: usermail }, function (err, user) {
                        if (err)
                            return console.log('Error on the server.');
                        if (!user)
                            return console.log('No user found.');
                        var token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.API_SECRET);
                        console.log("token :" + token);
                    })];
            case 2:
                _a.sent();
                totalX = 0;
                indexFloor = 0;
                _a.label = 3;
            case 3:
                if (!(indexFloor < floorsX.length)) return [3 /*break*/, 12];
                indexZone = 0;
                _a.label = 4;
            case 4:
                if (!(indexZone < nbZones)) return [3 /*break*/, 11];
                indexSide = 0;
                _a.label = 5;
            case 5:
                if (!(indexSide < sides2.length)) return [3 /*break*/, 10];
                number = floorsX[indexFloor].number;
                zone = zones[indexZone];
                side = sides2[indexSide];
                nbPlaces = floorsX[indexFloor][zone][side];
                numPlace = 1;
                _a.label = 6;
            case 6:
                if (!(numPlace <= nbPlaces)) return [3 /*break*/, 9];
                id = "RA-" + number + "-" + zone + "-" + side + ("0" + numPlace).slice(-2);
                process.stdout.write("\r                              \r"); // clear current line
                process.stdout.write("Inserting " + id);
                return [4 /*yield*/, place_1.default.findOneAndUpdate({ id: id }, {}, { upsert: true, setDefaultsOnInsert: true })];
            case 7:
                _a.sent();
                totalX++;
                _a.label = 8;
            case 8:
                numPlace++;
                return [3 /*break*/, 6];
            case 9:
                indexSide++;
                return [3 /*break*/, 5];
            case 10:
                indexZone++;
                return [3 /*break*/, 4];
            case 11:
                indexFloor++;
                return [3 /*break*/, 3];
            case 12:
                total = 0;
                indexFloor = 0;
                _a.label = 13;
            case 13:
                if (!(indexFloor < nbFloors)) return [3 /*break*/, 22];
                indexZone = 0;
                _a.label = 14;
            case 14:
                if (!(indexZone < nbZones)) return [3 /*break*/, 21];
                indexSide = 0;
                _a.label = 15;
            case 15:
                if (!(indexSide < nbSides)) return [3 /*break*/, 20];
                number = floors[indexFloor].number;
                zone = zones[indexZone];
                side = sides[indexSide];
                nbPlaces = floors[indexFloor][zone][side];
                numPlace = 1;
                _a.label = 16;
            case 16:
                if (!(numPlace <= nbPlaces)) return [3 /*break*/, 19];
                id = "JO-" + number + "-" + zone + "-" + side + ("0" + numPlace).slice(-2);
                process.stdout.write("\r                              \r"); // clear current line
                process.stdout.write("Inserting " + id);
                return [4 /*yield*/, place_1.default.findOneAndUpdate({ id: id }, {}, { upsert: true, setDefaultsOnInsert: true })];
            case 17:
                _a.sent();
                total++;
                _a.label = 18;
            case 18:
                numPlace++;
                return [3 /*break*/, 16];
            case 19:
                indexSide++;
                return [3 /*break*/, 15];
            case 20:
                indexZone++;
                return [3 /*break*/, 14];
            case 21:
                indexFloor++;
                return [3 /*break*/, 13];
            case 22:
                console.log("\nTotal :", total + totalX, "inserted");
                return [4 /*yield*/, mongoose.disconnect()];
            case 23:
                _a.sent();
                console.log("FINISHED !");
                return [3 /*break*/, 25];
            case 24:
                err_1 = _a.sent();
                console.log("ERROR : " + err_1);
                return [3 /*break*/, 25];
            case 25: return [2 /*return*/];
        }
    });
}); })();
