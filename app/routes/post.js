module.exports = function(router) {
  const User = require("../models/user");
  const Place = require("../models/place");
  var RES;
  const VerifyToken = require("./VerifyToken");
  const { encrypt, decrypt } = require("./test");

  /**
   * This function adds a new user.
   * @param {string} id_user id of the new user
   * @param {string} name name of the new user
   * @param {string} fname family Name of the new user
   * @param {string} id_place place of the new user
   */
  function addUser(id_user, name, fname, id_place) {
    var actual_user = new User();
    actual_user.id = id_user;
    actual_user.name = name;
    actual_user.fname = fname;
    actual_user.id_place = id_place;
    actual_user.begin = null;
    actual_user.end = null;

    actual_user.save(function(err) {
      if (err) RES.status(500).send(err);
      console.log("User created");
    });
  }

  /**
   * This function update a user.
   * @param {string} id_user id of the user
   * @param {object} params list of parameters
   */
  function updateUser(id_user, params) {
    User.findOne({ id: id_user }, null, { sort: { _id: -1 } }, function(
      err,
      user
    ) {
      if (err) RES.status(500).send(err);

      let actual_user = user;

      if (params.end !== null) actual_user.end = params.end;

      if (params.begin !== null) actual_user.begin = params.begin;

      if (params.name !== null) actual_user.name = params.name;

      if (params.fname !== null) actual_user.fname = params.fname;

      if (params.id_place !== null) actual_user.id_place = params.id_place;

      actual_user.save(function(err) {
        if (err) RES.status(500).send(err);
        console.log("User Updated");
      });
    });
  }

  /**
   * This function adds a new place.
   * @param {string} id_place id of the new place
   * @param {string} id_user id of the user
   */
  function addPlace(id_place, id_user) {
    console.log("Create place:");

    var actual_place = new Place();
    actual_place.id = id_place;

    if (id_user === null || id_user === "") {
      actual_place.using = false;
      actual_place.id_user = "";
    } else {
      actual_place.using = true;
      actual_place.id_user = id_user;
    }

    actual_place.save(function(err) {
      if (err) RES.status(500).send(err);
      console.log("Place Created");
    });
  }

  /**
   * This function update a place.
   * @param {string} id_place id of the current place
   * @param {object} params list of parameters
   */
  function updatePlace(id_place, params) {
    Place.findOne({ id: id_place }, function(err, place) {
      if (err) RES.status(500).send(err);
      if (params.using !== null) place.using = params.using;

      if (params.id_user !== null) place.id_user = params.id_user;

      place.save(function(err) {
        if (err) RES.status(500).send(err);
        console.log("Place Updated");
      });
    });
  }

  /**
   * This function is used to know if a place exists and who.
   * @param {string} id_place id of the current place
   */
  async function whoUses(id_place) {
    return await new Promise((resolve, reject) => {
      Place.findOne({ id: id_place }, function(err, place) {
        if (!err && place !== null) resolve(place.id_user);
        //"" => not used, "NAME" => used by NAME
        else resolve("#"); //place not exists
      });
    });
  }

  /**
   * This function is used to know where the provided user is seated.
   * @param {string} id_place id of the current user
   */
  async function whereSit(id_user) {
    return await new Promise((resolve, reject) => {
      User.findOne({ id: id_user }, null, { sort: { _id: -1 } }, function(
        err,
        user
      ) {
        if (!err && user !== null) {
          if (user.end === null) resolve(user.id_place);
          else resolve("");
        } else resolve("#");
      });
    });
  }

  /**
   * This function handle all the post requests.
   * @param {object} body current payload of the request
   */
  async function post(body) {
    const userSit = await whereSit(body.id_user);
    const user = await whoUses(body.id_place);
    if (userSit === "#" || userSit === "") {
      //not exists or not sit
      console.log("NOT EXISTS");
      updateUser(body.id_user, {
        begin: Date.now(),
        id_place: body.id_place,
        end: "",
        name: body.name,
        fname: body.fname
      });
      if (user === "#") {
        //not exists
        console.log("PLACE EXISTE PAS");
        addPlace(body.id_place, body.id_user);
      } else if (user === "") {
        //place empty
        console.log("PLACE VIDE");
        updatePlace(body.id_place, { using: true, id_user: body.id_user });
      } //used by the "user" user
      else {
        console.log("PLACE UTILISEE: " + user);
        let endDate = Date.now();
        updateUser(user, {
          end: endDate, // endDate // nedd fix
          begin: "",
          id_place: "",
          name: body.name,
          fname: body.fname
        }); //if one user sit at this place the old user leaves
      }
    } else {
      console.log("ASSIS");
      if (userSit === body.id_place) {
        // user already sit here and leaves
        let endDate = Date.now();
        updateUser(body.id_user, {
          end: endDate, // => endDate // need fix
          begin: "",
          id_place: "",
          name: body.name,
          fname: body.fname
        });
        updatePlace(body.id_place, { using: false, id_user: "" });
      } //user is sit somewhere and move to another place
      else {
        let endDate = Date.now();
        updateUser(body.id_user, {
          end: endDate, // endDate // nedd fix => condition in whereSit
          begin: "",
          id_place: "",
          name: body.name,
          fname: body.fname
        }); //the other user leaves
        updatePlace(userSit, { using: false, id_user: "" }); //updates the old user place
        updatePlace(body.id_place, {
          using: true,
          id_user: body.id_user
        }); //the user is now here
        // addUser(body.id_user, body.name, body.fname, body.id_place);
      }
    }
  }

  /**
   * This route handle all the post requests.
   */
  router
    .route("/")

    .post(VerifyToken, function(req, res) {
      RES = res;
      var body = req.body;

      if (
        body.id_place === null ||
        body.name === null ||
        body.fname === null ||
        body.id_user === null
      )
        res.status(400).json({ error: "Invialid arguments" });

      body.id_user = encrypt(body.id_user, req.userId);
      body.name = encrypt(body.name, req.userId);
      body.fname = encrypt(body.fname, req.userId);
      post(body);
      res.status(200).json({ result: "User Updated" });
    });

  /**
   * This route is used to handle new users.
   */
  router
    .route("/login_user")

    .post(VerifyToken, function(req, res) {
      var body = req.body;

      if (body.name === null || body.fname === null || body.id_user === null)
        res.status(400).json({ error: "Invialid arguments" });
      body.id_user = encrypt(body.id_user, req.userId);
      body.name = encrypt(body.name, req.userId);
      body.fname = encrypt(body.fname, req.userId);

      // Check if the user exists

      User.findOne({ id: body.id_user }, null, { sort: { _id: -1 } }, function(
        err,
        user
      ) {
        if (err) return res.status(500).send("Error on the server.");
        if (!user) {
          addUser(body.id_user, body.name, body.fname, "");
          console.log("NOT EXISTS");
        }

        // if (user) return res.status(200).send(user);
        
      });

      res.status(200).json({ result: "User Updated" });
    });
};
