"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var express_1 = __importDefault(require("express"));
var app = express_1.default();
app.get('/ping', function (req, res) {
    res.status(200).json({ message: 'pong' });
});
describe('GET /ping', function () {
    it('responds with json', function () { return supertest_1.default(app)
        .get('/ping')
        .set('Accept', 'application/json')
        .expect(200)
        .then(function (response) {
        expect(response.body.message).toEqual('pong');
    }); });
});
