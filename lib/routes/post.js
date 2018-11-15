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
Object.defineProperty(exports, "__esModule", { value: true });
var ramda_1 = require("ramda");
var user_1 = __importDefault(require("../models/user"));
var place_1 = __importDefault(require("../models/place"));
var VerifyToken_1 = __importDefault(require("./VerifyToken"));
var test_1 = require("./test");
var RES;
var addPlaceLogic = function (id_user, actual_place) {
    if (id_user === null || id_user === '') {
        actual_place.using = false;
        actual_place.id_user = '';
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
     * @param {string} fname family Name of the new user
     * @param {string} id_place place of the new user
     */
    function addUser(id_user, name, fname, id_place) {
        var actual_user = new user_1.default();
        actual_user.id = id_user;
        actual_user.name = name;
        actual_user.fname = fname;
        actual_user.id_place = id_place;
        actual_user.historical = [];
        actual_user.isRemote = false;
        actual_user.save(function (err) {
            if (err)
                RES.status(500).send(err);
            console.log('User created');
        });
    }
    /**
     * This function update a user.
     * @param {string} id_user id of the user
     * @param {object} params list of parameters
     */
    function updateUser(id_user, params) {
        user_1.default.findOne({ id: id_user }, null, { sort: { _id: -1 } }, function (err, user) {
            if (err)
                RES.status(500).send(err);
            var actual_user = user;
            console.log(actual_user, params, actual_user.historical, params.historical);
            if (params.historical !== [])
                actual_user.historical = params.historical;
            if (params.name !== null)
                actual_user.name = params.name;
            if (params.fname !== null)
                actual_user.fname = params.fname;
            if (params.id_place !== null)
                actual_user.id_place = params.id_place;
            actual_user.isRemote = params.isRemote;
            actual_user.save(function (err) {
                if (err)
                    RES.status(500).send(err);
            });
        });
    }
    /**
     * This function adds a new place.
     * @param {string} id_place id of the new place
     * @param {string} id_user id of the user
     */
    function addPlace(id_place, id_user) {
        console.log('Create place:');
        var actual_place = new place_1.default();
        actual_place.id = id_place;
        addPlaceLogic(id_user, actual_place);
        actual_place.save(function (err) {
            if (err)
                RES.status(500).send(err);
            console.log('Place Created');
        });
    }
    /**
     * This function update a place.
     * @param {string} id_place id of the current place
     * @param {object} params list of parameters
     */
    function updatePlace(id_place, params) {
        place_1.default.findOne({ id: id_place }, function (err, place) {
            if (err)
                RES.status(500).send(err);
            if (params.using !== null)
                place.using = params.using;
            if (params.id_user !== null)
                place.id_user = params.id_user;
            place.save(function (err) {
                if (err)
                    RES.status(500).send(err);
                console.log('Place Updated');
            });
        });
    }
    var isUserExists = function (body) {
        user_1.default.findOne({ id: body.id_user }, null, { sort: { _id: -1 } }, function (err, user) {
            if (err)
                return RES.status(500).send('Error on the server.');
            if (!user) {
                var id_user = body.id_user, name_1 = body.name, fname = body.fname;
                addUser(id_user, name_1, fname, '');
                console.log('NOT EXISTS');
                return RES.status(200).json({ result: 'User Added' });
            }
            if (user)
                return RES.status(200).send({ user: user });
            // if (user) return res.status(200).send(user);
        });
    };
    /**
     * This function is used to know if a place exists and who.
     * @param {string} id_place id of the current place
     */
    function whoUses(id_place) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve, reject) {
                            place_1.default.findOne({ id: id_place }, function (err, place) {
                                if (!err && place !== null)
                                    resolve(place.id_user);
                                // "" => not used, "NAME" => used by NAME
                                else
                                    resolve('#'); // place not exists
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
                                if (!err && user !== null) {
                                    var userEnd = user.historical.length > 0
                                        ? ramda_1.pick(['end'], ramda_1.last(user.historical))
                                        : '';
                                    if (userEnd.end === '')
                                        resolve(user.id_place);
                                    else
                                        resolve('');
                                }
                                else
                                    resolve('#');
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
                            isRemote: body.isRemote
                        });
                        //  not exists
                        console.log("PLACE NOT EXISTS");
                        addPlace(body.id_place, body.id_user);
                        return [3 /*break*/, 7];
                    case 3:
                        if (!(user === "")) return [3 /*break*/, 4];
                        updateUser(body.id_user, {
                            id_place: body.id_place,
                            historical: ramda_1.append({ place_id: body.id_place, begin: beginDate, end: "" }, body.historical),
                            name: body.name,
                            fname: body.fname,
                            isRemote: body.isRemote
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
                                name: body.name,
                                fname: body.fname,
                                isRemote: body.isRemote
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
                                isRemote: body.isRemote
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
                            isRemote: body.isRemote
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
        if (body.id_place === null || body.name === null || body.fname === null || body.id_user === null)
            return RES.status(400).json({ error: "Invialid arguments" });
        body.id_user = test_1.encrypt(body.id_user, req.userId);
        body.name = test_1.encrypt(body.name, req.userId);
        body.fname = test_1.encrypt(body.fname, req.userId);
        post(body).then(function (element) {
            element && typeof element === 'string' ? RES.status(200).json({
                body: test_1.decrypt(element, req.userId)
            }) : RES.status(200).json({ result: "User Updated" });
        });
    });
    /**
     * This route is used to handle users login.
     */
    router
        .route('/login_user')
        .post(VerifyToken_1.default, function (req, res) {
        var body = req.body;
        RES = res;
        if (body.name === null || body.fname === null || body.id_user === null || body.id_user.match(process.env.LOGIN_REGEX) === null)
            return RES.status(400).json({ error: 'Invialid arguments' });
        body.id_user = test_1.encrypt(body.id_user, req.userId);
        body.name = test_1.encrypt(body.name, req.userId);
        body.fname = test_1.encrypt(body.fname, req.userId);
        // Check if the user exists
        isUserExists(body);
    });
};
exports.default = post;
