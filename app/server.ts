import mongoose from 'mongoose';
import dbconfig from './database/mongoDB';
import socketio from "socket.io";
import { encrypt } from './routes/test';
import { updateUser, getPooledUsers } from "./models/model";
import * as dotenv from 'dotenv';

import app, { router, listOfRoutes } from './app';

const DEFAULT_URI: string | undefined = dbconfig.getMongoUri(); //  get the URI from config file

const DEFAULT_PORT: number = 3000;

dotenv.config();

try {
    console.log();

    if (process.env.NODE_ENV === "production"){
        console.log('Connection to CosmosDB in Production');
        mongoose.connect("mongodb://"+process.env.DATABASE_HOST+":"+process.env.DATABASE_PORT+"/"+process.env.DATABASE_DB, {
            auth: {
                user: process.env.DATABASE_USERNAME,
                password: process.env.DATABASE_PASSWORD
              },
            useNewUrlParser: true,
          })
          .then(() => console.log('Connection to CosmosDB successful'))
          .catch((err) => console.error(err));
    }else{
        console.log('Connection to MongoDb in Local');

        mongoose.connect(
            DEFAULT_URI,
            { useNewUrlParser: true },
        ).catch(err => console.log(err));
    
    }
    

} catch (err) {
    console.log(err);
}

async function init() {
    const server = app.listen(process.env.PORT || DEFAULT_PORT, () => {
        const port = server.address().port;
        console.log('App now running on port : ', port);
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
                console.log(`User ${id_user} removed from pool`);
            }
            else
                socket.join(id_place);
        });
    });
    listOfRoutes(router, websocket, pool);
}

init();