import express, { Router, Request, Response } from "express"; //  call express
import bodyParser from "body-parser";

import Post from "./routes/post";
import Get from "./routes/get";
import Auth from "./routes/auth";
import enforce from "express-sslify";

const app: express.Application = express(); // use express on our app

if (process.env.NODE_ENV === "production")
  app.use(enforce.HTTPS({ trustProtoHeader: true })); // Redirect http => https

export const listOfRoutes = (router: Router, websocket, pool) => {
  Post(router);
  Get(router, websocket, pool);
  Auth(router);
};

export const router: Router = express.Router(); // get an instance of the express Router

router.use((req: Request, res: Response, next) => {
  console.log(req.connection.remoteAddress);
  next();
});

router.get("/", (req: Request, res: Response) => {
  res.json({ message: "It works !" });
});

// configure app to use bodyParser() => get data from http request (POST)
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));

app.use("/api", router); // define the default route

export default app;
