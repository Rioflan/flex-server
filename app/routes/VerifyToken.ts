import jwt from 'jsonwebtoken';
import {Request, Response} from 'express';
import apiUser, {ApiSchema} from '../models/apikey';
import logger from '../../config/winston';


/**
 * This function verify the token used.
 * @param {Request} req the current request.
 * @param {Response} res the current response.
 * @param {function} next the function's callback.
 */

const verifyToken = (req: Request, res: Response, next) => {
    logger.info('app.routes.verifyToken');
    
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send({auth: false, message: 'No token provided.'});
    
    const tokenArray = token.split(" ");

    logger.debug("Verify token : "+token);
    if (!tokenArray[1]) return res.status(403).send({auth: false, message: 'No token provided.'});
    logger.debug("Secret : " + process.env.API_SECRET);
    jwt.verify(tokenArray[1], process.env.API_SECRET, (err: Error, decoded) => {
        if (err) {
            return res
                .status(500)
                .send({auth: false, message: 'Failed to authenticate token.'});
        }

        req.params.userId = decoded.id;

        apiUser.findById(req.params.userId, {api_key: 0}, (err: Error, user: ApiSchema) => {
            if (err) return res.status(500).send('There was a problem finding the user.');
            if (!user) return res.status(404).send('No user found.');

            // if everything's good, go next
            next();
        });
    });
};

export default verifyToken;