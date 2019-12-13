import mongoose from 'mongoose';
import dbconfig from './database/mongoDB';
import socketio from "socket.io";
import { encrypt } from './routes/test';
import { updateUser, getPooledUsers } from "./models/model";
import * as dotenv from 'dotenv';

import app, { router, listOfRoutes } from './app';
import { AddressInfo } from 'net';
import logger from '../config/winston';

const DEFAULT_URI: string | undefined = dbconfig.getMongoUri(); //  get the URI from config file

const DEFAULT_PORT: number = 3000;

dotenv.config();

try {

    if (process.env.NODE_ENV === "production" && process.env.DATABASE_MODE === "remote"){
        logger.info('Connection to DB in Production');
        mongoose.connect("mongodb://"+process.env.DATABASE_HOST+":"+process.env.DATABASE_PORT+"/"+process.env.DATABASE_DB, {
            auth: {
                user: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD
              },
            useNewUrlParser: true,
          })
          .then(() => logger.info('Connection to DB successful'))
          .catch((err) => logger.error(err));
    }else{
        logger.info('Connection to MongoDb in Local');

        mongoose.connect("mongodb://"+process.env.DATABASE_HOST+":"+process.env.DATABASE_PORT+"/"+process.env.DATABASE_DB, {
            auth: {
                user: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD
              },
            useNewUrlParser: true,
          })
          .then(() => logger.info('Connection to DB successful'))
          .catch((err) => logger.error(err));
    
    }
    

} catch (err) {
    logger.log(err);
}

async function init() {
    const server = app.listen(process.env.PORT || DEFAULT_PORT, () => {
        const address = server.address() as AddressInfo;
        logger.info('App now running on port : ' + address.port);
    });

   const websocket = socketio(server);
    let pool = await getPooledUsers();

    websocket.on('connect', (socket) => {
        socket.on('joinRoom', room => socket.join(room));
        socket.on('leaveRoom', room => socket.leave(room));
        socket.on('checkPlace', (id_user, id_place, apiUserId) => {
            id_user = encrypt(id_user, apiUserId);
            const index = pool.indexOf(id_user);
            if (index > -1) {
                socket.emit('leavePlace');
                pool.splice(index, 1);
                updateUser(id_user, { pool: false });
                logger.info(`User ${id_user} removed from pool`);
            }
            else
                socket.join(id_place);
        });
    });
    listOfRoutes(router, websocket, pool);
}

init();