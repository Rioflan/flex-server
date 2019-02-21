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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var user_1 = __importDefault(require("../models/user"));
var place_1 = __importDefault(require("../models/place"));
var VerifyToken_1 = __importDefault(require("./VerifyToken"));
var test_1 = require("./test");
var cloudinary_1 = __importDefault(require("cloudinary"));
var HTTPS_REGEX = "^https?://(.*)";
var errorMessages = {
    userCreation: "Error creating the user",
    userFind: "Error finding the user",
    userUpdate: "Error updating the user",
    userIdMatch: "User's ID not matching user's info",
    placeCreation: "Error creating the place",
    placeFind: "Error finding the place",
    placeUpdate: "Error updating the place",
    invalidArguments: "Invalid arguments"
};
var resultCodes = {
    success: 200,
    syntaxError: 400,
    serverError: 500
};
var RES;
var addPlaceLogic = function (id_user, actual_place) {
    if (id_user === null || id_user === "") {
        actual_place.using = false;
        actual_place.id_user = "";
    }
    else {
        actual_place.using = true;
        actual_place.id_user = id_user;
    }
};
var post = function (router) {
    /**
     * This function adds a new user.
     * @param {string} id_user id of the new user
     * @param {string} name name of the new user
     * @param {string} fname first name of the new user
     */
    function addUser(id_user, name, fname) {
        var user = new user_1.default();
        user.id = id_user;
        user.name = name;
        user.fname = fname;
        user.save(function (err) {
            if (err)
                RES.status(resultCodes.serverError).send(errorMessages.userCreation);
            console.log("User created");
        });
    }
    /**
     * This function updates an existing user.
     * @param {string} id_user id of the user
     * @param {object} params list of fields to be updated
     */
    function updateUser(id_user, params) {
        user_1.default.updateOne({ id: id_user }, params, function (err) {
            if (err)
                console.log(err);
            console.log("User updated");
        });
    }
    /**
     * This function uploads and then updates a user's photo
     * @param id_user id of the user
     * @param photo base64 image
     */
    function updatePhoto(id_user, photo) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, uploadPhoto(photo)];
                    case 1:
                        url = _a.sent();
                        updateUser(id_user, { photo: url });
                        return [2 /*return*/];
                }
            });
        });
    }
    /**
     * This function uploads a photo and returns its url
     * @param photo base64 image
     * @returns the url of the uploaded image
     */
    function uploadPhoto(photo) {
        return cloudinary_1.default.uploader
            .upload("data:image/jpeg;base64," + photo)
            .then(function (result) { return result.secure_url; })
            .catch(function (error) { return console.log(error); });
    }
    /**
     * This function adds a new place.
     * @param {string} id_place id of the new place
     */
    function addPlace(id_place) {
        var place = new place_1.default();
        place.id = id_place;
        place.save(function (err) {
            if (err)
                RES.status(resultCodes.serverError).send(errorMessages.placeCreation);
            console.log("Place created");
        });
    }
    /**
     * This function updates an existing place.
     * @param {string} id_place id of the place
     * @param {object} params list of fields to be updated
     */
    function updatePlace(id_place, // should only be string, will be fixed
    params) {
        place_1.default.updateOne({ id: id_place }, params, function (err) {
            if (err)
                console.log(err);
            console.log("Place updated");
        });
    }
    /**
     * This function is used to get a user document from the database.
     * @param id_user the id of the user
     * @returns an object containing the fields of the user if found, else null
     */
    var getUserById = function (id_user) { return user_1.default.findOne({ id: id_user }).then(function (user) { return user; }); };
    /**
     * This function states whether a user is already registered in the database,
     * based on their id.
     * @param id_user the id of the user
     */
    function userExists(id_user) {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, getUserById(id_user)];
                    case 1:
                        user = _a.sent();
                        if (user)
                            return [2 /*return*/, true];
                        return [2 /*return*/, false];
                }
            });
        });
    }
    /**
     * This function checks if the info entered when logging in match
     * the info saved in the database.
     * @param user the user from the database
     * @param info the user entered in login form
     */
    function matchUserInfo(user, info) {
        if (user.fname !== info.fname || user.name !== info.name)
            return false;
        return true;
    }
    /**
     * This function is used to know if a place exists and who uses it.
     * @param {string} id_place id of the current place
     */
    function whoUses(id_place) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            place_1.default.findOne({ id: id_place }, function (err, place) {
                                if (err)
                                    RES.status(resultCodes.serverError).send(errorMessages.placeFind);
                                else if (place !== null)
                                    resolve(place.id_user); // "" => not used, "NAME" => used by NAME
                                else
                                    resolve("#"); // place not exists
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    /**
     * This function is used to know where the provided user is seated.
     * @param {string} id_place id of the current user
     */
    function whereSit(id_user) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            user_1.default.findOne({ id: id_user }, null, { sort: { _id: -1 } }, function (err, user) {
                                if (err)
                                    RES.status(resultCodes.serverError).send(errorMessages.userFind);
                                else if (user !== null) {
                                    var userEnd = user.historical.length > 0
                                        ? ramda_1.pick(["end"], ramda_1.last(user.historical))
                                        : "";
                                    if (userEnd.end === "")
                                        resolve(user.id_place);
                                    else
                                        resolve("");
                                }
                                else
                                    resolve("#");
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    }
    /**
     * This function handle all the post requests.
     * @param {object} body current payload of the request
     */
    function post(body) {
        return __awaiter(this, void 0, void 0, function () {
            var userSit, user, beginDate, userUsedName, indexUser, endDate, endDate, indexUser;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, whereSit(body.id_user)];
                    case 1:
                        userSit = _a.sent();
                        return [4 /*yield*/, whoUses(body.id_place)];
                    case 2:
                        user = _a.sent();
                        if (!(body.id_place !== "")) return [3 /*break*/, 10];
                        if (!(userSit === "#" || userSit === "")) return [3 /*break*/, 8];
                        beginDate = new Date(Date.now()).toLocaleString();
                        if (!(user === "#")) return [3 /*break*/, 3];
                        //  not exists or not sit
                        console.log("NOT EXISTS");
                        updateUser(body.id_user, {
                            id_place: body.id_place,
                            historical: ramda_1.append({ place_id: body.id_place, begin: beginDate, end: "" }, body.historical),
                            name: body.name,
                            fname: body.fname,
                            remoteDay: body.remoteDay || null,
                            photo: body.photo || ""
                        });
                        //  not exists
                        console.log("PLACE NOT EXISTS");
                        addPlace(body.id_place); // here the place is not set as used, will be fixed next commit
                        return [3 /*break*/, 7];
                    case 3:
                        if (!(user === "")) return [3 /*break*/, 4];
                        updateUser(body.id_user, {
                            id_place: body.id_place,
                            historical: ramda_1.append({ place_id: body.id_place, begin: beginDate, end: "" }, body.historical),
                            name: body.name,
                            fname: body.fname,
                            remoteDay: body.remoteDay || null,
                            photo: body.photo || ""
                        });
                        //  place empty
                        console.log("EMPTY PLACE");
                        updatePlace(body.id_place, {
                            using: true,
                            id_user: body.id_user
                        });
                        return [3 /*break*/, 7];
                    case 4:
                        console.log("PLACE USED BY: " + user);
                        return [4 /*yield*/, user_1.default.findOne({ id: user }, function (err, placeUser) {
                                return placeUser;
                            })];
                    case 5:
                        userUsedName = _a.sent();
                        return [4 /*yield*/, userUsedName.name];
                    case 6: return [2 /*return*/, _a.sent()];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        console.log("SIT");
                        if (userSit === body.id_place) {
                            indexUser = ramda_1.findLastIndex(ramda_1.propEq("place_id", body.id_place))(body.historical);
                            endDate = new Date(Date.now()).toLocaleString();
                            updateUser(body.id_user, {
                                historical: ramda_1.update(indexUser, {
                                    place_id: body.id_place,
                                    begin: body.historical[indexUser].begin,
                                    end: endDate
                                }, body.historical),
                                id_place: "",
                                name: body.name,
                                fname: body.fname,
                                remoteDay: body.remoteDay || null,
                                photo: body.photo || ""
                            });
                            updatePlace(body.id_place, { using: false, id_user: "" });
                        } //  user is sit somewhere and move to another place
                        else {
                            endDate = new Date(Date.now()).toLocaleString();
                            indexUser = ramda_1.findLastIndex(ramda_1.propEq("place_id", body.id_place))(body.historical);
                            updateUser(body.id_user, {
                                historical: ramda_1.update(indexUser, {
                                    place_id: body.id_place,
                                    begin: body.historical[indexUser].begin,
                                    end: endDate
                                }, body.historical),
                                name: body.name,
                                fname: body.fname,
                                remoteDay: body.remoteDay || null,
                                photo: body.photo || null
                            }); //  the other user leaves
                            updatePlace(userSit, { using: false, id_user: "" }); // updates the old user place
                            updatePlace(body.id_place, {
                                using: true,
                                id_user: body.id_user
                            }); //  the user is now here
                        }
                        _a.label = 9;
                    case 9: return [3 /*break*/, 11];
                    case 10:
                        updateUser(body.id_user, {
                            historical: body.historical,
                            name: body.name,
                            fname: body.fname,
                            remoteDay: body.remoteDay,
                            photo: body.photo
                        });
                        _a.label = 11;
                    case 11: return [2 /*return*/];
                }
            });
        });
    }
    /**
     * This route handle all the post requests.
     */
    router
        .route("/")
        .post(VerifyToken_1.default, function (req, res) {
        RES = res;
        var body = req.body;
        if (body.id_place === null ||
            body.name === null ||
            body.fname === null ||
            body.id_user === null)
            return RES.status(resultCodes.syntaxError).send(errorMessages.invalidArguments);
        body.id_user = test_1.encrypt(body.id_user, req.userId);
        body.name = test_1.encrypt(body.name, req.userId);
        body.fname = test_1.encrypt(body.fname, req.userId);
        post(body).then(function (element) {
            element && typeof element === "string"
                ? RES.status(resultCodes.success).json({
                    body: test_1.decrypt(element, req.userId)
                })
                : RES.status(resultCodes.success).json({ result: "User Updated" });
        });
    });
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
                    return [4 /*yield*/, userExists(body.id_user)];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, getUserById(body.id_user)];
                case 2:
                    user = _a.sent();
                    return [4 /*yield*/, matchUserInfo(user, body)];
                case 3:
                    if (_a.sent())
                        res.status(resultCodes.success).send({ user: user });
                    else
                        res.status(resultCodes.serverError).send(errorMessages.userIdMatch);
                    return [3 /*break*/, 5];
                case 4:
                    addUser(body.id_user, body.name, body.fname);
                    res.status(resultCodes.success).json({ result: "User Added" });
                    _a.label = 5;
                case 5: return [2 /*return*/];
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
            updatePhoto(id_user, body.photo);
        if (body.remoteDay !== "")
            updateUser(id_user, { remoteDay: body.remoteDay });
        res.status(resultCodes.success).send({ success: "success" });
    });
};
exports.default = post;
