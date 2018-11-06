import express, { Router, Request, Response } from 'express'; //  call express
import bodyParser from 'body-parser';

import Post from './routes/post';
import Get from './routes/get';
import Auth from './routes/auth';
import sslRedirect from 'heroku-ssl-redirect';

const app: express.Application = express(); // use express on our app

const router: Router = express.Router(); // get an instance of the express Router
Post(router);
Get(router);
Auth(router);

router.use((req: Request, res: Response, next) => {
  console.log(req.connection.remoteAddress);
  next();
});
 
router.get('/', (req: Request, res: Response) => {
  res.json({ message: 'It works !' });
});

// enable ssl redirect
app.use(sslRedirect());

// configure app to use bodyParser() => get data from http request (POST)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api', router); // define the default route

export default app;
