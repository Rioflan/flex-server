import { Request, Response, Router } from "express";
import VerifyToken from "./VerifyToken";
import { encrypt, decrypt } from "./test";
import * as model from "../models/model";
import Place from "../models/place";

const resultCodes = {
	success: 200,
	syntaxError: 400,
  notFound: 404,
	serverError: 500,
}

const errorMessages = {
  notFound: "Not found"
}

const Get = (router: Router, websocket, pool) => {

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
          id: friend.id,
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
      if (!user) {
        res.status(resultCodes.notFound).send(errorMessages.notFound);
        return
      }
      res.status(200).json(Object.assign({...user}, {
        name: decrypt(user.name, req.userId),
        fname: decrypt(user.fname, req.userId),
      }));
    });

  /** GET /users/:user_id/place */

  router
    .route("/users/:user_id/place")
    .get(VerifyToken, async (req: Request, res: Response) => {
      const id_user = encrypt(req.params.user_id, req.userId);
      const place = await Place.findOne({ id_owner: id_user })
      res.status(200).json(place);
      });

  /** GET /places */

  router.route("/places").get(VerifyToken, async (req: Request, res: Response) => {
    const places = await model.getPlaces();
    res.status(200).json(places);
  });

  router
    .route("/reset_places")
    .get(VerifyToken, async (req: Request, res: Response) => {
      await model.resetPlaces(websocket, pool);
      res.status(200).send("Places successfully reset");
    })
};

export default Get;
