const request = require('supertest');
const express = require('express');

const app = express();

app.get('/ping', function(req, res) {
  res.status(200).json({ message: 'pong' });
});

describe('GET /ping', function() {
  it('responds with json', function() {
    return request(app)
      .get('/ping')
      .set('Accept', 'application/json')
      .expect(200)
      .then(response => {
          expect(response.body.message).toEqual('pong');
      })
  });
});