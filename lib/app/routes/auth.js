"use strict";
module.exports = function (router) {
    var apiUser = require('../models/apikey');
    var jwt = require('jsonwebtoken');
    var bcrypt = require('bcryptjs');
    var config = require('../../config/api');
    var VerifyToken = require('./VerifyToken');
    router.post('/register', function (req, res) {
        console.log("req.body", req);
        if (req.body.name == null || req.body.email == null || req.body.password == null)
            res.status(400).send("invalid mail or name");
        var query = {};
        query["email"] = req.body.email;
        apiUser.find(query, function (err, user) {
            if (err)
                return res.status(500).send("There was a problem finding the user.");
            if (user.length)
                return res.status(400).send("Email already used");
        });
        var hashedPassword = bcrypt.hashSync(req.body.password, 8);
        apiUser.create({
            name: req.body.name,
            email: req.body.email,
            api_key: hashedPassword,
            creation: Date.now()
        }, function (err, user) {
            if (err)
                return res.status(500).send("There was a problem registering the user.");
            // create a token
            var token = jwt.sign({ id: user._id }, config.secret);
            res.status(200).send({ auth: true, token: token });
        });
    });
    router.get('/me', VerifyToken, function (req, res, next) {
        apiUser.findById(req.userId, { api_key: 0 }, function (err, user) {
            if (err)
                return res.status(500).send("There was a problem finding the user.");
            if (!user)
                return res.status(404).send("No user found.");
            res.status(200).send(user);
        });
    });
    router.post('/login', function (req, res) {
        apiUser.findOne({ email: req.body.email }, function (err, user) {
            if (err)
                return res.status(500).send('Error on the server.');
            if (!user)
                return res.status(404).send('No user found.');
            var passwordIsValid = bcrypt.compareSync(req.body.password, user.api_key);
            if (!passwordIsValid)
                return res.status(401).send({ auth: false, token: null });
            var token = jwt.sign({ id: user._id }, config.secret);
            res.status(200).send({ auth: true, token: token });
        });
    });
    router.get('/logout', function (req, res) {
        res.status(200).send({ auth: false, token: null });
    });
};
