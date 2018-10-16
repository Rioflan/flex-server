

import config from '../../config/mongo.json';

const DATABASE_NAME = 'appdb';

const wrapper = {
  getMongoUri(mode = config.mode, host = config.host, port = config.port, user = config.username, pass = config.password) {
    if (mode === 'local') {
    // local mongo database URI
      return `mongodb://${host}:${port}/${config.db}`;
    }

    if (mode === 'remote') {
    // mlab mongo database URI
    // default mlab database
      let mongodbHost = config.host;
      let mongodbPort = config.port;
      let mongodbUser = config.username;
      let mongodbPass = config.password;

      // custom mlab database URI
      if (arguments.length === 5) {
        mongodbHost = host;
        mongodbPort = port;
        mongodbUser = user;
        mongodbPass = pass;
      }

      return `mongodb://${mongodbUser}:${mongodbPass}@${mongodbHost}:${mongodbPort}/${DATABASE_NAME}`;
    }
  },
};

export default wrapper;
