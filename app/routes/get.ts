import {
  Request, Response, Error, Router,
} from 'express';
import User, { UserSchema } from '../models/user';
import Place, { PlaceSchema } from '../models/place';
import VerifyToken from './VerifyToken';
import { encrypt } from './test';

interface QueryUser {
  name?: string,
  fname?: string,
  id_place?: string
  email?: string
}

interface Query {
  id?: string,
  using?: boolean,
}

const Get = (router: Router) => {
  function getQuery(req: Request) {
    const query_user = <QueryUser>{};
    if (req.query.name !== null) query_user.name = req.query.name;
    if (req.query.fname !== null) query_user.fname = req.query.fname;
    if (req.query.id_place !== null) query_user.id_place = req.query.id_place;

    return query_user;
  }

  router.route('/users').get(VerifyToken, (req: Request, res: Response) => {
    User.find(getQuery(req), null, (err, users: Array<UserSchema>) => {
      if (err) res.status(400).send(err);
      res.status(200).json(users);
    });
  });

  router.route('/users/last').get(VerifyToken, (req: Request, res: Response) => {
    User.find(
      getQuery(req),
      null,
      { limit: 1, sort: { _id: -1 } },
      (err, user: UserSchema) => {
        if (err) res.status(400).send(err);
        res.status(200).json(user);
      },
    );
  });

  router.route('/users/:user_id').get(VerifyToken, (req: Request, res: Response) => {
    const query = <Query>{};
    query.id = encrypt(req.params.user_id, req.userId);
    User.find(query, (err, user: UserSchema) => {
      if (err) res.status(400).send(err);
      res.status(200).json(user);
    });
  });

  router.route('/users/:user_id/last').get(VerifyToken, (req: Request, res: Response) => {
    const query = <Query>{};
    query.id = req.params.user_id;

    User.find(query, null, { limit: 1, sort: { _id: -1 } }, (err, user: UserSchema) => {
      if (err) res.status(400).send(err);
      res.status(200).json(user);
    });
  });

  router.route('/places').get(VerifyToken, (req: Request, res: Response) => {
    Place.find({}, null, (err, places: Array<PlaceSchema>) => {
      if (err) res.status(500).send(err);
      res.status(200).json(places);
    });
  });

  router.route('/places/:place_id').get(VerifyToken, (req: Request, res: Response) => {
    const query = <Query>{};
    query.id = req.params.place_id;
    Place.find(query, null, (err, user) => {
      if (err) res.status(500).send(err);

      User.find({ _id: user[0].id_user }, null, (err, user) => {
        if (err) res.status(500).send(err);
        res.status(200).json(user);
      });
    });
  });

  router.route('/places/free').get(VerifyToken, (req: Request, res: Response) => {
    const query = <Query>{};
    query.using = false;
    Place.find(query, null, (err, places: Array<PlaceSchema>) => {
      if (err) res.status(500).send(err);
      res.status(200).json(places);
    });
  });
};

export default Get;
