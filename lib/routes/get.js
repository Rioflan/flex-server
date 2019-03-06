"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var user_1 = __importDefault(require("../models/user"));
var place_1 = __importDefault(require("../models/place"));
var VerifyToken_1 = __importDefault(require("./VerifyToken"));
var test_1 = require("./test");
var Get = function (router) {
    /** GET /users => {name, fname, id_place} */
    router.route("/users").get(VerifyToken_1.default, function (req, res) {
        user_1.default.find({}, null, function (err, users) {
            if (err)
                res.status(400).send(err);
            var usersDecrypted = users.map(function (e) {
                return {
                    id: e.id,
                    name: test_1.decrypt(e.name, req.userId),
                    fname: test_1.decrypt(e.fname, req.userId),
                    id_place: e.id_place || null,
                    remoteDay: e.remoteDay,
                    photo: e.photo
                };
            });
            res.status(200).json(usersDecrypted);
        });
    });
    router
        .route("/users/:user_id/friends")
        .get(VerifyToken_1.default, function (req, res) {
        var query = {};
        query.id = test_1.encrypt(req.params.user_id, req.userId);
        user_1.default.find(query, function (err, user) {
            if (err)
                res.status(400).send(err);
            console.log(user);
            var friendsID = user[0].friend.map(function (e) { return e.id; });
            user_1.default.find({ 'id': { $in: friendsID } }, function (err, friendList) {
                if (err)
                    res.status(400).send(err);
                var usersDecrypted = friendList.map(function (e) {
                    return {
                        id: e.id,
                        name: test_1.decrypt(e.name, req.userId),
                        fname: test_1.decrypt(e.fname, req.userId),
                        id_place: e.id_place || null,
                        remoteDay: e.remoteDay,
                        photo: e.photo
                    };
                });
                res.status(200).json(usersDecrypted);
            });
        });
    });
    /** GET /users/:user_id */
    router
        .route("/users/:user_id")
        .get(VerifyToken_1.default, function (req, res) {
        var query = {};
        query.id = test_1.encrypt(req.params.user_id, req.userId);
        user_1.default.findOne(query, function (err, user) {
            if (err)
                res.status(400).send(err);
            res.status(200).json(user);
        });
    });
    /** GET /users/:user_id/last */
    router
        .route("/users/:user_id/last")
        .get(VerifyToken_1.default, function (req, res) {
        var query = {};
        query.id = req.params.user_id;
        user_1.default.find(query, null, { limit: 1, sort: { _id: -1 } }, function (err, user) {
            if (err)
                res.status(400).send(err);
            res.status(200).json(user);
        });
    });
    /** GET /places */
    router.route("/places").get(VerifyToken_1.default, function (req, res) {
        place_1.default.find({}, null, function (err, places) {
            if (err)
                res.status(500).send(err);
            res.status(200).json(places);
        });
    });
    /** GET /places/:place_id */
    router
        .route("/places/:place_id")
        .get(VerifyToken_1.default, function (req, res) {
        var query = {};
        query.id = req.params.place_id;
        place_1.default.find(query, null, function (err, user) {
            if (err)
                res.status(500).send(err);
            user_1.default.find({ _id: user[0].id_user }, null, function (err, user) {
                if (err)
                    res.status(500).send(err);
                res.status(200).json(user);
            });
        });
    });
    /** GET /places/free */
    router
        .route("/places/free")
        .get(VerifyToken_1.default, function (req, res) {
        var query = {};
        query.using = false;
        place_1.default.find(query, null, function (err, places) {
            if (err)
                res.status(500).send(err);
            res.status(200).json(places);
        });
    });
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
