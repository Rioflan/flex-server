const post = require("../routes/post");
const express = require("express");
const request = require("supertest");
const bodyParser = require("body-parser");
const dbconfig = require("../database/mongoDB");
const mongoose = require("mongoose");
let { Mockgoose } = require("mockgoose");

var mockgoose = new Mockgoose(mongoose);

let verifyToken = null;

const router = express.Router();
require("../routes/auth")(router);

let DEFAULT_URI = dbconfig.getMongoUri(); //get the URI from config file

let DEFAULT_PORT = 3000;

mongoose.connect(
  DEFAULT_URI,
  { useNewUrlParser: true }
);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/", router);

describe("POST /register", function() {
  beforeAll = () => mongoose.connect(
  DEFAULT_URI,
  { useNewUrlParser: true }
);
beforeEach = () => 
  afterEach(function() {
    return mockgoose.helper.reset();
  });

  afterAll(function() {
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
  it("responds Register", () => {
    request(app)
      .post("/register")
      .send("name=john&email=testtt@test.com&password=12345")
      .set("Accept", "x-www-form-urlencoded")
      .expect(200);
  });

  it("responds Login", () => {
    request(app)
      .post("/login")
      .send("email=testtt@test.com")
      .set("Accept", "x-www-form-urlencoded")
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
