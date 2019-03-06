import { Request, Response, Error, Router } from "express";
import User, { UserSchema } from "../models/user";
import Place, { PlaceSchema } from "../models/place";
import VerifyToken from "./VerifyToken";
import { encrypt, decrypt } from "./test";
import * as model from "../models/model";

interface Query {
  id?: string;
  using?: boolean;
}

const Get = (router: Router) => {

  /** GET /users => {name, fname, id_place} */

  router.route("/users").get(VerifyToken, async (req: Request, res: Response) => {
    const users = await model.getUsers();
    const usersDecrypted = users.map(user => {
      return {
        id: user.id,
        name: decrypt(user.name, req.userId),
        fname: decrypt(user.fname, req.userId),
        id_place: user.id_place || null,
        remoteDay: user.remoteDay,
        photo: user.photo
      };
    });
    res.status(200).json(usersDecrypted);
  });

  router
    .route("/users/:user_id/friends")
    .get(VerifyToken, async (req: Request, res: Response) => {
      const user_id = encrypt(req.params.user_id, req.userId);
      const user = await model.getUserById(user_id);
      const friendsArray = user.friend;
      const usersDecrypted = friendsArray.map(friend => {
        return {
          id: decrypt(friend.id, req.userId),
          name: decrypt(friend.name, req.userId),
          fname: decrypt(friend.fname, req.userId),
          id_place: friend.id_place || null,
          remoteDay: friend.remoteDay,
          photo: friend.photo
        }
      });
      res.status(200).json(usersDecrypted);
    });

  /** GET /users/:user_id */

  router
    .route("/users/:user_id")
    .get(VerifyToken, async (req: Request, res: Response) => {
      const id_user = encrypt(req.params.user_id, req.userId);
      const user = await model.getUserById(id_user);
      res.status(200).json(user);
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
