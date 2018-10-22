"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var supertest_1 = __importDefault(require("supertest"));
var app_1 = __importDefault(require("../app"));
var mockgoose_1 = require("mockgoose");
var mongoose_1 = __importDefault(require("mongoose"));
var mockgoose = new mockgoose_1.Mockgoose(mongoose_1.default);
describe("Server launch", function () {
    afterEach(function () {
        return mockgoose.helper.reset();
    });
    afterAll(function () { return mongoose_1.default.disconnect(); });
    it("responds with json", function () {
        return supertest_1.default(app_1.default)
            .get("/api")
            .set("Accept", "application/json")
            .expect(200)
            .then(function (response) {
            expect(response.body.message).toEqual("It works !");
        });
    });
});
