module.exports = function(router){

  const User = require('../models/user');
  const Place = require('../models/place');
  var RES;
  const VerifyToken = require('./VerifyToken');
  const { encrypt, decrypt } = require("./test");

  function addUser(id_user, name, fname, id_place)
  {
    var actual_user = new User();
    actual_user.id = id_user;
    actual_user.name = name;
    actual_user.fname = fname;
    actual_user.id_place = id_place;
    actual_user.begin = Date.now();
    actual_user.end = null;

    actual_user.save(function(err)
    {
      if (err)
        RES.status(500).send(err);
      console.log('User created');
    });
  }

  function updateUser(id_user, params)
  {
    console.log("updateUser2", id_user, params)
    User.findOne({id : id_user}, null , {sort: {_id:-1}},
    function (err, user)
    {
      console.log("updateUser", err, user)
      if (err)
        RES.status(500).send(err);

      var actual_user = user;

      if(params.end !== null)
        actual_user.end = params.end;

      if(params.begin !== null)
        actual_user.begin = params.begin;

      if(params.name !== null)
        actual_user.name = params.name;

      if(params.fname !== null)
        actual_user.fname = params.fname;

      actual_user.save(function(err)
      {
        if (err)
          RES.status(500).send(err);
        console.log('User Updated');
      });
    });
  }

  function addPlace(id_place, id_user)
  {
    console.log("Create place:");

    var actual_place = new Place();
    actual_place.id = id_place;

    if(id_user === null || id_user === "")
    {
      actual_place.using = false;
      actual_place.id_user = "";
    }
    else
    {
      actual_place.using= true;
      actual_place.id_user = id_user;
    }

    actual_place.save(function(err)
    {
      if (err)
        RES.status(500).send(err);
      console.log('Place Created');
    });
  }

  function updatePlace(id_place, params)
  {
    Place.findOne({id : id_place}, function (err, place)
    {
      if (err)
        RES.status(500).send(err);
      console.log("params.using", params.using)
      if(params.using !== null)
        place.using = params.using;

      if(params.id_user !== null)
        place.id_user = params.id_user;

      place.save(function(err)
      {
        if (err)
          RES.status(500).send(err);
        console.log('Place Updated');
      });

    });
  }

  async function whoUses(id_place)
  {
    return await new Promise((resolve, reject) => {
      Place.findOne({id : id_place}, function (err, place)
      {
        if (!err && place !== null)
          resolve(place.id_user);//"" => not used, "NAME" => used by NAME
        else
          resolve("#");//place not exists
      });
    });
  }

  async function whereSit(id_user)
  {
    return await new Promise((resolve, reject) => {
      User.findOne({id : id_user}, null , {sort: {_id:-1}},
        function (err, user) {
          if (!err && user !== null)
          {
            if(user.end === null)
              resolve(user.id_place);
            else
              resolve("");
          }
          else
            resolve("#");
        })
    });
  }

  async function post(body)
  {
    const userSit = await whereSit(body.id_user);
    const user = await whoUses(body.id_place);
    console.log("body", body)
    console.log(userSit,user )
    if(userSit === "#" || userSit === "")//not exists or not sit
    {

      addUser(body.id_user, body.name, body.fname, body.id_place);
      console.log("NOT EXISTS");

      if(user === "#")//not exists
      {
        console.log("PLACE EXISTE PAS");
        addPlace(body.id_place, body.id_user);
      }
      else if(user === "")//place empty
      {
        console.log("PLACE VIDE");
        updatePlace(body.id_place, { "using":true, "id_user":body.id_user });
      }
      else//used by the "user" user
      {
        console.log("PLACE UTILISEE: " + user);
        let endDate = Date.now();
        console.log("user", user)
        updateUser(user, { "end": endDate });//if one user sit at this place the old user leaves
      }
    }
    else
    {
      console.log("ASSIS");
      if(userSit === body.id_place)// user already sit here and leaves
      {
        let endDate = Date.now();
        console.log("body.id_use", body.id_user)
        updateUser(body.id_user, { "end": endDate });
        updatePlace(body.id_place, { "using":false, "id_user":"" });
      }
      else//user is sit somewhere and move to another place
      {
        let endDate = Date.now();
        updateUser(user, { "end": endDate });//the other user leaves
        updatePlace(userSit, { "using":false, "id_user":"" });//updates the old user place
        updatePlace(body.id_place, { "using":true, "id_user":body.id_user });//the user is now here
        addUser(body.id_user, body.name, body.fname, body.id_place);
      }
    }
  }

  router.route('/')

    .post(VerifyToken, function(req, res) {
      RES = res;
      var body = req.body;

      if(body.id_place === null || body.name === null || body.fname === null || body.id_user === null)
        res.status(400).json({ error: 'Invialid arguments' });

      body.id_user = encrypt(body.id_user, req.userId);
      body.name = encrypt(body.name, req.userId);
      body.fname = encrypt(body.fname, req.userId);
      post(body);
      res.status(200).json({ result: 'User Updated' });
    });

}
