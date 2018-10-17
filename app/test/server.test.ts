import request from 'supertest';
import express from 'express';

const app = express();

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'pong' });
});

describe('GET /ping', () => {
  it('responds with json', () => request(app)
    .get('/ping')
    .set('Accept', 'application/json')
    .expect(200)
    .then((response) => {
      expect(response.body.message).toEqual('pong');
    }));
});
