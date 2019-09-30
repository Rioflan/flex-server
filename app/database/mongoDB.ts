import * as dotenv from 'dotenv';
var mongodb = require('mongodb');
var assert = require('assert');
var stream = require('stream');

dotenv.config();

const wrapper = {
  getMongoUri(
    mode = process.env.DATABASE_MODE,
    host = process.env.DATABASE_HOST,
    port = process.env.DATABASE_PORT,
    user = process.env.DATABASE_USERNAME,
    pass = process.env.DATABASE_PASSWORD,
  ) {
    if (mode === 'local') {
      // local mongo database URI
      return `mongodb://${host}:${port}/${process.env.DATABASE_DB}`;
    }

    if (mode === "remote") {
      // mlab mongo database URI
      // default mlab database
      let mongodbHost = process.env.DATABASE_HOST;
      let mongodbPort = process.env.DATABASE_PORT;
      let mongodbUser = process.env.DATABASE_USERNAME;
      let mongodbPass = process.env.DATABASE_PASSWORD;

      const mongoURI = process.env.DATABASE_URL === "" ? // temporary before a fix is done
      `mongodb://${mongodbUser}:${mongodbPass}@${mongodbHost}:${mongodbPort}/${process.env.DATABASE_DB}`
      : process.env.DATABASE_URL; // temporary before a fix is done
      process.stdout.write('mongoURI : '+mongoURI+'\n');

      return mongoURI;
    }
  },
  getUserPhotoWrapper(user_id) {
    return new Promise((resolve, reject) => {
      getUserPhoto(user_id,(successResponse) => {
            if (successResponse === "Photo not found"){
              reject(successResponse);
            }else{
              process.stdout.write('RESOLVED!!!!!!!!!!!!\n');
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
  mongodb.MongoClient.connect(wrapper.getMongoUri(), function(error, client) {
    assert.ifError(error);    
    const db = client.db("flex");
    process.stdout.write("GOT A CONNECTION...\n");

    let opts = {
      chunkSizeBytes: 1024,
      bucketName: 'Avatars'
    };
    try{
      var bucket = new mongodb.GridFSBucket(db, opts);
      process.stdout.write("BUCKET CREATED...\n");
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
          process.stdout.write('\nFinished uploading file\n');
          callback();  
        });

      }catch(error){
        process.stdout.write("COULDN'T WRITE FILE IN DB...\n"+error+"\n");
        callback();
      }
    }catch(error){
      process.stdout.write("BUCKET CREATION FAILED...\n"+error);
      callback();
    }    
  });

}
function getUserPhoto(user_id, callback){
  var url = 'mongodb://localhost:27017/flex';
  mongodb.MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
    const db = client.db("flex");
 
    if (err) {
      process.stdout.write('getUserPhoto -> Sorry unable to connect to MongoDB Error:', err+'\n');
    } else {
      process.stdout.write('getUserPhoto -> CONNECTION OK \n');

        var bucket = new mongodb.GridFSBucket(db, {
            chunkSizeBytes: 1024,
            bucketName: 'Avatars'
        });
        process.stdout.write('getUserPhoto -> BUCKET CREATED \n');
        var str = '';
        var gotData = 0;
        try{
          bucket.openDownloadStreamByName(user_id)
          .on('error', function(error) {
            try{
              throw new Error("FlexOffice Internal Exception : File not Found");
            }catch(e){
              process.stdout.write("HERE : getUserPhoto -> System Error : "  + e.message);
              callback("Photo not found");
            }
          })
          .on('data', function(data) {
            process.stdout.write('Got DATA !\n');
            ++gotData;
            str += data.toString('utf8');
          })
          .on('end', function() {
            process.stdout.write('THE END !\n');
            process.stdout.write('done!');
            callback(str);
          });
        }catch(e){
          if(e instanceof Error) {
            process.stdout.write("getUserPhoto -> System Error : "  + e.message);
            callback("Photo not found");
          }else {
            throw e;
          }
        }       
    }
});

}