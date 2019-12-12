/* eslint-disable */
'use strict';

import { append, filter } from "ramda";

import { Request, Response, Router } from "express";
import User from "../models/user";
import Place from "../models/place";
import * as model from "../models/model";
import VerifyToken from "./VerifyToken";
import { encrypt, decrypt } from "./test";
import moment from "moment";
import jwt from "jsonwebtoken";
import dbconfig from '../database/mongoDB';
import logger from '../../config/winston';

const HTTPS_REGEX = "^https?://(.*)";

const errorMessages = {
  userCreation: "Error creating the user",
  userFind: "Error finding the user",
  userUpdate: "Error updating the user",
  userIdMatch: "User's ID does not match user's info",
  userIdTaken: "The ID you specified is taken",
  placeCreation: "Error creating the place",
  placeFind: "Error finding the place",
  placeUpdate: "Error updating the place",
  placeAlreadyUsed: "Place already used by : ",
  invalidArguments: "Invalid arguments",
  invalidCode: "Invalid confirmation code"
};

const successMessages = {
  takePlace: "Place successfully assigned to user",
  leavePlace: "User successfully left the place"
};

const resultCodes = {
  success: 200,
  syntaxError: 400,
  serverError: 500
};

let RES;

const post = (router: Router) => {
  /**
   * This route is used to handle users login.
   */
  router
    .route("/user/login")

    .post(VerifyToken, async (req: Request, res: Response) => {

      logger.info('app.routes.post.user.login, X-Correlation-ID : '+req.header('X-Correlation-ID'));

      const body = req.body;
      if (body.email === null){
        logger.error('app.routes.post.user.login.email.null, X-Correlation-ID : '+req.header('X-Correlation-ID'));
        return res
        .status(resultCodes.syntaxError)
        .json(errorMessages.invalidArguments);
      }
        
      const email = encrypt(body.email, req.params.userId);

      if (!(await model.getUser({ email }))) await model.addUser(email);
      const user = await model.getUser({ email });
      const confirmation_code = model.generateConfirmationCode();
      const confirmation_token = jwt.sign(
        { email, confirmation_code },
        process.env.API_SECRET,
        { expiresIn: 360 }
      );
      await User.updateOne(
        { email },
        { confirmation_token, confirmation_code }
      );
      model.sendConfirmationEmail({
        ...user,
        confirmation_token,
        confirmation_code,
        email: body.email
      });
      res.status(resultCodes.success).json({ email: body.email });
    });

    router
    .route("/user/complete")

    .post(VerifyToken, async (req: Request, res: Response) => {
      logger.info('app.routes.post.user.complete, X-Correlation-ID : '+req.header('X-Correlation-ID'));

      const body = req.body;

      if (
        body.email === null ||
        body.name === null ||
        body.fname === null ||
        body.id_user === null ||
        body.id_user.match(process.env.LOGIN_REGEX) === null
      ){
        logger.error('app.routes.post.user.complete.invalidArguments, X-Correlation-ID : '+req.header('X-Correlation-ID'));
        logger.error('EMAIL     : ' + body.email);
        logger.error('NAME      : ' + body.name);
        logger.error('FULL NAME : ' + body.fname);
        logger.error('ID_USER   : ' + body.id_user);

        return res
        .status(resultCodes.syntaxError)
        .json(errorMessages.invalidArguments);
      }
        
      const id = encrypt(body.id_user, req.params.userId);
      const name = encrypt(body.name, req.params.userId);
      const fname = encrypt(body.fname, req.params.userId);
      const email = encrypt(body.email, req.params.userId);
      const existingUser = await model.getUserById(id);

      if (existingUser) {
        if (existingUser.email) {
          logger.error('app.routes.post.user.complete.userIdTaken, X-Correlation-ID : '+req.header('X-Correlation-ID'));
          logger.error('EMAIL     : ' + existingUser.email);
          return res
          .status(resultCodes.syntaxError)
          .json(errorMessages.userIdTaken);
        }
        await model.removeUser({ email });
        await User.updateOne({ id }, { email, name, fname });
      } 
      else await User.updateOne({ email }, { id, name, fname });

      if (
        body.photo &&
        body.photo.match(HTTPS_REGEX) === null &&
        (body.photo !== "" || body.photo !== null)
      ){
        await dbconfig.putFileWrapper(body.photo, id);
      }
      var image;
      logger.debug("try to get the photo with id :"+id);
      var response = await dbconfig.getUserPhotoWrapper(id)
                        .catch((error) => {
                          logger.error('app.routes.post.user.complete.getUserPhotoWrapper.error : '+error+', X-Correlation-ID : '+req.header('X-Correlation-ID'));
                          return error;
                       });
        if (response !== "Photo not found"){
          image = response;
          logger.debug('app.routes.post.user.complete.getUserPhotoWrapper.photoFound, X-Correlation-ID : '+req.header('X-Correlation-ID'));
        }

      const user = await model.getUserById(id);
      res.status(resultCodes.success).json({
        id: decrypt(user.id || "", req.params.userId),
        name: decrypt(user.name || "", req.params.userId),
        fname: decrypt(user.fname || "", req.params.userId),
        email: decrypt(user.email || "", req.params.userId),
        remoteDay: user.remoteDay,
        photo: image ? image:user.photo,
        start_date: user.start_date,
        end_date: user.end_date,
        historical: user.historical
      });
    });
  /**
   * This route is used to add a friend.
   */
  router
    .route("/friend/add")

    .post(VerifyToken, (req: Request, res: Response) => {
      logger.info('app.routes.post.friend.add');

      const body = req.body;
      RES = res;
      const id_user = encrypt(body.id_user, req.params.userId);
      logger.debug(id_user)
      User.findOne(
        { id: id_user },
        null,
        { sort: { _id: -1 } },
        (err: Error, user) => {
          if (err){
            logger.error('app.routes.post.friend.add.user.findOne.err : ' + err);
            RES.status(resultCodes.syntaxError).send(errorMessages.userFind);            
          }
          else if (user) {
            user.friend = append(
              {
                id: body.id,
                name: encrypt(body.name, req.params.userId),
                fname: encrypt(body.fname, req.params.userId),
                id_place: body.id_place,
                photo: body.photo
              },
              user.friend
            );
            user.save((err: Error) => {
              if (err){
                logger.error('app.routes.post.friend.add.user.save.err : ' + err);
                RES.status(resultCodes.serverError).send(
                  errorMessages.userUpdate
                );
              }
              RES.status(resultCodes.success).send({ user });
            });
          }
        }
      );
    });

  /**
   * This route is used to remove a friend.
   */
  router
    .route("/friend/remove")

    .post(VerifyToken, (req: Request, res: Response) => {
      logger.info('app.routes.post.friend.remove');

      const body = req.body;
      RES = res;
      const id_user = encrypt(body.id_user, req.params.userId);
      User.findOne(
        { id: id_user },
        null,
        { sort: { _id: -1 } },
        (err: Error, user) => {
          if (err){
            logger.error('app.routes.post.friend.remove.user.findOne.err : ' + err);
            RES.status(resultCodes.syntaxError).send(errorMessages.userFind);
          }
          else if (user) {
            const isRemovedUser = userFriend => userFriend.id !== body.id;
            user.friend = filter(isRemovedUser, user.friend);
            user.save((err: Error) => {
              if (err){
                logger.error('app.routes.post.friend.remove.err : ' + err);
                RES.status(resultCodes.serverError).send(
                  errorMessages.userUpdate
                );
              }
              RES.status(resultCodes.success).send({ user });
            });
          }
        }
      );
    });

/*
 * This route is used to remove delete an user
 * Not necessarily used in the applicaton
 */
    router
    .route("/user/remove")

    .post(VerifyToken, async (req: Request, res: Response) => {
      logger.info('app.routes.post.user.remove');

      const body = req.body;
      const name = encrypt(body.name, req.params.userId);
      const fname = encrypt(body.fname, req.params.userId);

      try {
        const user = await model.getUser({ name, fname });
        await model.removeUserById(user.id);
        res.status(resultCodes.success).send({ success: "success" });
      } catch (err) {
        logger.error('app.routes.post.user.remove.err : ' + err);
        res.status(resultCodes.serverError).send(err);
      }
    });
    
  router
    .route("/user/settings")

    .post(VerifyToken, (req: Request, res: Response) => {
      logger.info('app.routes.post.user.settings');

      const body = req.body;
      const id_user = encrypt(body.id_user, req.params.userId);

      if (
        body.photo &&
        body.photo.match(HTTPS_REGEX) === null &&
        (body.photo !== "" || body.photo !== null)
      )
      logger.debug("NODE_ENV is "+process.env.NODE_ENV);

      dbconfig.putFileWrapper(body.photo, body.id_user);

      /*
      if (process.env.NODE_ENV !== "development"){
        model.updatePhoto(id_user, body.photo);
      }else{
        dbconfig.putFileWrapper(body.photo, body.id_user);
      }
      */
      

      if (body.remoteDay !== "")
        model.updateUser(
          id_user, { remoteDay: body.remoteDay }
          );

      if (body.start_date && body.end_date) {
        model.updateAvailabilityPeriod(
          id_user,
          moment.utc(body.start_date, "DD/MM/YYYY").toDate(),
          moment.utc(body.end_date, "DD/MM/YYYY").toDate()
        );
      }
      res.status(resultCodes.success).send({ success: "success" });
    });

  router
    .route("/verify")
    .post(VerifyToken, async (req: Request, res: Response) => {
      logger.info('app.routes.post.verify');

      const body = req.body;
      const code = body.code;
      const user = await model.getUser({ confirmation_code: code });
      let decoded;
      try {
        decoded = await jwt.verify(
          user.confirmation_token,
          process.env.API_SECRET
        );
      } catch (_) {
        logger.error('app.routes.post.verify.jwt.verify.err');

        return res
          .status(resultCodes.syntaxError)
          .send(errorMessages.invalidCode);
      }
      if (
        !user ||
        user.confirmation_code !== code ||
        decoded.confirmation_code !== code
      ){
        logger.error('app.routes.post.verify.invalidCode');
        return res
          .status(resultCodes.syntaxError)
          .send(errorMessages.invalidCode);

      }

      await User.updateOne(
        { email: user.email },
        { confirmation_token: "", confirmation_code: "" }
      );

      const user_id = decrypt(user.id || "", req.params.userId);

      var image;

      var response = await dbconfig.getUserPhotoWrapper(user.id)
                        .catch((error) => {
                              logger.error("PB WITH PICTURE : "+error);
                        });
      if (response !== "Photo not found"){
          image = response;
      }

      res.status(resultCodes.success).json({
        id: user_id,
        name: decrypt(user.name || "", req.params.userId),
        fname: decrypt(user.fname || "", req.params.userId),
        email: decrypt(user.email || "", req.params.userId),
        remoteDay: user.remoteDay,
        photo: image ? image : user.photo,
        start_date: user.start_date,
        end_date: user.end_date,
        historical: user.historical,
        place: user.id_place
      });
    });
  /**
   * This route is used to assign a place to a user.
   */
  router
    .route("/places/take")

    .post(VerifyToken, async (req: Request, res: Response) => {
      logger.info('app.routes.post.places.take');

      const body = req.body;
      if (!body.id_place || !body.id_user) {
        logger.error('app.routes.post.places.take.invalidArguments');
        return res
          .status(resultCodes.syntaxError)
          .send(errorMessages.invalidArguments);
      }

      const id_place = body.id_place;
      const id_user = encrypt(body.id_user, req.params.userId);
      const place = await model.getPlaceById(id_place);

      const placeIsAllowed = async place => {
        const user = await model.getUserById(place.id_owner);
        return (
          user.start_date &&
          user.end_date &&
          moment().isBetween(user.start_date, user.end_date)
        );
      };
      const placeIsAvailable = async place =>
        !place.using && (!place.semi_flex || (await placeIsAllowed(place)));

      if (place && !(await placeIsAvailable(place))) {
        logger.debug("Place already used");
        const user = await model.getUserById(place.id_user);
        const name = decrypt(user.name || "", req.params.userId);
        const fname = decrypt(user.fname || "", req.params.userId);
        res.status(resultCodes.serverError).json({
          name: name,
          fname: fname
        });
        return;
      }
      const historical = await model
        .getUserById(id_user)
        .then(user => user.historical);
      const beginDate = new Date(Date.now()).toLocaleString();
      if (!place) {
        logger.debug("Place doesn't exist");
        model.addPlace(id_place, true, id_user);
      } else {
        logger.debug("Place exists and is free");
        model.updatePlace(id_place, { using: true, id_user: id_user });
      }
      model.updateUser(id_user, {
        id_place: id_place,
        historical: [
          ...historical,
          { id_place: id_place, begin: beginDate, end: "" }
        ]
      });
      res.status(resultCodes.success).send(successMessages.takePlace);
    });

  router
    .route("/places/leave")

    .post(VerifyToken, async (req: Request, res: Response) => {
      logger.info('app.routes.post.places.leave');

      const body = req.body;
      if (!body.id_place || !body.id_user) {
        logger.error('app.routes.post.places.leave.invalidArguments');
        return res
          .status(resultCodes.syntaxError)
          .send(errorMessages.invalidArguments);
      }
      const id_user = encrypt(body.id_user, req.params.userId);
      const historical = await model
        .getUserById(id_user)
        .then(user => user.historical);
      const endDate = new Date(Date.now()).toLocaleString();
      historical[historical.length - 1].end = endDate; // set the end date of the last place in array

      model.updateUser(id_user, { historical: historical, id_place: "" });
      model.updatePlace(body.id_place, { using: false, id_user: "" });

      res.status(resultCodes.success).send(successMessages.leavePlace);
    });

  router
    .route("/place/assign")

    .post(VerifyToken, (req: Request, res: Response) => {
      logger.info('app.routes.post.place.assign');

      const body = req.body;
      const id_user = encrypt(body.id_user, req.params.userId);

      model.updatePlace(body.id_place, {
        id_owner: id_user,
        semi_flex: true,
        start_date: null,
        end_date: null
      });
      res.status(resultCodes.success).send({ success: "success" });
    });

  router
    .route("/place/unassign")

    .post(VerifyToken, (req: Request, res: Response) => {
      logger.info('app.routes.post.place.assign');

      const body = req.body;

      model.updatePlace(body.id_place, {
        id_owner: "",
        semi_flex: false,
        start_date: null,
        end_date: null
      });
      res.status(resultCodes.success).send({ success: "success" });
    });

  router
    .route("/send-email")

    .post(VerifyToken, (req: Request, res: Response) => {
      const body = req.body;

      model.sendEmail(body.to, body.subject, body.body);
      res.status(resultCodes.success).send({ success: "success" });
    });
};

export default post;
