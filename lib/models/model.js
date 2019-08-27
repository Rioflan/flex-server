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
var node_fetch_1 = __importDefault(require("node-fetch"));
var crypto_1 = __importDefault(require("crypto"));
var azure_storage_1 = __importDefault(require("azure-storage"));
var user_1 = __importDefault(require("../models/user"));
var place_1 = __importDefault(require("../models/place"));
/**
 * This function adds a new user.
 * @param {string} email email of the new user
 */
function addUser(email, id, name, fname) {
    var user = new user_1.default();
    user.email = email;
    if (id)
        user.id = id;
    if (name)
        user.name = name;
    if (fname)
        user.fname = fname;
    return user.save().then(function (user, err) {
        if (err)
            console.log(err);
        else
            console.log("User created");
    });
}
exports.addUser = addUser;
/**
 * This function removes a user.
 * @param {string} id_user id of the new user
 */
function removeUser(params) {
    return user_1.default.deleteOne(params);
}
exports.removeUser = removeUser;
/**
 * This function removes a user.
 * @param {string} id_user id of the new user
 */
function removeUserById(id_user) {
    return user_1.default.deleteOne({ id: id_user });
}
exports.removeUserById = removeUserById;
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
exports.updateUser = updateUser;
/**
 * This function updates several existing users.
 * @param {object} conditions conditions for the users to be updated (e.g. { id: "foo" })
 * @param {object} params list of fields to be updated
 */
function updateManyUsers(conditions, params) {
    user_1.default.updateMany(conditions, params, function (err) {
        if (err)
            console.log(err);
        console.log("Updated users matching condition " + JSON.stringify(conditions, null, 2));
    });
}
exports.updateManyUsers = updateManyUsers;
/**
 * This function is used to get a user document from the database.
 * @param id_user the id of the user
 * @returns an object containing the fields of the user if found, else null
 */
exports.getUserById = function (id_user) { return user_1.default.findOne({ id: id_user }); };
/**
 * This function is used to get a user document from the database.
 * @param params the query params
 * @returns an object containing the fields of the user if found, else null
 */
exports.getUser = function (params) { return user_1.default.findOne(params); };
/**
 * This function is used to get all the users from the database.
 * @returns an array containing objects with the fields of the users
 */
exports.getUsers = function () { return user_1.default.find({}); };
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
                case 0: return [4 /*yield*/, exports.getUserById(id_user)];
                case 1:
                    user = _a.sent();
                    if (user)
                        return [2 /*return*/, true];
                    return [2 /*return*/, false];
            }
        });
    });
}
exports.userExists = userExists;
/**
 * This function uploads a photo and returns its url
 * @param photo base64 image
 * @param id_user string user id
 * @returns the url of the uploaded image
 */
function uploadPhoto(id_user, photo) {
    return __awaiter(this, void 0, void 0, function () {
        var container_name, token, blob_name, blobService, random, hash, data_photo, matches, type, buffer;
        return __generator(this, function (_a) {
            container_name = process.env.AZURE_STORAGE_CONTAINER_NAME;
            token = process.env.AZURE_STORAGE_TOKEN;
            blob_name = process.env.AZURE_STORAGE_BLOB_NAME;
            blobService = azure_storage_1.default.createBlobService(container_name, token);
            random = Math.random().toString();
            hash = crypto_1.default
                .createHash("md5")
                .update(id_user + random)
                .digest("hex") + ".jpeg";
            data_photo = photo.includes("data:image/jpeg;base64,")
                ? photo
                : "data:image/jpeg;base64,".concat(photo);
            matches = data_photo.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            type = matches[1];
            buffer = new Buffer.from(matches[2], "base64");
            blobService.createBlockBlobFromText(blob_name, hash, buffer, { contentType: type }, function (error, result, response) {
                if (!error) {
                    var sasUrl = blobService.getUrl(blob_name, hash);
                    console.log(sasUrl);
                    updateUser(id_user, { photo: sasUrl });
                }
                console.log(error);
            });
            return [2 /*return*/];
        });
    });
}
exports.uploadPhoto = uploadPhoto;
/**
 * This function uploads and then updates a user's photo
 * @param id_user id of the user
 * @param photo base64 image
 */
function updatePhoto(id_user, photo) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                uploadPhoto(id_user, photo);
            }
            catch (err) {
                console.log(err);
            }
            return [2 /*return*/];
        });
    });
}
exports.updatePhoto = updatePhoto;
/**
 * This function checks if the info entered when logging in match
 * the info saved in the database.
 * @param user the user from the database
 * @param info the user entered in login form
 */
function matchUserInfo(user, info) {
    return user.fname === info.fname && user.name === info.name;
}
exports.matchUserInfo = matchUserInfo;
/**
 * This function adds a new place.
 * @param {string} id_place id of the new place
 * @param {boolean} using whether the place must be set as used or not
 * @param {string} id_user id of the user in case the place is set as used
 */
function addPlace(id_place, using, id_user) {
    if (using === void 0) { using = false; }
    if (id_user === void 0) { id_user = ""; }
    var place = new place_1.default();
    place.id = id_place;
    place.using = using;
    place.id_user = id_user;
    return place.save().then(function (place, err) {
        if (err)
            console.log(err);
        console.log("Place created");
    });
}
exports.addPlace = addPlace;
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
exports.updatePlace = updatePlace;
/**
 * This function is used to get a place document from the database.
 * @param id_place the id of the place
 * @returns an object containing the fields of the place if found, else null
 */
exports.getPlaceById = function (id_place) {
    return place_1.default.findOne({ id: id_place });
};
/**
 * This function is used to get all the places from the database.
 * @returns an array containing objects with the fields of the places
 */
exports.getPlaces = function () { return place_1.default.find({}); };
/**
 * This function is used to know if a place exists and who uses it.
 * @param {string} id_place id of the current place
 */
function whoUses(id_place) {
    return __awaiter(this, void 0, void 0, function () {
        var place;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.getPlaceById(id_place)];
                case 1:
                    place = _a.sent();
                    if (place)
                        return [2 /*return*/, place.id_user]; // will return "" if not used, or user's id if used
                    return [2 /*return*/, "#"];
            }
        });
    });
}
exports.whoUses = whoUses;
/**
 * This function is used to set all the places to free
 * and all the users to not seated.
 * @param websocket the sockets to use to make the connection between client and server
 * @param {Array<string>} pool the pool array to fill in case a user is disconnected
 */
function resetPlaces(websocket, pool) {
    return __awaiter(this, void 0, void 0, function () {
        var places, length, index, place, userConnected;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, exports.getPlaces()];
                case 1:
                    places = _a.sent();
                    length = places.length;
                    for (index = 0; index < length; index++) {
                        place = places[index];
                        if (place.using === true) {
                            userConnected = websocket.sockets.adapter.rooms[place.id];
                            if (userConnected)
                                websocket.in(place.id).emit("leavePlace");
                            else {
                                pool.push(place.id_user);
                                updateUser(place.id_user, { pool: true });
                                console.log("User " + place.id_user + " added to pool");
                            }
                            updatePlace(place.id, { using: false, id_user: "" }); // set the place free
                        }
                    }
                    // Update all seated users
                    updateManyUsers({ id_place: { $ne: "" } }, { id_place: "" });
                    return [2 /*return*/];
            }
        });
    });
}
exports.resetPlaces = resetPlaces;
/**
 * This function is used to get all the users of the database's pool.
 * @returns an array of string containing the id of the users
 */
exports.getPooledUsers = function () {
    return user_1.default.find({ pool: true }).then(function (pooledUsers) {
        return pooledUsers.map(function (pooledUser) { return pooledUser.id; });
    });
};
/**
 * This function updates the period during which the user's place is available.
 * @param {string} id_user id of the user
 * @param {Date} start_date date when the period begins
 * @param {Date} end_date date when the period ends
 */
exports.updateAvailabilityPeriod = function (id_user, start_date, end_date) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        updateUser(id_user, { start_date: start_date, end_date: end_date });
        return [2 /*return*/];
    });
}); };
var NB_REMOTE_DAYS_ALLOWED = 2;
/**
 * This function user's remote days.
 * @param {string} id_user id of the user
 * @param {Array<string>} days days when the user works remotely
 */
exports.updateRemoteDays = function (id_user, days) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        if (!id_user ||
            !days ||
            days.length > NB_REMOTE_DAYS_ALLOWED ||
            days.some(function (x) { return !x; })) {
            return [2 /*return*/];
        }
        updateUser(id_user, { remoteDay: days });
        return [2 /*return*/];
    });
}); };
/**
 * This function sends an email
 * @param {string} to destination email address
 * @param {string} subject subject
 * @param {string} body body
 */
exports.sendEmail = function (to, subject, body) {
    if (!process.env.ZAPIER_URL)
        return;
    node_fetch_1.default(process.env.ZAPIER_URL, {
        method: "POST",
        body: JSON.stringify({
            emailTo: to,
            Subject: subject,
            Body: body
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).catch(function (err) { return console.log(err); });
};
exports.sendConfirmationEmail = function (user) {
    var message = "\n    <div>\n        <p style=\"margin:30px; text-align:center; color:#1B3F7B; font-size:18px; font-weight:bold\">Vous souhaitez vous connecter \u00E0 Flex-Office ?</p>\n        <p style=\"margin:30px;text-align:center; color:#1B3F7B; font-size:13px\">Veuillez r\u00E9cup\u00E9rer le code de v\u00E9rification suivant pour finaliser votre connexion :</p>\n        <p style=\"margin:30px; text-align:center; font-size: 20px; font-weight:bold; color:#E64417\">" + user.confirmation_code + "</p\n        <div style=\"margin:30px; width: 386px; text-align:center; margin:auto\">\n            <p style=\"margin:30px; font-size:12px; color:#8FA1BE; text-align:center\">Veuillez ne pas r\u00E9pondre \u00E0 cet e-mail.</p>\n            <p style=\"margin:30px; font-size:12px; color:#8FA1BE; text-align:center\">Cet e-mail a \u00E9t\u00E9 envoy\u00E9 automatiquement par l\u2019application FlexOffice de la BRED Banque Populaire.</p\n        </div>\n        <p style=\"text-align: center; color:#1B3F7B; font-weight: bold; font-size:14px\">Nous contacter ? </p>\n        <p style=\"text-align: center; font-weight:bold; font-size:12px; color:#8FA1BE\">\n            Envoyer un mail \u00E0 <a style=\"font-weight:bold; font-size:12px; color:#8FA1BE\" href=\"mailto:it-factory@bred.fr\">it-factory@bred.fr</a>\n        </p>\n    </div>\n    ";
    exports.sendEmail(user.email, "FlexOffice : Code d’inscription", message);
};
exports.generateConfirmationCode = function () {
    return parseInt(crypto_1.default.randomBytes(3).toString("hex"), 16)
        .toString()
        .substr(0, 6);
};
