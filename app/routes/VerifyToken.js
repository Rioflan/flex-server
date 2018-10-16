let jwt = require('jsonwebtoken');
let config = require('../../config/api');
let apiUser = require('../models/apikey');


function verifyToken(req, res, next) {
  let token = req.headers['x-access-token'];
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    req.userId = decoded.id;

    apiUser.findById(req.userId, { api_key: 0 }, function (err, user) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      else if (!user) return res.status(404).send("No user found.");
      else {
        // if everything good, go next
        next();
      }
    });
  });
}

module.exports = verifyToken;
