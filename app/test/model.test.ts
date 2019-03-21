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

        it('get all users', async () => {
            const users = await model.getUsers();
            assert(users);
        });

        it('check user existence', async () => {
            assert(await model.userExists("AA00000"));
            assert(!(await model.userExists("BB11111")));
        });
    });

    describe('Places collection', () => {
        it('add a new place', async () => {
            await model.addPlace("4-V-RER10");
            const place = await model.getPlaceById("4-V-RER10");
            assert(place);
        });

        it('update a place', async () => {
            model.updatePlace("4-V-RER10", { using: true, id_user: "AA00000" });
            const place = await model.getPlaceById("4-V-RER10").then(place => {
                return { using: place.using, id_user: place.id_user }
            });
            assert.deepEqual(place, { using: true, id_user: "AA00000" });
        });
  
        it('get a place by ID', async () => {
            const place = await model.getPlaceById("4-V-RER10");
            assert(place);
        });

        it('get the user using a place', async () => {
            const id_user = await model.whoUses("4-V-RER10");
            assert.equal(id_user, "AA00000");
            model.updatePlace("4-V-RER10", { using: false, id_user: "" });
            const noOne = await model.whoUses("4-V-RER10");
            assert(!noOne);
            const sharp = await model.whoUses("WrongID");
            assert.equal(sharp, "#");
        });
    })

    afterAll(() => {
        mongoose.disconnect();
        mockDB.stop();
    });

});