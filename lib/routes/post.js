"use strict";
/* eslint-disable */
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
var ramda_1 = require("ramda");
var user_1 = __importDefault(require("../models/user"));
var model = __importStar(require("../models/model"));
var VerifyToken_1 = __importDefault(require("./VerifyToken"));
var test_1 = require("./test");
var HTTPS_REGEX = "^https?://(.*)";
var errorMessages = {
    userCreation: "Error creating the user",
    userFind: "Error finding the user",
    userUpdate: "Error updating the user",
    userIdMatch: "User's ID not matching user's info",
    placeCreation: "Error creating the place",
    placeFind: "Error finding the place",
    placeUpdate: "Error updating the place",
    placeAlreadyUsed: "Place already used by : ",
    invalidArguments: "Invalid arguments"
};
var successMessages = {
    takePlace: "Place successfully assigned to user",
    leavePlace: "User successfully left the place"
};
var resultCodes = {
    success: 200,
    syntaxError: 400,
    serverError: 500
};
var RES;
var post = function (router) {
    /**
     * This route is used to handle users login.
     */
    router
        .route("/login_user")
        .post(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    if (body.name === null ||
                        body.fname === null ||
                        body.id_user === null ||
                        body.id_user.match(process.env.LOGIN_REGEX) === null)
                        return [2 /*return*/, res.status(resultCodes.syntaxError).json(errorMessages.invalidArguments)];
                    body.id_user = test_1.encrypt(body.id_user, req.userId);
                    body.name = test_1.encrypt(body.name, req.userId);
                    body.fname = test_1.encrypt(body.fname, req.userId);
                    return [4 /*yield*/, model.userExists(body.id_user)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, model.getUserById(body.id_user)];
                case 2:
                    user = _a.sent();
                    return [4 /*yield*/, model.matchUserInfo(user, body)];
                case 3:
                    if (_a.sent())
                        res.status(resultCodes.success).send({ user: user });
                    else
                        res.status(resultCodes.serverError).send(errorMessages.userIdMatch);
                    return [3 /*break*/, 5];
                case 4:
                    model.addUser(body.id_user, body.name, body.fname);
                    res.status(resultCodes.success).json({ result: "User Added" });
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); });
    /**
     * This route is used to assign a place to a user.
     */
    router
        .route("/take_place")
        .post(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, id_place, usedById, id_user, historical, beginDate, user, name_1, fname;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    if (!body.id_place || !body.id_user) {
                        return [2 /*return*/, res.status(resultCodes.syntaxError).send(errorMessages.invalidArguments)];
                    }
                    id_place = body.id_place;
                    return [4 /*yield*/, model.whoUses(id_place)];
                case 1:
                    usedById = _a.sent();
                    if (!(usedById === "#" || usedById === "")) return [3 /*break*/, 3];
                    id_user = test_1.encrypt(body.id_user, req.userId);
                    return [4 /*yield*/, model.getUserById(id_user).then(function (user) { return user.historical; })];
                case 2:
                    historical = _a.sent();
                    beginDate = new Date(Date.now()).toLocaleString();
                    if (usedById === "#") {
                        console.log("Place doesn't exist");
                        model.addPlace(id_place, true, id_user);
                    }
                    else {
                        console.log("Place exists and is free");
                        model.updatePlace(id_place, { using: true, id_user: id_user });
                    }
                    model.updateUser(id_user, {
                        id_place: id_place,
                        historical: historical.concat([{ id_place: id_place, begin: beginDate, end: "" }])
                    });
                    res.status(resultCodes.success).send(successMessages.takePlace);
                    return [3 /*break*/, 5];
                case 3:
                    console.log("Place already used");
                    return [4 /*yield*/, model.getUserById(usedById)];
                case 4:
                    user = _a.sent();
                    name_1 = test_1.decrypt(user.name, req.userId);
                    fname = test_1.decrypt(user.fname, req.userId);
                    res.status(resultCodes.serverError).json({
                        name: name_1,
                        fname: fname
                    });
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    }); });
    router
        .route("/leave_place")
        .post(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, id_user, historical, endDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    if (!body.id_place || !body.id_user) {
                        return [2 /*return*/, res.status(resultCodes.syntaxError).send(errorMessages.invalidArguments)];
                    }
                    id_user = test_1.encrypt(body.id_user, req.userId);
                    return [4 /*yield*/, model.getUserById(id_user).then(function (user) { return user.historical; })];
                case 1:
                    historical = _a.sent();
                    endDate = new Date(Date.now()).toLocaleString();
                    historical[historical.length - 1].end = endDate; // set the end date of the last place in array
                    model.updateUser(id_user, { historical: historical, id_place: "" });
                    model.updatePlace(body.id_place, { using: false, id_user: "" });
                    res.status(resultCodes.success).send(successMessages.leavePlace);
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * This route is used to add a friend.
     */
    router
        .route("/add_friend")
        .post(VerifyToken_1.default, function (req, res) {
        var body = req.body;
        RES = res;
        var id_user = test_1.encrypt(body.id_user, req.userId);
        user_1.default.findOne({ id: id_user }, null, { sort: { _id: -1 } }, function (err, user) {
            if (err)
                RES.status(resultCodes.syntaxError).send(errorMessages.userFind);
            else if (user) {
                user.friend = ramda_1.append({
                    id: body.id,
                    name: body.name,
                    fname: body.fname,
                    id_place: body.id_place,
                    photo: body.photo
                }, user.friend);
                user.save(function (err) {
                    if (err)
                        RES.status(resultCodes.serverError).send(errorMessages.userUpdate);
                    RES.status(resultCodes.success).send({ user: user });
                });
            }
        });
    });
    /**
     * This route is used to remove a friend.
     */
    router
        .route("/remove_friend")
        .post(VerifyToken_1.default, function (req, res) {
        var body = req.body;
        RES = res;
        var id_user = test_1.encrypt(body.id_user, req.userId);
        user_1.default.findOne({ id: id_user }, null, { sort: { _id: -1 } }, function (err, user) {
            if (err)
                RES.status(resultCodes.syntaxError).send(errorMessages.userFind);
            else if (user) {
                var isRemovedUser = function (userFriend) { return userFriend.id !== body.id; };
                user.friend = ramda_1.filter(isRemovedUser, user.friend);
                user.save(function (err) {
                    if (err)
                        RES.status(resultCodes.serverError).send(errorMessages.userUpdate);
                    RES.status(resultCodes.success).send({ user: user });
                });
            }
        });
    });
    router
        .route("/settings_user")
        .post(VerifyToken_1.default, function (req, res) {
        var body = req.body;
        var id_user = test_1.encrypt(body.id_user, req.userId);
        if (body.photo &&
            body.photo.match(HTTPS_REGEX) === null &&
            (body.photo !== "" || body.photo !== null))
            model.updatePhoto(id_user, body.photo);
        if (body.remoteDay !== "")
            model.updateUser(id_user, { remoteDay: body.remoteDay });
        res.status(resultCodes.success).send({ success: "success" });
    });
};
exports.default = post;
