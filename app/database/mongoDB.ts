import * as dotenv from 'dotenv';
var mongodb = require('mongodb');

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
      return mongoURI;
    }
  },
  getUserPhotoWrapper(user_id) {
    return new Promise((resolve, reject) => {
      getUserPhoto(user_id,(successResponse) => {
            process.stdout.write('RESOLVED!!!!!!!!!!!!\n');
            resolve(successResponse);
        });
    });
  },
  
};

export default wrapper;

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