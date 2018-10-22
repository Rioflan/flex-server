"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var apikey_1 = __importDefault(require("../models/apikey"));
/**
   * This function verify the token used.
   * @param {Request} req the current request.
   * @param {Response} res the current response.
   * @param {function} next the function's callback.
   */
var verifyToken = function (req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token)
        return res.status(403).send({ auth: false, message: 'No token provided.' });
    jsonwebtoken_1.default.verify(token, process.env.API_SECRET, function (err, decoded) {
        if (err) {
            return res
                .status(500)
                .send({ auth: false, message: 'Failed to authenticate token.' });
        }
        req.userId = decoded.id;
        apikey_1.default.findById(req.userId, { api_key: 0 }, function (err, user) {
            if (err)
                return res.status(500).send('There was a problem finding the user.');
            if (!user)
                return res.status(404).send('No user found.');
            // if everything's good, go next
            next();
        });
    });
};
exports.default = verifyToken;
