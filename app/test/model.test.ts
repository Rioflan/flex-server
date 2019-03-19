import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import assert from "assert";
import * as model from '../models/model';

let mockDB;

describe('Testing models', () => {
    
    beforeAll(async () => {
        mockDB = new MongoMemoryServer();
        const uri = await mockDB.getConnectionString();
        await mongoose.connect(uri, { useNewUrlParser: true });
    });

    describe('Users collection', () => {
        it('add a new user', async () => {
            await model.addUser("AA00000", "Name", "Fname");
            const user = await model.getUserById("AA00000");
            assert(user);
        });

        it('update a user', async () => {
          model.updateUser("AA00000", { name: "OtherName" });
          const name = await model.getUserById("AA00000").then(user => user.name);
          assert.equal(name, "OtherName");
        });

        it('get a user by ID', async () => {
          const user = await model.getUserById("AA00000");
          assert(user);
        });
    });

    afterAll(() => {
        mongoose.disconnect();
        mockDB.stop();
    });

});