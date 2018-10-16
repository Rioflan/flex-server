import express from 'express';
import request from 'supertest';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import { Mockgoose } from 'mockgoose';
import dbconfig from '../database/mongoDB';

const mockgoose = new Mockgoose(mongoose);

const verifyToken = null;

const router = express.Router();
require('../routes/auth')(router);

const DEFAULT_URI = dbconfig.getMongoUri(); // get the URI from config file

mongoose.connect(
  DEFAULT_URI,
  { useNewUrlParser: true },
);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', router);

describe('POST /register', () => {
  beforeAll = () => mongoose.connect(
    DEFAULT_URI,
    { useNewUrlParser: true },
  );
  beforeEach = () => afterEach(() => mockgoose.helper.reset());

  afterAll(() => {
    const { connections } = mongoose;
    const { childProcess } = mockgoose.mongodHelper.mongoBin;
    // kill mongod
    childProcess.kill();
    // close all connections
    for (const con of connections) {
      return con.close();
    }
    return mongoose.disconnect();
  });
  it('responds Register', () => {
    request(app)
      .post('/register')
      .send('name=john&email=testtt@test.com&password=12345')
      .set('Accept', 'x-www-form-urlencoded')
      .expect(200);
  });

  it('responds Login', () => {
    request(app)
      .post('/login')
      .send('email=testtt@test.com')
      .set('Accept', 'x-www-form-urlencoded')
      .expect(200);
  });
});

// describe('POST /login_user', function() {
//   it('responds with json', function() {
//     return request(app)
//       .post('/login_user')
//       .send({name: 'test', fname: 'test', id_user: '12345'})
//       .set('Accept', 'application/json')
//       .expect(200)
//   });
// });
