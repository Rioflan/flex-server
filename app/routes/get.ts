import { Request, Response, Error, Router } from "express";
import User, { UserSchema } from "../models/user";
import Place, { PlaceSchema } from "../models/place";
import VerifyToken from "./VerifyToken";
import { encrypt, decrypt } from "./test";

interface Query {
  id?: string;
  using?: boolean;
}

const Get = (router: Router) => {

  /** GET /users => {name, fname, id_place} */

  router.route("/users").get(VerifyToken, (req: Request, res: Response) => {
    User.find({}, null, (err, users: Array<UserSchema>) => {
      if (err) res.status(400).send(err);
      const usersDecrypted = users.map(e => {
        return {
          id: e.id,
          name: decrypt(e.name, req.userId),
          fname: decrypt(e.fname, req.userId),
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
    .get(VerifyToken, (req: Request, res: Response) => {
      const query = <Query>{};
      query.id = encrypt(req.params.user_id, req.userId);
      User.find(query, (err, user: UserSchema) => {
        if (err) res.status(400).send(err);
        console.log(user)
        const friendsID = user[0].friend.map(e => e.id);
        User.find({ 'id': { $in: friendsID } }, (err, friendList: Array<UserSchema>) => {
          if (err) res.status(400).send(err);
          const usersDecrypted = friendList.map(e => {
            return {
              id: e.id,
              name: decrypt(e.name, req.userId),
              fname: decrypt(e.fname, req.userId),
              id_place: e.id_place || null,
              remoteDay: e.remoteDay,
              photo: e.photo
            }
            });
            res.status(200).json(usersDecrypted);
        });
      });
    });

  /** GET /users/:user_id */

  router
    .route("/users/:user_id")
    .get(VerifyToken, (req: Request, res: Response) => {
      const query = <Query>{};
      query.id = encrypt(req.params.user_id, req.userId);
      User.findOne(query, (err, user: UserSchema) => {
        if (err) res.status(400).send(err);
        res.status(200).json(user);
      });
    });

  /** GET /users/:user_id/last */

  router
    .route("/users/:user_id/last")
    .get(VerifyToken, (req: Request, res: Response) => {
      const query = <Query>{};
      query.id = req.params.user_id;

      User.find(
        query,
        null,
        { limit: 1, sort: { _id: -1 } },
        (err, user: UserSchema) => {
          if (err) res.status(400).send(err);
          res.status(200).json(user);
        }
      );
    });

  /** GET /places */

  router.route("/places").get(VerifyToken, (req: Request, res: Response) => {
    Place.find({}, null, (err, places: Array<PlaceSchema>) => {
      if (err) res.status(500).send(err);
      res.status(200).json(places);
    });
  });

  /** GET /places/:place_id */

  router
    .route("/places/:place_id")
    .get(VerifyToken, (req: Request, res: Response) => {
      const query = <Query>{};
      query.id = req.params.place_id;
      Place.find(query, null, (err, user) => {
        if (err) res.status(500).send(err);

        User.find({ _id: user[0].id_user }, null, (err, user) => {
          if (err) res.status(500).send(err);
          res.status(200).json(user);
        });
      });
    });

  /** GET /places/free */

  router
    .route("/places/free")
    .get(VerifyToken, (req: Request, res: Response) => {
      const query = <Query>{};
      query.using = false;
      Place.find(query, null, (err, places: Array<PlaceSchema>) => {
        if (err) res.status(500).send(err);
        res.status(200).json(places);
      });
    });

  /** GET /environment */

  router
    .route("/environment")
    .get(VerifyToken, (req: Request, res: Response) => {
      const regexEnvironment = {
        LOGIN_REGEX: process.env.LOGIN_REGEX,
        PLACE_REGEX: process.env.PLACE_REGEX,
      };
      res.status(200).json(regexEnvironment);
    });
};

export default Get;
