import { Request, Response, Router } from "express";
import VerifyToken from "./VerifyToken";
import { encrypt, decrypt } from "./test";
import * as model from "../models/model";
import Place from "../models/place";
//var mongodb = require('mongodb');
import dbconfig from '../database/mongoDB';

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
    const users = await model.getUsers();
    const usersDecrypted = users.map(user => {
      return {
        id: user.id,
        name: decrypt(user.name || "", req.userId),
        fname: decrypt(user.fname || "", req.userId),
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
      const user_id = encrypt(req.params.user_id, req.userId);
      const user = await model.getUserById(user_id);
      const friendsArray = user.friend;
      const usersDecrypted = friendsArray.map(friend => {
        return {
          id: friend.id,
          name: decrypt(friend.name || "", req.userId),
          fname: decrypt(friend.fname || "", req.userId),
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
      var image;
      if (process.env.NODE_ENV === 'development') {
        image = await dbconfig.getUserPhotoWrapper(req.params.user_id);
      }

      process.stdout.write(">>>>>>>>>>>>>>>>>>>>>>>>< CHECK THE PHOTO\n");
  
      res.status(200).json({
          id: user.id,
          name: decrypt(user.name || "", req.userId),
          fname: decrypt(user.fname || "", req.userId),
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
      const id_user = encrypt(req.params.user_id, req.userId);
      const place = await Place.findOne({ id_owner: id_user })
      res.status(200).json(place);
      });

  /** GET /places */

  router
    .route("/places")
    .get(VerifyToken, async (req: Request, res: Response) => {
      const places = await model.getPlaces();
      res.status(200).json(places);
  });

  router
    .route("/places/reset")
    .get(VerifyToken, async (req: Request, res: Response) => {
      await model.resetPlaces(websocket, pool);
      res.status(200).send("Places successfully reset");
    })
};
/*
function getUserPhotoWrapper(user_id) {
  return new Promise((resolve, reject) => {
    getUserPhoto(user_id,(successResponse) => {
          process.stdout.write('RESOLVED!!!!!!!!!!!!\n');

          resolve(successResponse);
      });
  });
}*/


/*
function getUserPhoto(user_id, callback){
  var url = 'mongodb://localhost:27017/flex';
  mongodb.MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    const db = client.db("flex");
 
    if (err) {
      process.stdout.write('Sorry unable to connect to MongoDB Error:', err+'\n');
    } else {
      process.stdout.write('CONNECTION OK \n');

        var bucket = new mongodb.GridFSBucket(db, {
            chunkSizeBytes: 1024,
            bucketName: 'Avatars'
        });
        process.stdout.write('BUCKET CREATED \n');
        var str = '';
        var gotData = 0;
        bucket.openDownloadStreamByName(user_id)
        .on('error', function(error) {
          process.stdout.write('Error:-', error+'\n');
        })
        .on('data', function(data) {
          process.stdout.write('GOT DATA!\n');
          ++gotData;
          str += data.toString('utf8');
        })
        .on('end', function() {
          process.stdout.write('done!');
          callback(str);
        });
        
    }
});

}
*/
export default Get;
