import mongoose from 'mongoose'; // call mongoose
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import dbconfig from './database/mongoDB';

import app from './app';

const certPath = 'cert';

// const httpsOptions = {
//     key:   fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
//     cert:   fs.readFileSync(path.join(__dirname, 'cert', 'server.cert'))
// };

const DEFAULT_URI: string | undefined = dbconfig.getMongoUri(); //  get the URI from config file

const DEFAULT_PORT: number = 3000;

mongoose.connect(
  DEFAULT_URI,
  { useNewUrlParser: true },
);

const server = app.listen(process.env.PORT || DEFAULT_PORT, () => {
  const port = server.address().port;
  console.log('App now running on port : ', port);
});

// http.createServer(httpApp).listen(httpApp.get('port'), function() {
//     console.log('Express HTTP server listening on port ' + httpApp.get('port'));
// });

// https.createServer(httpsOptions, app).listen(process.env.PORT || DEFAULT_PORT, function() {
//     console.log('Express HTTPS server listening on port ' + DEFAULT_PORT);
// });
