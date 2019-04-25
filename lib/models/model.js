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
var user_1 = __importDefault(require("../models/user"));
var place_1 = __importDefault(require("../models/place"));
var cloudinary_1 = __importDefault(require("cloudinary"));
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
    return user.save()
        .then(function (user, err) {
        if (err)
            console.log(err);
        else
            console.log("User created");
    });
}
exports.addUser = addUser;
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
exports.updatePhoto = updatePhoto;
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
exports.uploadPhoto = uploadPhoto;
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
    return place.save()
        .then(function (place, err) {
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
exports.getPlaceById = function (id_place) { return place_1.default.findOne({ id: id_place }); };
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
