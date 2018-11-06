import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import dbconfig from './database/mongoDB';
import enforce from 'express-sslify';

import app from './app';

const certPath = 'cert';

const DEFAULT_URI: string | undefined = dbconfig.getMongoUri(); //  get the URI from config file

const DEFAULT_PORT: number = 3000;

// Redirect HTTP -> HTTPS
app.use(enforce.HTTPS({ trustProtoHeader: true }))

try {
  mongoose.connect(
    DEFAULT_URI,
    { useNewUrlParser: true },
  ).catch(err => console.log(err));
} catch (err) {
  console.log(err);
}

http.createServer(app).listen(process.env.PORT || DEFAULT_PORT, () => {
  const port = server.address().port;
  console.log('App now running on port : ', port);
});
