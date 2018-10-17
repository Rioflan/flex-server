"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var supertest_1 = __importDefault(require("supertest"));
var body_parser_1 = __importDefault(require("body-parser"));
var mongoose_1 = __importDefault(require("mongoose"));
var mockgoose_1 = require("mockgoose");
var mongoDB_1 = __importDefault(require("../database/mongoDB"));
var mockgoose = new mockgoose_1.Mockgoose(mongoose_1.default);
var verifyToken = null;
var router = express_1.default.Router();
require('../routes/auth')(router);
var DEFAULT_URI = mongoDB_1.default.getMongoUri(); // get the URI from config file
mongoose_1.default.connect(DEFAULT_URI, { useNewUrlParser: true });
var app = express_1.default();
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use('/', router);
describe('POST /register', function () {
    beforeAll = function () { return mongoose_1.default.connect(DEFAULT_URI, { useNewUrlParser: true }); };
    beforeEach = function () { return afterEach(function () { return mockgoose.helper.reset(); }); };
    afterAll(function () {
        var connections = mongoose_1.default.connections;
        var childProcess = mockgoose.mongodHelper.mongoBin.childProcess;
        // kill mongod
        childProcess.kill();
        // close all connections
        for (var _i = 0, connections_1 = connections; _i < connections_1.length; _i++) {
            var con = connections_1[_i];
            return con.close();
        }
        return mongoose_1.default.disconnect();
    });
    it('responds Register', function () {
        supertest_1.default(app)
            .post('/register')
            .send('name=john&email=testtt@test.com&password=12345')
            .set('Accept', 'x-www-form-urlencoded')
            .expect(200);
    });
    it('responds Login', function () {
        supertest_1.default(app)
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
