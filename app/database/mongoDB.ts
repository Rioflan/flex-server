import * as dotenv from 'dotenv';
var mongodb = require('mongodb');
var assert = require('assert');
var stream = require('stream');
import {logger} from '../app';

dotenv.config();

const wrapper = {
  getMongoUri(
    mode = process.env.DATABASE_MODE,
    host = process.env.DATABASE_HOST,
    port = process.env.DATABASE_PORT,
    user = process.env.DATABASE_USERNAME,
    pass = process.env.DATABASE_PASSWORD,
  ) {

   const mongoURI = `mongodb://${host}:${port}/${process.env.DATABASE_DB}`;
   process.stdout.write('mongoURI : '+mongoURI+'\n');

   return mongoURI;

  },
  getUserPhotoWrapper(user_id) {
    return new Promise((resolve, reject) => {
      getUserPhoto(user_id,(successResponse) => {
            if (successResponse === "Photo not found"){
              reject(successResponse);
            }else{
              resolve(successResponse);
            }
      });
    });
  },
  putFileWrapper(bytes, name) {
    return new Promise((resolve, reject) => {
      putFile(bytes, name, (successResponse) =>{
          resolve(successResponse);
      });
    })
  },
};

export default wrapper;

function putFile(bytes, name, callback){

  if (process.env.NODE_ENV === "production"){
    logger.debug('PutFile : Connection to CosmosDB in Production');
    mongodb.MongoClient.connect(
      wrapper.getMongoUri(),
      {
        auth: {
          user: process.env.DATABASE_USERNAME,
          password: process.env.DATABASE_PASSWORD
        },
      useNewUrlParser: true,
      },
       function(error, client) {
        assert.ifError(error);    
        const db = client.db("flex");
        logger.debug("GOT A CONNECTION...");
        logger.debug('Connection to CosmosDB successful');

        let opts = {
          chunkSizeBytes: 1024,
          bucketName: 'Avatars'
        };
        try{
          var bucket = new mongodb.GridFSBucket(db, opts);
          logger.debug("BUCKET CREATED...");
          try{
            const readablePhotoStream = new stream.Readable();
            readablePhotoStream.push(bytes);
            readablePhotoStream.push(null);
    
            let uploadStream = bucket.openUploadStream(name);
            let id = uploadStream.id;
            readablePhotoStream.pipe(uploadStream);
    
            uploadStream.on('error', () => {
              throw new Error("FlexOffice Internal Exception : Error uploading file");
            });
        
            uploadStream.on('finish', () => {
              logger.debug('Finished uploading file');
              callback();  
            });
    
          }catch(error){
            logger.debug("COULDN'T WRITE FILE IN DB : "+error);
            callback();
          }
        }catch(error){
          logger.debug("BUCKET CREATION FAILED : "+error);
          callback();
        } 
    });

  }else{
      logger.debug('Connection to MongoDb in Local');

      mongodb.MongoClient.connect(
          wrapper.getMongoUri(),
          {
            auth: {
              user: process.env.DATABASE_USERNAME,
              password: process.env.DATABASE_PASSWORD
            },
          useNewUrlParser: true,
          },
      ).catch(err => console.log(err));

  }

}
function getUserPhoto(user_id, callback){
  

  mongodb.MongoClient.connect(
    wrapper.getMongoUri(),
    {
      auth: {
        user: process.env.DATABASE_USERNAME,
        password: process.env.DATABASE_PASSWORD
      },
    useNewUrlParser: true,
    },
     function(err, client) {
      assert.ifError(err);    
      const db = client.db("flex");
        if (err) {
          logger.error('getUserPhoto -> Sorry unable to connect to MongoDB Error: ', err);
        } else {
          logger.debug('getUserPhoto -> CONNECTION OK');
    
            var bucket = new mongodb.GridFSBucket(db, {
                chunkSizeBytes: 1024,
                bucketName: 'Avatars'
            });
            logger.debug('getUserPhoto -> BUCKET CREATED \n');
            var str = '';
            var gotData = 0;
            try{
              bucket.openDownloadStreamByName(user_id)
              .on('error', function(error) {
                try{
                  throw new Error("FlexOffice Internal Exception : File not Found");
                }catch(e){
                  logger.error("HERE : getUserPhoto -> System Error : "  + e.message + " -> USER : "+user_id);
                  callback("Photo not found");
                }
              })
              .on('data', function(data) {
                ++gotData;
                str += data.toString('utf8');
              })
              .on('end', function() {
                logger.debug('THE END !');
                logger.debug('done!');
                callback(str);
              });
            }catch(e){
              if(e instanceof Error) {
                logger.error("getUserPhoto -> System Error : "  + e.message);
                callback("Photo not found");
              }else {
                throw e;
              }
            }       
        }
      }
    );
}