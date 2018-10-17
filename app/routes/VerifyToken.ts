import jwt from 'jsonwebtoken';
import { Request, Response, Error } from 'express';
import config from '../config/api.json';
import apiUser, { ApiSchema } from '../models/apikey';

const verifyToken = (req: Request, res: Response, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, (err: Error, decoded) => {
    if (err) {
      return res
        .status(500)
        .send({ auth: false, message: 'Failed to authenticate token.' });
    }

    req.userId = decoded.id;

    apiUser.findById(req.userId, { api_key: 0 }, (err: Error, user: ApiSchema) => {
      if (err) return res.status(500).send('There was a problem finding the user.');
      if (!user) return res.status(404).send('No user found.');

      // if everything good, go next
      next();
    });
  });
};

export default verifyToken;
