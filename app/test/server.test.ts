import request from "supertest";
import express from "express";
import app from "../app";
import { Mockgoose } from "mockgoose";
import dbconfig from "../database/mongoDB";
import mongoose from "mongoose";

const mockgoose = new Mockgoose(mongoose);

describe("Server launch", () => {
  afterEach(function() {
    return mockgoose.helper.reset();
  });

  afterAll(() => mongoose.disconnect());

  it("responds with json", () =>
    request(app)
      .get("/api")
      .set("Accept", "application/json")
      .expect(200)
      .then(response => {
        expect(response.body.message).toEqual("It works !");
      }));
});
