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
var mongodb_memory_server_1 = require("mongodb-memory-server");
var mongoose_1 = __importDefault(require("mongoose"));
var assert_1 = __importDefault(require("assert"));
var model = __importStar(require("../models/model"));
jest.mock('cloudinary');
var mockDB;
describe('Testing models', function () {
    beforeAll(function () { return __awaiter(_this, void 0, void 0, function () {
        var uri;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mockDB = new mongodb_memory_server_1.MongoMemoryServer();
                    return [4 /*yield*/, mockDB.getConnectionString()];
                case 1:
                    uri = _a.sent();
                    return [4 /*yield*/, mongoose_1.default.connect(uri, { useNewUrlParser: true })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    describe('Users collection', function () {
        it('adds a new user', function () { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.addUser('a@a.com', 'AA00000', 'Name', 'Fname')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, model.getUserById('AA00000')];
                    case 2:
                        user = _a.sent();
                        assert_1.default(user);
                        return [2 /*return*/];
                }
            });
        }); });
        it('updates a user', function () { return __awaiter(_this, void 0, void 0, function () {
            var name;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model.updateUser('AA00000', { name: 'OtherName' });
                        return [4 /*yield*/, model.getUserById('AA00000').then(function (user) { return user.name; })];
                    case 1:
                        name = _a.sent();
                        assert_1.default.equal(name, 'OtherName');
                        return [2 /*return*/];
                }
            });
        }); });
        it('updates many users', function () { return __awaiter(_this, void 0, void 0, function () {
            var nameA, nameB;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.addUser('b@a.com', 'AA00001', 'Name', 'Fname')];
                    case 1:
                        _a.sent();
                        model.updateManyUsers({ id: /AA0000\d/ }, { name: 'OtherName' });
                        return [4 /*yield*/, model.getUserById('AA00000').then(function (user) { return user.name; })];
                    case 2:
                        nameA = _a.sent();
                        return [4 /*yield*/, model.getUserById('AA00001').then(function (user) { return user.name; })];
                    case 3:
                        nameB = _a.sent();
                        assert_1.default.equal(nameA, 'OtherName');
                        assert_1.default.equal(nameA, 'OtherName');
                        return [2 /*return*/];
                }
            });
        }); });
        it('gets a user by ID', function () { return __awaiter(_this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.getUserById('AA00000')];
                    case 1:
                        user = _a.sent();
                        assert_1.default(user);
                        return [2 /*return*/];
                }
            });
        }); });
        it('gets all users', function () { return __awaiter(_this, void 0, void 0, function () {
            var users;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.getUsers()];
                    case 1:
                        users = _a.sent();
                        assert_1.default(users);
                        return [2 /*return*/];
                }
            });
        }); });
        it('checks user existence', function () { return __awaiter(_this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = assert_1.default;
                        return [4 /*yield*/, model.userExists('AA00000')];
                    case 1:
                        _a.apply(void 0, [_c.sent()]);
                        _b = assert_1.default;
                        return [4 /*yield*/, model.userExists('BB11111')];
                    case 2:
                        _b.apply(void 0, [!(_c.sent())]);
                        return [2 /*return*/];
                }
            });
        }); });
        // Need to update the tests for image upload
        // it('updates a photo', async () => {
        //   const imgUrl =        'https://mlpforums.com/uploads/monthly_10_2013/post-18536-0-17144400-1381282031.jpg';
        //   cloudinary.uploader = {
        //     upload: jest.fn(
        //       () => new Promise(resolve => resolve({ secure_url: imgUrl })),
        //     ),
        //   };
        //   await model.updatePhoto('AA00000', imgUrl);
        //   const photo = await model.getUserById('AA00000').then(user => user.photo);
        //   assert.equal(photo, imgUrl);
        // });
        // it('uploads a photo', async () => {
        //   const imgUrl =        'https://mlpforums.com/uploads/monthly_10_2013/post-18536-0-17144400-1381282031.jpg';
        //   const mock = jest.fn(
        //     () => new Promise(resolve => resolve({ secure_url: imgUrl })),
        //   );
        //   cloudinary.uploader = {
        //     upload: mock,
        //   };
        //   model.uploadPhoto('testID', imgUrl);
        //   assert.equal(mock.mock.calls.length, 1);
        //   assert.equal(mock.mock.calls[0][0], 'data:image/jpeg;base64,' + imgUrl);
        //   const mock2 = jest.fn(() => new Promise((_, reject) => reject()));
        //   cloudinary.uploader = {
        //     upload: mock2,
        //   };
        //   model.uploadPhoto('testID', imgUrl);
        //   assert.equal(mock2.mock.calls.length, 1);
        //   assert.equal(mock2.mock.calls[0][0], 'data:image/jpeg;base64,' + imgUrl);
        // });
        it('matches user info', function () { return __awaiter(_this, void 0, void 0, function () {
            var user, info, info2, info3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model.updateUser('AA00000', {
                            fname: 'a',
                            name: 'a',
                        });
                        return [4 /*yield*/, model.getUserById('AA00000')];
                    case 1:
                        user = _a.sent();
                        info = {
                            fname: 'a',
                            name: 'a',
                        };
                        info2 = {
                            fname: 'a',
                            name: 'b',
                        };
                        info3 = {
                            fname: 'b',
                            name: 'b',
                        };
                        assert_1.default(model.matchUserInfo(user, info));
                        assert_1.default(!model.matchUserInfo(user, info2));
                        assert_1.default(!model.matchUserInfo(user, info3));
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('Places collection', function () {
        it('adds a new place', function () { return __awaiter(_this, void 0, void 0, function () {
            var place, placeB;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.addPlace('JO-4-V-RER10')];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, model.getPlaceById('JO-4-V-RER10')];
                    case 2:
                        place = _a.sent();
                        assert_1.default(place);
                        return [4 /*yield*/, model.addPlace('JO-5-V-RER10', true, 'AB12345')];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, model.getPlaceById('JO-5-V-RER10')];
                    case 4:
                        placeB = _a.sent();
                        assert_1.default(placeB);
                        return [2 /*return*/];
                }
            });
        }); });
        it('updates a place', function () { return __awaiter(_this, void 0, void 0, function () {
            var place;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        model.updatePlace('JO-4-V-RER10', { using: true, id_user: 'AA00000' });
                        return [4 /*yield*/, model
                                .getPlaceById('JO-4-V-RER10')
                                .then(function (place) { return ({ using: place.using, id_user: place.id_user }); })];
                    case 1:
                        place = _a.sent();
                        assert_1.default.deepEqual(place, { using: true, id_user: 'AA00000' });
                        return [2 /*return*/];
                }
            });
        }); });
        it('gets a place by ID', function () { return __awaiter(_this, void 0, void 0, function () {
            var place;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.getPlaceById('JO-4-V-RER10')];
                    case 1:
                        place = _a.sent();
                        assert_1.default(place);
                        return [2 /*return*/];
                }
            });
        }); });
        it('gets all places', function () { return __awaiter(_this, void 0, void 0, function () {
            var places;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.getPlaces()];
                    case 1:
                        places = _a.sent();
                        assert_1.default(places);
                        return [2 /*return*/];
                }
            });
        }); });
        it('gets the user using a place', function () { return __awaiter(_this, void 0, void 0, function () {
            var id_user, noOne, sharp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.whoUses('JO-4-V-RER10')];
                    case 1:
                        id_user = _a.sent();
                        assert_1.default.equal(id_user, 'AA00000');
                        model.updatePlace('JO-4-V-RER10', { using: false, id_user: '' });
                        return [4 /*yield*/, model.whoUses('JO-4-V-RER10')];
                    case 2:
                        noOne = _a.sent();
                        assert_1.default(!noOne);
                        return [4 /*yield*/, model.whoUses('WrongID')];
                    case 3:
                        sharp = _a.sent();
                        assert_1.default.equal(sharp, '#');
                        return [2 /*return*/];
                }
            });
        }); });
        it('resets places', function () { return __awaiter(_this, void 0, void 0, function () {
            var mockB, mockA, websocket, pooledUsers, places, _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, model.addPlace('JO-4-V-RER11')];
                    case 1:
                        _c.sent();
                        model.updatePlace('JO-4-V-RER11', { using: true, id_user: 'AA00000' });
                        return [4 /*yield*/, model.addPlace('JO-4-V-RER12')];
                    case 2:
                        _c.sent();
                        model.updatePlace('JO-4-V-RER12', { using: true, id_user: 'AA00001' });
                        mockB = jest.fn();
                        mockA = jest.fn(function () { return ({ emit: mockB }); });
                        websocket = {
                            sockets: {
                                adapter: {
                                    rooms: {
                                        'JO-4-V-RER11': true,
                                        'JO-4-V-RER12': false,
                                    },
                                },
                            },
                            in: mockA,
                        };
                        return [4 /*yield*/, model.getPooledUsers()];
                    case 3:
                        pooledUsers = _c.sent();
                        return [4 /*yield*/, model.resetPlaces(websocket, pooledUsers)];
                    case 4:
                        _c.sent();
                        assert_1.default.equal(mockA.mock.calls.length, 1);
                        assert_1.default.equal(mockB.mock.calls.length, mockA.mock.calls.length);
                        assert_1.default.equal(mockA.mock.calls[0][0], 'JO-4-V-RER11');
                        assert_1.default.equal(mockB.mock.calls[0][0], 'leavePlace');
                        return [4 /*yield*/, model.getPlaces()];
                    case 5:
                        places = _c.sent();
                        assert_1.default(!places.some(function (x) { return x.using; }));
                        _a = assert_1.default;
                        return [4 /*yield*/, model.getUserById('AA00000')];
                    case 6:
                        _a.apply(void 0, [!(_c.sent()).pool]);
                        _b = assert_1.default;
                        return [4 /*yield*/, model.getUserById('AA00001')];
                    case 7:
                        _b.apply(void 0, [(_c.sent()).pool]);
                        assert_1.default.equal(pooledUsers[pooledUsers.length - 1], 'AA00001');
                        return [2 /*return*/];
                }
            });
        }); });
        it('gets all pooled users', function () { return __awaiter(_this, void 0, void 0, function () {
            var pooledUsers;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, model.getPooledUsers()];
                    case 1:
                        pooledUsers = _a.sent();
                        assert_1.default(pooledUsers);
                        return [2 /*return*/];
                }
            });
        }); });
    });
    afterAll(function () {
        mongoose_1.default.disconnect();
        mockDB.stop();
    });
});
