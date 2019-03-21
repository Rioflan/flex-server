import { Request, Response, Router } from "express";
import VerifyToken from "./VerifyToken";
import { encrypt, decrypt } from "./test";
import * as model from "../models/model";

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

  router.route("/places").get(VerifyToken, async (req: Request, res: Response) => {
    const places = await model.getPlaces();
    res.status(200).json(places);
  });
};

export default Get;
