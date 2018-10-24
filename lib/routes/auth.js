"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var apikey_1 = __importDefault(require("../models/apikey"));
var VerifyToken_1 = __importDefault(require("./VerifyToken"));
var Auth = function (router) {
    /** POST /register */
    router.post('/register', function (req, res) {
        if (req.body.name === null
            || req.body.email === null
            || req.body.password === null)
            res.status(400).send('invalid mail or name');
        var query = {};
        query.email = req.body.email;
        apikey_1.default.find(query, function (err, user) {
            if (err)
                return res.status(500).send('There was a problem finding the user.');
            if (user.length)
                return res.status(400).send('Email already used');
        });
        var hashedPassword = bcryptjs_1.default.hashSync(req.body.password, 8);
        apikey_1.default.create({
            name: req.body.name,
            email: req.body.email,
            api_key: hashedPassword,
            creation: Date.now(),
        }, function (err, user) {
            if (err) {
                return res
                    .status(500)
                    .send('There was a problem registering the user.');
            }
            // create a token
            var token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.API_SECRET);
            res.status(200).send({ auth: true, token: token });
        });
    });
    /** GET /me */
    router.get('/me', VerifyToken_1.default, function (req, res, next) {
        apikey_1.default.findById(req.userId, { api_key: 0 }, function (err, user) {
            if (err)
                return res.status(500).send('There was a problem finding the user.');
            if (!user)
                return res.status(404).send('No user found.');
            res.status(200).send(user);
        });
    });
    /** POST /login */
    router.post('/login', function (req, res) {
        apikey_1.default.findOne({ email: req.body.email }, function (err, user) {
            if (err)
                return res.status(500).send('Error on the server.');
            if (!user)
                return res.status(404).send('No user found.');
            var passwordIsValid = bcryptjs_1.default.compareSync(req.body.password, user.api_key);
            if (!passwordIsValid)
                return res.status(401).send({ auth: false, token: null });
            var token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.API_SECRET);
            res.status(200).send({ auth: true, token: token });
        });
    });
    /** GET /logout */
    router.get('/logout', function (req, res) {
        res.status(200).send({ auth: false, token: null });
    });
};
exports.default = Auth;
