import express, { Router, Request, Response } from 'express'; //  call express
import bodyParser from 'body-parser';

import Post from "./routes/post";
import Get from "./routes/get";
import Auth from "./routes/auth";
import * as dotenv from 'dotenv';

dotenv.config();

import * as winston from '../config/winston';
import logger from '../config/winston';
import morgan from 'morgan';

export var LOG_LEVEL = process.env.REACT_APP_LOG_LEVEL || "info";

const app: express.Application = express(); // use express on our app

logger.info(" ON LAUNCH >>>>>");
logger.info(" NODE_ENV      is "+process.env.NODE_ENV);
logger.info(" DATABASE_HOST is "+process.env.DATABASE_HOST);
logger.info(" DATABASE_PORT is "+process.env.DATABASE_PORT);
logger.info(" DATABASE_DB   is "+process.env.DATABASE_DB);
logger.info(" DATABASE_MODE is "+process.env.DATABASE_MODE);
logger.info(" LOGIN_REGEX   is "+process.env.LOGIN_REGEX);
logger.info(" LOG_LEVEL     is "+LOG_LEVEL);
logger.info(" >>>>>>>>>  VERSION 0.4.8  <<<<<<<<<<<<<");

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

// configure logger
// log format used by the morgan package to combined, 
// which is the standard Apache log format and will include useful information in the logs such as remote IP address 
// and the user-agent HTTP request header.
app.use(morgan ('combined',{ stream: winston.stream }));

// configure app to use bodyParser() => get data from http request (POST)
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

app.use('/api', router); // define the default route

export default app;
