import config from '../config/mongo.json';
import dotenv from 'dotenv';

const DATABASE_NAME = 'appdb';
dotenv.config();

const wrapper = {
  getMongoUri(
    mode = config.mode,
    host = config.host,
    port = config.port,
    user = config.username,
    pass = config.password,
  ) {
    if (mode === 'local') {
      // local mongo database URI
      return `mongodb://${host}:${port}/${config.db}`;
    }

    if (mode === 'remote') {
      // mlab mongo database URI
      // default mlab database
      // let mongodbHost = config.host;
      // let mongodbPort = config.port;
      // let mongodbUser = config.username;
      // let mongodbPass = config.password;

      // custom mlab database URI
      // if (arguments.length === 5) {
      //   mongodbHost = host;
      //   mongodbPort = port;
      //   mongodbUser = user;
      //   mongodbPass = pass;
      // }

      // const mongoURI = `mongodb://${mongodbUser}:${mongodbPass}@${mongodbHost}:${mongodbPort}/${DATABASE_NAME}`;
      const mongoURI = process.env.DATABASE_URL;
      return mongoURI;
    }
  },
};

export default wrapper;
