import dotenv from 'dotenv';

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
};

export default wrapper;
