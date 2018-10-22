import request from 'supertest';
import express from 'express';
import { Mockgoose } from 'mockgoose';
import mongoose from 'mongoose';
import app from '../app';
import dbconfig from '../database/mongoDB';

const mockgoose = new Mockgoose(mongoose);

describe('Server launch', () => {
  afterEach(() => mockgoose.helper.reset());

  afterAll(() => mongoose.disconnect());

  it('responds with json', () => request(app)
    .get('/api')
    .set('Accept', 'application/json')
    .expect(200)
    .then((response) => {
      expect(response.body.message).toEqual('It works !');
    }));
});
