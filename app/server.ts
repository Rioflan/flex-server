import mongoose from 'mongoose';
import dbconfig from './database/mongoDB';

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
