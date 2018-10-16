import {
  pick,
  last,
  append,
  update,
  findLastIndex,
  propEq,
} from 'ramda';
import redis from 'redis';
import User from '../models/user';
import Place from '../models/place';
import VerifyToken from './VerifyToken';
import { encrypt } from './test';

interface Request {
  userId?: string,
  body: any,
}

let RES;

const post = (router) => {
  const client = redis.createClient();

  /**
   * This function adds a new user.
   * @param {string} id_user id of the new user
   * @param {string} name name of the new user
   * @param {string} fname family Name of the new user
   * @param {string} id_place place of the new user
   */
  function addUser(id_user, name, fname, id_place) {
    const actual_user = new User();
    actual_user.id = id_user;
    actual_user.name = name;
    actual_user.fname = fname;
    actual_user.id_place = id_place;
    actual_user.historical = [];

    actual_user.save((err) => {
      if (err) RES.status(500).send(err);
      console.log('User created');
    });
  }

  /**
   * This function update a user.
   * @param {string} id_user id of the user
   * @param {object} params list of parameters
   */
  function updateUser(id_user, params) {
    User.findOne({ id: id_user }, null, { sort: { _id: -1 } }, (err, user) => {
      if (err) RES.status(500).send(err);

      const actual_user = user;

      if (params.historical !== []) actual_user.historical = params.historical;

      if (params.name !== null) actual_user.name = params.name;

      if (params.fname !== null) actual_user.fname = params.fname;

      if (params.id_place !== null) actual_user.id_place = params.id_place;

      actual_user.save((err) => {
        if (err) RES.status(500).send(err);
        console.log('User Updated First');
      });
    });
  }

  /**
   * This function adds a new place.
   * @param {string} id_place id of the new place
   * @param {string} id_user id of the user
   */
  function addPlace(id_place, id_user) {
    console.log('Create place:');

    const actual_place = new Place();
    actual_place.id = id_place;

    if (id_user === null || id_user === '') {
      actual_place.using = false;
      actual_place.id_user = '';
    } else {
      actual_place.using = true;
      actual_place.id_user = id_user;
    }

    actual_place.save((err) => {
      if (err) RES.status(500).send(err);
      console.log('Place Created');
    });
  }

  /**
   * This function update a place.
   * @param {string} id_place id of the current place
   * @param {object} params list of parameters
   */
  function updatePlace(id_place, params) {
    Place.findOne({ id: id_place }, (err, place) => {
      if (err) RES.status(500).send(err);
      if (params.using !== null) place.using = params.using;

      if (params.id_user !== null) place.id_user = params.id_user;

      place.save((err) => {
        if (err) RES.status(500).send(err);
        console.log('Place Updated');
      });
    });
  }

  /**
   * This function is used to know if a place exists and who.
   * @param {string} id_place id of the current place
   */
  async function whoUses(id_place) {
    return await new Promise((resolve, reject) => {
      Place.findOne({ id: id_place }, (err, place) => {
        if (!err && place !== null) resolve(place.id_user);
        // "" => not used, "NAME" => used by NAME
        else resolve('#'); // place not exists
      });
    });
  }

  /**
   * This function is used to know where the provided user is seated.
   * @param {string} id_place id of the current user
   */
  async function whereSit(id_user) {
    return await new Promise((resolve, reject) => {
      User.findOne(
        { id: id_user },
        null,
        { sort: { _id: -1 } },
        (err, user) => {
          const userEnd = user.historical.length > 0
            ? pick(['end'], last(user.historical))
            : '';
          if (!err && user !== null) {
            if (userEnd.end === '') resolve(user.id_place);
            else resolve('');
          } else resolve('#');
        },
      );
    });
  }

  /**
   * This function handle all the post requests.
   * @param {object} body current payload of the request
   */
  async function post(body) {
    const userSit = await whereSit(body.id_user);
    const user = await whoUses(body.id_place);

    const { historical } = body;

    if (userSit === '#' || userSit === '') {
      const beginDate = new Date(Date.now()).toLocaleString();
      //  not exists or not sit
      console.log('NOT EXISTS');
      updateUser(body.id_user, {
        id_place: body.id_place,
        historical: append(
          { place_id: body.id_place, begin: beginDate, end: '' },
          historical,
        ),
        name: body.name,
        fname: body.fname,
      });
      if (user === '#') {
        //  not exists
        console.log('PLACE EXISTE PAS');
        addPlace(body.id_place, body.id_user);
      } else if (user === '') {
        //  place empty
        console.log('PLACE VIDE');
        updatePlace(body.id_place, {
          using: true,
          id_user: body.id_user,
        });
      } //  used by the "user" user
      else {
        console.log(`PLACE UTILISEE: ${user}`);
        const endDate = new Date(Date.now()).toLocaleString();
        const indexUser = findLastIndex(propEq('place_id', body.id_place))(
          body.historical,
        );
        updateUser(user, {
          historical: update(
            indexUser,
            {
              place_id: body.id_place,
              begin: body.historical[indexUser].begin,
              end: endDate,
            },
            body.historical,
          ),
          name: body.name,
          fname: body.fname,
        }); //  if one user sit at this place the old user leaves
      }
    } else {
      console.log('ASSIS');
      if (userSit === body.id_place) {
        const indexUser = findLastIndex(propEq('place_id', body.id_place))(
          body.historical,
        );
        // user already sit here and leaves
        const endDate = new Date(Date.now()).toLocaleString();
        updateUser(body.id_user, {
          historical: update(
            indexUser,
            {
              place_id: body.id_place,
              begin: body.historical[indexUser].begin,
              end: endDate,
            },
            body.historical,
          ),
          name: body.name,
          fname: body.fname,
        });
        updatePlace(body.id_place, { using: false, id_user: '' });
      } //  user is sit somewhere and move to another place
      else {
        const endDate = new Date(Date.now()).toLocaleString();
        const indexUser = findLastIndex(propEq('place_id', body.id_place))(
          body.historical,
        );
        updateUser(body.id_user, {
          historical: update(
            indexUser,
            {
              place_id: body.id_place,
              begin: body.historical[indexUser].begin,
              end: endDate,
            },
            body.historical,
          ),
          name: body.name,
          fname: body.fname,
        }); //  the other user leaves
        updatePlace(userSit, { using: false, id_user: '' }); // updates the old user place
        updatePlace(body.id_place, {
          using: true,
          id_user: body.id_user,
        }); //  the user is now here
        // addUser(body.id_user, body.name, body.fname, body.id_place);
      }
    }
  }

  /**
   * This route handle all the post requests.
   */
  router
    .route('/')

    .post(VerifyToken, (req: Request, res: Response) => {
      RES = res;
      const body = req.body;

      if (
        body.id_place === null
        || body.name === null
        || body.fname === null
        || body.id_user === null
      ) return RES.status(400).json({ error: 'Invialid arguments' });

      body.id_user = encrypt(body.id_user, req.userId);
      body.name = encrypt(body.name, req.userId);
      body.fname = encrypt(body.fname, req.userId);
      post(body);
      RES.status(200).json({ result: 'User Updated Middle' });
    });

  /**
   * This route is used to handle users login.
   */
  router
    .route('/login_user')

    .post(VerifyToken, (req: Request, res: Response) => {
      const body = req.body;
      RES = res;
      if (body.name === null || body.fname === null || body.id_user === null) return RES.status(400).json({ error: 'Invialid arguments' });
      body.id_user = encrypt(body.id_user, req.userId);
      body.name = encrypt(body.name, req.userId);
      body.fname = encrypt(body.fname, req.userId);

      client.on('connect', () => {
        console.log('Redis client connected');
      });

      // Check if the user exists

      User.findOne(
        { id: body.id_user },
        null,
        { sort: { _id: -1 } },
        (err, user) => {
          if (err) return RES.status(500).send('Error on the server.');
          if (!user) {
            const { id_user, name, fname } = body;
            addUser(id_user, name, fname, '');

            /** Add user to redis */

            // client.set(
            //   `UserId:${body.id_user}`,
            //   JSON.stringify({ name, fname }),
            //   redis.print
            // );
            console.log('NOT EXISTS');
          }

          // if (user) return res.status(200).send(user);
        },
      );
      RES.status(200).json({ result: 'User Updated Last' });
    });
};

export default post;
