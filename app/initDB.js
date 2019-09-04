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
var _this = this;
exports.__esModule = true;
var mongoose_1 = require("mongoose");
var mongoDB_1 = require("./database/mongoDB");
var place_1 = require("./models/place");
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
var floors = [floor3, floor4];
var zones = ["V", "B", "R"];
var sides = ["RER", "MILIEU", "BOIS"];
var nbFloors = floors.length;
var nbZones = zones.length;
var nbSides = sides.length;
(function () { return __awaiter(_this, void 0, void 0, function () {
    var total, indexFloor, indexZone, indexSide, number, zone, side, nbPlaces, numPlace, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                mongoose_1["default"].connect(mongoDB_1["default"].getMongoUri(), { useNewUrlParser: true });
                mongoose_1["default"].set('useFindAndModify', false);
                total = 0;
                indexFloor = 0;
                _a.label = 1;
            case 1:
                if (!(indexFloor < nbFloors)) return [3 /*break*/, 10];
                indexZone = 0;
                _a.label = 2;
            case 2:
                if (!(indexZone < nbZones)) return [3 /*break*/, 9];
                indexSide = 0;
                _a.label = 3;
            case 3:
                if (!(indexSide < nbSides)) return [3 /*break*/, 8];
                number = floors[indexFloor].number;
                zone = zones[indexZone];
                side = sides[indexSide];
                nbPlaces = floors[indexFloor][zone][side];
                numPlace = 1;
                _a.label = 4;
            case 4:
                if (!(numPlace <= nbPlaces)) return [3 /*break*/, 7];
                id = number + "-" + zone + "-" + side + ("0" + numPlace).slice(-2);
                process.stdout.write("\r                              \r"); // clear current line
                process.stdout.write("Inserting " + id);
                return [4 /*yield*/, place_1["default"].findOneAndUpdate({ id: id }, {}, { upsert: true, setDefaultsOnInsert: true })];
            case 5:
                _a.sent();
                total++;
                _a.label = 6;
            case 6:
                numPlace++;
                return [3 /*break*/, 4];
            case 7:
                indexSide++;
                return [3 /*break*/, 3];
            case 8:
                indexZone++;
                return [3 /*break*/, 2];
            case 9:
                indexFloor++;
                return [3 /*break*/, 1];
            case 10: return [4 /*yield*/, mongoose_1["default"].disconnect()];
            case 11:
                _a.sent();
                console.log("\nTotal :", total, "inserted");
                return [2 /*return*/];
        }
    });
}); })();
