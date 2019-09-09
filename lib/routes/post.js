/* eslint-disable */
'use strict';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var moment_1 = __importDefault(require("moment"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var mongoDB_1 = __importDefault(require("../database/mongoDB"));
var mongodb = require('mongodb');
//const fs = require('fs');
//const mongoose = require("mongoose");
//var Grid = require('gridfs-stream');
var assert = require('assert');
var stream = require('stream');
var HTTPS_REGEX = "^https?://(.*)";
var errorMessages = {
    userCreation: "Error creating the user",
    userFind: "Error finding the user",
    userUpdate: "Error updating the user",
    userIdMatch: "User's ID does not match user's info",
    userIdTaken: "The ID you specified is taken",
    placeCreation: "Error creating the place",
    placeFind: "Error finding the place",
    placeUpdate: "Error updating the place",
    placeAlreadyUsed: "Place already used by : ",
    invalidArguments: "Invalid arguments",
    invalidCode: "Invalid confirmation code"
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
function putFile(bytes, name) {
    mongodb.MongoClient.connect(mongoDB_1.default.getMongoUri(), function (error, client) {
        assert.ifError(error);
        var db = client.db("flex");
        process.stdout.write("GOT A CONNECTION...\n");
        var opts = {
            chunkSizeBytes: 1024,
            bucketName: 'Avatars'
        };
        try {
            var bucket = new mongodb.GridFSBucket(db, opts);
            process.stdout.write("BUCKET CREATED...\n");
            try {
                var readablePhotoStream = new stream.Readable();
                readablePhotoStream.push(bytes);
                readablePhotoStream.push(null);
                var uploadStream = bucket.openUploadStream(name);
                var id = uploadStream.id;
                readablePhotoStream.pipe(uploadStream);
            }
            catch (error) {
                process.stdout.write("COULDN'T WRITE FILE IN DB...\n" + error + "\n");
            }
        }
        catch (error) {
            process.stdout.write("BUCKET CREATION FAILED...\n" + error);
        }
    });
}
var post = function (router) {
    /**
     * This route is used to handle users login.
     */
    router
        .route("/user/login")
        .post(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, email, user, confirmation_code, confirmation_token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    if (body.email === null)
                        return [2 /*return*/, res
                                .status(resultCodes.syntaxError)
                                .json(errorMessages.invalidArguments)];
                    email = test_1.encrypt(body.email, req.userId);
                    return [4 /*yield*/, model.getUser({ email: email })];
                case 1:
                    if (!!(_a.sent())) return [3 /*break*/, 3];
                    return [4 /*yield*/, model.addUser(email)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4 /*yield*/, model.getUser({ email: email })];
                case 4:
                    user = _a.sent();
                    confirmation_code = model.generateConfirmationCode();
                    confirmation_token = jsonwebtoken_1.default.sign({ email: email, confirmation_code: confirmation_code }, process.env.API_SECRET, { expiresIn: 360 });
                    return [4 /*yield*/, user_1.default.updateOne({ email: email }, { confirmation_token: confirmation_token, confirmation_code: confirmation_code })];
                case 5:
                    _a.sent();
                    model.sendConfirmationEmail(__assign({}, user, { confirmation_token: confirmation_token,
                        confirmation_code: confirmation_code, email: body.email }));
                    res.status(resultCodes.success).json({ email: body.email });
                    return [2 /*return*/];
            }
        });
    }); });
    router
        .route("/user/complete")
        .post(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, id, name, fname, email, existingUser, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    if (body.email === null ||
                        body.name === null ||
                        body.fname === null ||
                        body.id_user === null ||
                        body.id_user.match(process.env.LOGIN_REGEX) === null)
                        return [2 /*return*/, res
                                .status(resultCodes.syntaxError)
                                .json(errorMessages.invalidArguments)];
                    id = test_1.encrypt(body.id_user, req.userId);
                    name = test_1.encrypt(body.name, req.userId);
                    fname = test_1.encrypt(body.fname, req.userId);
                    email = test_1.encrypt(body.email, req.userId);
                    return [4 /*yield*/, model.getUserById(id)];
                case 1:
                    existingUser = _a.sent();
                    if (!existingUser) return [3 /*break*/, 4];
                    if (existingUser.email)
                        return [2 /*return*/, res
                                .status(resultCodes.syntaxError)
                                .json(errorMessages.userIdTaken)];
                    return [4 /*yield*/, model.removeUser({ email: email })];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, user_1.default.updateOne({ id: id }, { email: email, name: name, fname: fname })];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, user_1.default.updateOne({ email: email }, { id: id, name: name, fname: fname })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6:
                    if (body.photo &&
                        body.photo.match(HTTPS_REGEX) === null &&
                        (body.photo !== "" || body.photo !== null))
                        model.updatePhoto(id, body.photo);
                    return [4 /*yield*/, model.getUserById(id)];
                case 7:
                    user = _a.sent();
                    res.status(resultCodes.success).json({
                        id: test_1.decrypt(user.id || "", req.userId),
                        name: test_1.decrypt(user.name || "", req.userId),
                        fname: test_1.decrypt(user.fname || "", req.userId),
                        email: test_1.decrypt(user.email || "", req.userId),
                        remoteDay: user.remoteDay,
                        photo: user.photo,
                        start_date: user.start_date,
                        end_date: user.end_date,
                        historical: user.historical
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * This route is used to add a friend.
     */
    router
        .route("/users/add")
        .post(VerifyToken_1.default, function (req, res) {
        var body = req.body;
        RES = res;
        var id_user = test_1.encrypt(body.id_user, req.userId);
        console.log(id_user);
        user_1.default.findOne({ id: id_user }, null, { sort: { _id: -1 } }, function (err, user) {
            if (err)
                RES.status(resultCodes.syntaxError).send(errorMessages.userFind);
            else if (user) {
                user.friend = ramda_1.append({
                    id: body.id,
                    name: test_1.encrypt(body.name, req.userId),
                    fname: test_1.encrypt(body.fname, req.userId),
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
        .route("/users/remove")
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
    /*
     * This route is used to remove delete an user
     * Not necessarily used in the applicaton
     */
    router
        .route("/user/remove")
        .post(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, name, fname, user, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    name = test_1.encrypt(body.name, req.userId);
                    fname = test_1.encrypt(body.fname, req.userId);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, model.getUser({ name: name, fname: fname })];
                case 2:
                    user = _a.sent();
                    return [4 /*yield*/, model.removeUserById(user.id)];
                case 3:
                    _a.sent();
                    res.status(resultCodes.success).send({ success: "success" });
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.log(err_1);
                    res.status(resultCodes.serverError).send(err_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    router
        .route("/user/settings")
        .post(VerifyToken_1.default, function (req, res) {
        var body = req.body;
        var id_user = test_1.encrypt(body.id_user, req.userId);
        if (body.photo &&
            body.photo.match(HTTPS_REGEX) === null &&
            (body.photo !== "" || body.photo !== null))
            process.stdout.write("\nprocess.env.NODE_ENV is " + process.env.NODE_ENV + "\n");
        if (process.env.NODE_ENV !== "development") {
            model.updatePhoto(id_user, body.photo);
        }
        else {
            putFile(body.photo, body.id_user);
        }
        if (body.remoteDay !== "")
            model.updateUser(id_user, { remoteDay: body.remoteDay });
        if (body.startDate && body.endDate) {
            model.updateAvailabilityPeriod(id_user, moment_1.default(body.startDate, "DD/MM/YYYY").toDate(), moment_1.default(body.endDate, "DD/MM/YYYY").toDate());
        }
        res.status(resultCodes.success).send({ success: "success" });
    });
    router
        .route("/verify")
        .post(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, code, user, decoded, _1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    code = body.code;
                    return [4 /*yield*/, model.getUser({ confirmation_code: code })];
                case 1:
                    user = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, jsonwebtoken_1.default.verify(user.confirmation_token, process.env.API_SECRET)];
                case 3:
                    decoded = _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    _1 = _a.sent();
                    return [2 /*return*/, res
                            .status(resultCodes.syntaxError)
                            .send(errorMessages.invalidCode)];
                case 5:
                    if (!user ||
                        user.confirmation_code !== code ||
                        decoded.confirmation_code !== code)
                        return [2 /*return*/, res
                                .status(resultCodes.syntaxError)
                                .send(errorMessages.invalidCode)];
                    return [4 /*yield*/, user_1.default.updateOne({ email: user.email }, { confirmation_token: "", confirmation_code: "" })];
                case 6:
                    _a.sent();
                    res.status(resultCodes.success).json({
                        id: test_1.decrypt(user.id || "", req.userId),
                        name: test_1.decrypt(user.name || "", req.userId),
                        fname: test_1.decrypt(user.fname || "", req.userId),
                        email: test_1.decrypt(user.email || "", req.userId),
                        remoteDay: user.remoteDay,
                        photo: user.photo,
                        start_date: user.start_date,
                        end_date: user.end_date,
                        historical: user.historical
                    });
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * This route is used to assign a place to a user.
     */
    router
        .route("/places/take")
        .post(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, id_place, id_user, place, placeIsAllowed, placeIsAvailable, _a, user, name_1, fname, historical, beginDate;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    body = req.body;
                    if (!body.id_place || !body.id_user) {
                        return [2 /*return*/, res
                                .status(resultCodes.syntaxError)
                                .send(errorMessages.invalidArguments)];
                    }
                    id_place = body.id_place;
                    id_user = test_1.encrypt(body.id_user, req.userId);
                    return [4 /*yield*/, model.getPlaceById(id_place)];
                case 1:
                    place = _b.sent();
                    placeIsAllowed = function (place) { return __awaiter(_this, void 0, void 0, function () {
                        var user;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, model.getUserById(place.id_owner)];
                                case 1:
                                    user = _a.sent();
                                    return [2 /*return*/, (user.start_date &&
                                            user.end_date &&
                                            moment_1.default().isBetween(user.start_date, user.end_date))];
                            }
                        });
                    }); };
                    placeIsAvailable = function (place) { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                _a = !place.using;
                                if (!_a) return [3 /*break*/, 3];
                                _b = !place.semi_flex;
                                if (_b) return [3 /*break*/, 2];
                                return [4 /*yield*/, placeIsAllowed(place)];
                            case 1:
                                _b = (_c.sent());
                                _c.label = 2;
                            case 2:
                                _a = (_b);
                                _c.label = 3;
                            case 3: return [2 /*return*/, _a];
                        }
                    }); }); };
                    _a = place;
                    if (!_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, placeIsAvailable(place)];
                case 2:
                    _a = !(_b.sent());
                    _b.label = 3;
                case 3:
                    if (!_a) return [3 /*break*/, 5];
                    console.log("Place already used");
                    return [4 /*yield*/, model.getUserById(place.id_user)];
                case 4:
                    user = _b.sent();
                    name_1 = test_1.decrypt(user.name || "", req.userId);
                    fname = test_1.decrypt(user.fname || "", req.userId);
                    res.status(resultCodes.serverError).json({
                        name: name_1,
                        fname: fname
                    });
                    return [2 /*return*/];
                case 5: return [4 /*yield*/, model
                        .getUserById(id_user)
                        .then(function (user) { return user.historical; })];
                case 6:
                    historical = _b.sent();
                    beginDate = new Date(Date.now()).toLocaleString();
                    if (!place) {
                        console.log("Place doesn't exist");
                        model.addPlace(id_place, true, id_user);
                    }
                    else {
                        console.log("Place exists and is free");
                        model.updatePlace(id_place, { using: true, id_user: id_user });
                    }
                    model.updateUser(id_user, {
                        id_place: id_place,
                        historical: historical.concat([
                            { id_place: id_place, begin: beginDate, end: "" }
                        ])
                    });
                    res.status(resultCodes.success).send(successMessages.takePlace);
                    return [2 /*return*/];
            }
        });
    }); });
    router
        .route("/places/leave")
        .post(VerifyToken_1.default, function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var body, id_user, historical, endDate;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    body = req.body;
                    if (!body.id_place || !body.id_user) {
                        return [2 /*return*/, res
                                .status(resultCodes.syntaxError)
                                .send(errorMessages.invalidArguments)];
                    }
                    id_user = test_1.encrypt(body.id_user, req.userId);
                    return [4 /*yield*/, model
                            .getUserById(id_user)
                            .then(function (user) { return user.historical; })];
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
    router
        .route("/place/assign")
        .post(VerifyToken_1.default, function (req, res) {
        var body = req.body;
        var id_user = test_1.encrypt(body.id_user, req.userId);
        model.updatePlace(body.id_place, {
            id_owner: id_user,
            semi_flex: true,
            start_date: null,
            end_date: null
        });
        res.status(resultCodes.success).send({ success: "success" });
    });
    router
        .route("/place/unassign")
        .post(VerifyToken_1.default, function (req, res) {
        var body = req.body;
        model.updatePlace(body.id_place, {
            id_owner: "",
            semi_flex: false,
            start_date: null,
            end_date: null
        });
        res.status(resultCodes.success).send({ success: "success" });
    });
    router
        .route("/send-email")
        .post(VerifyToken_1.default, function (req, res) {
        var body = req.body;
        model.sendEmail(body.to, body.subject, body.body);
        res.status(resultCodes.success).send({ success: "success" });
    });
};
exports.default = post;
