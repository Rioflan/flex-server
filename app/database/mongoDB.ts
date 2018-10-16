

import config from '../../config/mongo';

const DATABASE_NAME = 'appdb';

const wrapper = {
  getMongoUri(mode, host, port, user, pass) {
    if (config.mode === 'local') {
    // local mongo database URI
      return `mongodb://${config.host}:${config.post}/${config.db}`;
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
