module.exports = function(router){

  var User = require('../models/user');
  var Place = require('../models/place');
  var VerifyToken = require('./VerifyToken');


  function getQuery(req)
  {
    var query_user = {};
    if(req.query.name != null)
      query_user["name"] = req.query.name;
    if(req.query.fname != null)
      query_user["fname"] = req.query.fname;
    if(req.query.id_place != null)
      query_user["id_place"] = req.query.id_place;

    return query_user;
  }

  router.route('/users')
    .get(VerifyToken, function(req, res)
    {
      User.find(getQuery(req), null, function(err, users)
        {
          if (err)
            res.status(400).send(err);
          res.status(200).json(users);
        });
    });

  router.route('/users/last')
    .get(VerifyToken, function(req, res) {
      User.find(getQuery(req), null, {limit: 1, sort: {_id:-1}},
        function(err, user)
        {
          if (err)
            res.status(400).send(err);
          res.status(200).json(user);
        });
    });

  router.route('/users/:user_id')
    .get(VerifyToken, function(req, res) {
      var query = {};
      query["id"] = req.params.user_id;
      User.find(query, function(err, user) {
        if (err)
          res.status(400).send(err);
        res.status(200).json(user);
      });
    });

  router.route('/users/:user_id/last')
    .get(VerifyToken, function(req, res) {
      var query = {};
      query["id"] = req.params.user_id;

      User.find(query, null, {limit: 1, sort: {_id:-1}},
        function(err, user)
        {
          if (err)
            res.status(400).send(err);
          res.status(200).json(user);
        });
    });

    router.route('/places')
      .get(VerifyToken, function(req, res)
      {
        Place.find({}, null, function(err, places)
          {
            if (err)
              res.status(500).send(err);
            res.status(200).json(places);
          });
      });

    router.route("/places/:place_id").get(VerifyToken, function(req, res) {
      let query = {};
      query["id"] = req.params.place_id;
      Place.find(query, null, function(err, user) {
        if (err) res.status(500).send(err);

        User.find({ _id: user[0].id_user }, null, function(err, user) {
          if (err) res.status(500).send(err);
          res.status(200).json(user);
        });
      });
    });

    router.route('/places/free')
      .get(VerifyToken, function(req, res)
      {
        var query = {};
        query["using"] = false;
        Place.find(query, null, function(err, places)
          {
            if (err)
              res.status(500).send(err);
            res.status(200).json(places);
          });
      });
}
