import { Request, Response, Router } from "express";

import VerifyToken from "./VerifyToken";
import { encrypt, decrypt } from "./test";
import * as model from "../models/model";
import Place from "../models/place";
import dbconfig from '../database/mongoDB';
import logger from '../../config/winston';

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

  router
    .route("/users")
    .get(VerifyToken, async (req: Request, res: Response) => {
    
      logger.info('app.routes.get.users, X-Correlation-ID : '+req.header('X-Correlation-ID'));

      const users = await model.getUsers();
      const usersDecrypted = users.map(user => {
        return {
          id: user.id,
          name: decrypt(user.name || "", req.params.userId),
          fname: decrypt(user.fname || "", req.params.userId),
          id_place: user.id_place || null,
          remoteDay: user.remoteDay,
          photo: user.photo,
          start_date: user.start_date,
          end_date: user.end_date,
        };
      });
      res.status(200).json(usersDecrypted);
  });

  router
    .route("/users/:user_id/friends")
    .get(VerifyToken, async (req: Request, res: Response) => {

      logger.info('app.routes.get.users.userId.friends, X-Correlation-ID : '+req.header('X-Correlation-ID'));

      const user_id = encrypt(req.params.user_id, req.params.userId);
      const user = await model.getUserById(user_id);
      const friendsArray = user.friend;
      const usersDecrypted = friendsArray.map(friend => {
        return {
          id: friend.id,
          name: decrypt(friend.name || "", req.params.userId),
          fname: decrypt(friend.fname || "", req.params.userId),
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

      logger.info('app.routes.get.users.userId, X-Correlation-ID : '+req.header('X-Correlation-ID'));

      const id_user = encrypt(req.params.user_id, req.params.userId);
      const user = await model.getUserById(id_user);
      
      if (!user) {
        logger.error('app.routes.get.users.userId.notFound : '+ id_user + ', X-Correlation-ID : '+req.header('X-Correlation-ID'));
        res.status(resultCodes.notFound).send(errorMessages.notFound);
        return
      }
      var image;

      var response = await dbconfig.getUserPhotoWrapper(id_user)
                        .catch((error) => {
                              logger.error('app.routes.get.users.userId.getUserPhotoWrapper.error : '+ id_user + ' error : '+ error +', X-Correlation-ID : '+req.header('X-Correlation-ID'));
                        });
      if (response !== "Photo not found"){
        logger.info('app.routes.get.users.userId.photoFound : '+ id_user + ', X-Correlation-ID : '+req.header('X-Correlation-ID'));
        image = response;
      }else{
        logger.info('app.routes.get.users.userId.photoNotFound : '+ id_user + ', X-Correlation-ID : '+req.header('X-Correlation-ID'));
      }

      res.status(200).json({
          id: user.id,
          name: decrypt(user.name || "", req.params.userId),
          fname: decrypt(user.fname || "", req.params.userId),
          id_place: user.id_place || null,
          remoteDay: user.remoteDay,
          historical: user.historical,
          photo: image ? image:user.photo,
          start_date: user.start_date,
          end_date: user.end_date,
      });
    });

  /** GET /users/:user_id/place */

  router
    .route("/users/:user_id/place")
    .get(VerifyToken, async (req: Request, res: Response) => {

        logger.info('app.routes.get.places.reset, X-Correlation-ID : '+req.header('X-Correlation-ID'));

        const id_user = encrypt(req.params.user_id, req.params.userId);
        logger.debug("id_user : " + id_user + ', X-Correlation-ID : '+req.header('X-Correlation-ID'));

        const place = await Place.findOne({ id_user: id_user });
        logger.debug("place : " + place + ', X-Correlation-ID : '+req.header('X-Correlation-ID'));
        
        res.status(200).json(place);
      });
    

  /** GET /places */

  router
    .route("/places")
    .get(VerifyToken, async (req: Request, res: Response) => {
      logger.info('app.routes.get.places, X-Correlation-ID : '+req.header('X-Correlation-ID'));

      const places = await model.getPlaces();
      logger.debug(places);
      res.status(200).json(places);
  });

  router
    .route("/places/reset")
    .get(VerifyToken, async (req: Request, res: Response) => {
      logger.info('app.routes.get.places.reset, X-Correlation-ID : '+req.header('X-Correlation-ID'));

      await model.resetPlaces(websocket, pool);
      res.status(200).send("Places successfully reset");
    })
};


export default Get;
