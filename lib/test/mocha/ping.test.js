"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//Require the dev-dependencies
var chai_1 = __importDefault(require("chai"));
var chai_http_1 = __importDefault(require("chai-http"));
chai_1.default.use(chai_http_1.default);
chai_1.default.should();
/*
  * Test the /GET api route
  */
describe('/GET api', function () {
    it('it should say it works', function (done) {
        chai_1.default.request('http://localhost:3000')
            .get('/api')
            .end(function (err, res) {
            console.group(res.body);
            res.should.have.status(200);
            chai_1.default.expect(res.text).to.eql('{"message":"It works !"}');
            done();
        });
    });
});
