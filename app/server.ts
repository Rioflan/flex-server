import mongoose from 'mongoose';
import dbconfig from './database/mongoDB';
import socketio from "socket.io";
import Place from "./models/place"
import cron from "cron";

import app from './app';

const DEFAULT_URI: string | undefined = dbconfig.getMongoUri(); //  get the URI from config file

const DEFAULT_PORT: number = 3000;

try {
    mongoose.connect(
        DEFAULT_URI,
        { useNewUrlParser: true },
    ).catch(err => console.log(err));
} catch (err) {
    console.log(err);
}

const server = app.listen(process.env.PORT || DEFAULT_PORT, () => {
    const port = server.address().port;
    console.log('App now running on port : ', port);
});

const websocket = socketio(server);

let pool = new Array();

websocket.on('connect', (socket) => {
    socket.on('joinRoom', room => socket.join(room));
    socket.on('leaveRoom', room => socket.leave(room));
    socket.on('checkPlace', place => {
        const index = pool.indexOf(place);
        if (index > -1) {
            socket.emit('leavePlace');
            pool.splice(index, 1);
        }
        else
            socket.join(place);
    });
});

const freePlaces = async () => {
    const usedPlaces = await Place.find({using: true});
    const nbPlaces = usedPlaces.length;
    let place;
    for (let i = 0; i < nbPlaces; i++) { // for each place that is used
        place = usedPlaces[i];
        Place.updateOne({ id: place.id }, { using: false, id_user: "" }); // free the place
        
        // notify the user
        const userConnected = websocket.sockets.adapter.rooms[place.id];
        if (userConnected)
            websocket.in(place.id).emit('leavePlace');
        else
            pool.push(place.id);
    }
}

// this cron task will call freePlaces() every day at midnight (Paris time)
cron.job("00 00 00 * * *", freePlaces, null, true, "Europe/Paris");