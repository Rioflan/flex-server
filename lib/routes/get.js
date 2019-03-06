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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var VerifyToken_1 = __importDefault(require("./VerifyToken"));
var test_1 = require("./test");
var model = __importStar(require("../models/model"));
var Get = function (router) {
    /** GET /users => {name, fname, id_place} */
    router.route("/users").get(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var users, usersDecrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, model.getUsers()];
                case 1:
                    users = _a.sent();
                    usersDecrypted = users.map(function (user) {
                        return {
                            id: user.id,
                            name: test_1.decrypt(user.name, req.userId),
                            fname: test_1.decrypt(user.fname, req.userId),
                            id_place: user.id_place || null,
                            remoteDay: user.remoteDay,
                            photo: user.photo
                        };
                    });
                    res.status(200).json(usersDecrypted);
                    return [2 /*return*/];
            }
        });
    }); });
    router
        .route("/users/:user_id/friends")
        .get(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var user_id, user, friendsArray, usersDecrypted;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user_id = test_1.encrypt(req.params.user_id, req.userId);
                    return [4 /*yield*/, model.getUserById(user_id)];
                case 1:
                    user = _a.sent();
                    friendsArray = user.friend;
                    usersDecrypted = friendsArray.map(function (friend) {
                        return {
                            id: test_1.decrypt(friend.id, req.userId),
                            name: test_1.decrypt(friend.name, req.userId),
                            fname: test_1.decrypt(friend.fname, req.userId),
                            id_place: friend.id_place || null,
                            remoteDay: friend.remoteDay,
                            photo: friend.photo
                        };
                    });
                    res.status(200).json(usersDecrypted);
                    return [2 /*return*/];
            }
        });
    }); });
    /** GET /users/:user_id */
    router
        .route("/users/:user_id")
        .get(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var id_user, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    id_user = test_1.encrypt(req.params.user_id, req.userId);
                    return [4 /*yield*/, model.getUserById(id_user)];
                case 1:
                    user = _a.sent();
                    res.status(200).json(user);
                    return [2 /*return*/];
            }
        });
    }); });
    /** GET /places */
    router.route("/places").get(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var places;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, model.getPlaces()];
                case 1:
                    places = _a.sent();
                    res.status(200).json(places);
                    return [2 /*return*/];
            }
        });
    }); });
    /** GET /environment */
    router
        .route("/environment")
        .get(VerifyToken_1.default, function (req, res) {
        var regexEnvironment = {
            LOGIN_REGEX: process.env.LOGIN_REGEX,
            PLACE_REGEX: process.env.PLACE_REGEX,
        };
        res.status(200).json(regexEnvironment);
    });
};
exports.default = Get;
