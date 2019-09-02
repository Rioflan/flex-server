import jwt from 'jsonwebtoken';
import {Request, Response, Error} from 'express';
import apiUser, {ApiSchema} from '../models/apikey';

/**
 * This function verify the token used.
 * @param {Request} req the current request.
 * @param {Response} res the current response.
 * @param {function} next the function's callback.
 */

const verifyToken = (req: Request, res: Response, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send({auth: false, message: 'No token provided.'});

    console.log("API_SECRET" + process.env.API_SECRET);
    console.log("TOKEN :" + token);

    jwt.verify(token, process.env.API_SECRET, (err: Error, decoded) => {
        if (err) {
            return res
                .status(500)
                .send({auth: false, message: 'Failed to authenticate token.'});
        }

        req.userId = decoded.id;

        apiUser.findById(req.userId, {api_key: 0}, (err: Error, user: ApiSchema) => {
            if (err) return res.status(500).send('There was a problem finding the user.');
            if (!user) return res.status(404).send('No user found.');

            // if everything's good, go next
            next();
        });
    });
};

export default verifyToken;