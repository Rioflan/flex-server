import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {
    Router, Request, Response
} from 'express';
import apiUser, {ApiSchema} from '../models/apikey';
import VerifyToken from './VerifyToken';
import logger from '../../config/winston';

interface QueryUser {
    name?: string,
    fname?: string,
    id_place?: string
    email?: string
}


const findUser = (req: Request, res: Response) => {
    logger.info('app.routes.auth.findUser');

    const query = <QueryUser>{};
    query.email = req.body.email;
    apiUser.find(query, (err: Error, user) => {
        logger.info('app.routes.auth.findUser.find');

        if (err) {
            logger.error('app.routes.auth.findUser.find.err.500');
            return res.status(500).send('There was a problem finding the user.')
        };
        if (user.length) {
            logger.error('app.routes.auth.findUser.find.err.400');
            return res.status(400).send('Email already used')
        };
    });
};

const createUser = (req: Request, res: Response, hashedPassword: any) => {
    logger.info('app.routes.auth.createUser');

    apiUser.create(
        {
            name: req.body.name,
            email: req.body.email,
            api_key: hashedPassword,
            creation: Date.now(),
        },
        (err: Error, user) => {
            if (err) {
                logger.error('app.routes.auth.createUser.create.err.500');

                return res
                    .status(500)
                    .send('There was a problem registering the user.');
            }

            // create a token
            const token = jwt.sign({id: user._id}, process.env.API_SECRET);

            res.status(200).send({auth: true, token});
        },
    );
};

const isValidPassword = (req, user: ApiSchema) => bcrypt.compareSync(
    req.body.password,
    user.api_key,
);

const Auth = (router: Router) => {
    /** POST /register */

    router.post('/register', (req: Request, res: Response) => {
        logger.info('app.routes.auth.post.register');

        if (
            req.body.name === null
            || req.body.email === null
            || req.body.password === null
        ) {
            logger.error('app.routes.auth.post.register.err.400');
            res.status(400).send('invalid mail or name')
        };

        logger.debug(req.body);

        findUser(req, res);

        const hashedPassword = bcrypt.hashSync(req.body.password, 8);

        createUser(req, res, hashedPassword);
    });

    /** GET /me */

    router.get('/me', VerifyToken, (req: Request, res: Response, next) => {
        logger.info('app.routes.auth.get.me');

        apiUser.findById(req.params.userId, {api_key: 0}, (err: Error, user: ApiSchema) => {
            if (err) {
                logger.error('app.routes.auth.get.me.findById.error.500');
                return res.status(500).send('There was a problem finding the user.')
            };
            if (!user) {
                logger.error('app.routes.auth.get.me.findById.error.404');
                return res.status(404).send('No user found.')
            };

            res.status(200).send(user);
        });
    });

    /** POST /login */

    router.post('/login', (req: Request, res: Response) => {
        logger.info('app.routes.auth.post.login, X-Correlation-ID : '+req.header('X-Correlation-ID'));

        apiUser.findOne({email: req.body.email}, (err: Error, user: ApiSchema) => {
            if (err) {
                logger.error('app.routes.auth.post.login.findOne.err.500');
                return res.status(500).send('Error on the server.');
            };
            if (!user) {
                logger.error('app.routes.auth.post.login.findOne.err.404');
                return res.status(404).send('No user found.');
            };

            const passwordIsValid = isValidPassword(req, user);
            logger.debug("USER : "+req.body.email);
            if (!passwordIsValid) {
                logger.error('app.routes.auth.post.login.findOne.err.401');
                return res.status(401).send({auth: false, token: null});
            };

            const token = jwt.sign({id: user._id}, process.env.API_SECRET);
            res.status(200).send({auth: true, token});
        });
    });

    /** GET /logout */

    router.get('/logout', (req: Request, res: Response) => {
        logger.info('app.routes.auth.get.logout');

        res.status(200).send({auth: false, token: null});
    });
};

export default Auth;
