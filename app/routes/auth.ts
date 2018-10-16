import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import apiUser from '../models/apikey';
import config from '../../config/api.json';
import VerifyToken from './VerifyToken';

const Auth = (router) => {
  router.post('/register', (req, res) => {
    if (
      req.body.name == null
      || req.body.email == null
      || req.body.password == null
    ) res.status(400).send('invalid mail or name');

    const query = <any>{};
    query.email = req.body.email;
    apiUser.find(query, (err, user) => {
      if (err) return res.status(500).send('There was a problem finding the user.');
      if (user.length) return res.status(400).send('Email already used');
    });

    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    apiUser.create(
      {
        name: req.body.name,
        email: req.body.email,
        api_key: hashedPassword,
        creation: Date.now(),
      },
      (err, user) => {
        if (err) {
          return res
            .status(500)
            .send('There was a problem registering the user.');
        }

        // create a token
        const token = jwt.sign({ id: user._id }, config.secret);

        res.status(200).send({ auth: true, token });
      },
    );
  });

  router.get('/me', VerifyToken, (req, res, next) => {
    apiUser.findById(req.userId, { api_key: 0 }, (err, user) => {
      if (err) return res.status(500).send('There was a problem finding the user.');
      if (!user) return res.status(404).send('No user found.');

      res.status(200).send(user);
    });
  });

  router.post('/login', (req, res) => {
    apiUser.findOne({ email: req.body.email }, (err, user) => {
      if (err) return res.status(500).send('Error on the server.');
      if (!user) return res.status(404).send('No user found.');

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.api_key,
      );
      if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

      const token = jwt.sign({ id: user._id }, config.secret);

      res.status(200).send({ auth: true, token });
    });
  });

  router.get('/logout', (req, res) => {
    res.status(200).send({ auth: false, token: null });
  });
};

export default Auth;
