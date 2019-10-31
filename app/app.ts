import express, { Router, Request, Response } from 'express'; //  call express
import bodyParser from 'body-parser';

import Post from "./routes/post";
import Get from "./routes/get";
import Auth from "./routes/auth";
import * as dotenv from 'dotenv';

dotenv.config();

const app: express.Application = express(); // use express on our app

//app.use(cors());
process.stdout.write("\nON LAUNCH >>>>> process.env.NODE_ENV      is "+process.env.NODE_ENV+"\n");
process.stdout.write("\n          >>>>> process.env.DATABASE_HOST is "+process.env.DATABASE_HOST+"\n");
process.stdout.write("\n          >>>>> process.env.DATABASE_PORT is "+process.env.DATABASE_PORT+"\n");
process.stdout.write("\n          >>>>> process.env.DATABASE_DB   is "+process.env.DATABASE_DB+"\n");
process.stdout.write("\n          >>>>> process.env.DATABASE_MODE is "+process.env.DATABASE_MODE+"\n");
process.stdout.write("\n          >>>>> process.env.LOGIN_REGEX   is "+process.env.LOGIN_REGEX+"\n");
process.stdout.write("\n >>>>>>>>>  VERSION 0.3.8  <<<<<<<<<<<<<\n");

export const listOfRoutes = (router: Router, websocket, pool) => {
  Post(router);
  Get(router, websocket, pool);
  Auth(router);
};

export const router: Router = express.Router(); // get an instance of the express Router

router.use((req: Request, res: Response, next) => {
  next();
});

router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'It works !' });
});

// configure app to use bodyParser() => get data from http request (POST)
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb', extended: true }));

app.use('/api', router); // define the default route

export default app;
