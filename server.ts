import express, { Router, Request, Response } from "express"; //call express
import bodyParser from "body-parser"; //call body-parser
import mongoose from "mongoose"; //call mongoose
import dbconfig from "./app/database/mongoDB";

import Post from "./app/routes/post";
import Get from "./app/routes/get";
import Auth from "./app/routes/auth";

import fs from "fs";

import path from "path";

const certPath = "cert";

import https from "https";
import http from "http";

// const httpsOptions = {
//     key:   fs.readFileSync(path.join(__dirname, 'cert', 'server.key')),
//     cert:   fs.readFileSync(path.join(__dirname, 'cert', 'server.cert'))
// };

let app: express.Application = express(); //use express on our app

let router: Router = express.Router(); // get an instance of the express Router
Post(router);
Get(router);
Auth(router);

// configure app to use bodyParser() => get data from http request (POST)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
console.log(dbconfig.getMongoUri())
let DEFAULT_URI: string | undefined = dbconfig.getMongoUri(); //get the URI from config file

let DEFAULT_PORT: number = 3000;

mongoose.connect(
  DEFAULT_URI,
  { useNewUrlParser: true }
);

router.use(function(req: Request, res: Response, next) {
  console.log(req.connection.remoteAddress);
  next();
});

router.get("/", function(req: Request, res: Response) {
  res.json({ message: "It works !" });
});

app.use("/api", router); //define the default route

let server = app.listen(process.env.PORT || DEFAULT_PORT, function() {
  let port = server.address().port;
  console.log("App now running on port : ", port);
});

// http.createServer(httpApp).listen(httpApp.get('port'), function() {
//     console.log('Express HTTP server listening on port ' + httpApp.get('port'));
// });

// https.createServer(httpsOptions, app).listen(process.env.PORT || DEFAULT_PORT, function() {
//     console.log('Express HTTPS server listening on port ' + DEFAULT_PORT);
// });
