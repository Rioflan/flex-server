import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import assert from "assert";
import * as model from '../models/model';
jest.mock('cloudinary');
import cloudinary from 'cloudinary';
import PooledPlace from "../models/pooledPlace";

let mockDB;

describe('Testing models', () => {

    beforeAll(async () => {
        mockDB = new MongoMemoryServer();
        const uri = await mockDB.getConnectionString();
        await mongoose.connect(uri, { useNewUrlParser: true });
    });

    describe('Users collection', () => {
        it('adds a new user', async () => {
            await model.addUser("AA00000", "Name", "Fname");
            const user = await model.getUserById("AA00000");
            assert(user);
        });

        it('updates a user', async () => {
            model.updateUser("AA00000", { name: "OtherName" });
            const name = await model.getUserById("AA00000").then(user => user.name);
            assert.equal(name, "OtherName");
        });

        it('updates many users', async () => {
            await model.addUser("AA00001", "Name", "Fname");
            model.updateManyUsers({ id: /AA0000\d/ }, { name: "OtherName" });
            const nameA = await model.getUserById("AA00000").then(user => user.name);
            const nameB = await model.getUserById("AA00001").then(user => user.name);
            assert.equal(nameA, "OtherName");
            assert.equal(nameA, "OtherName");
        });

        it('gets a user by ID', async () => {
            const user = await model.getUserById("AA00000");
            assert(user);
        });

        it('gets all users', async () => {
            const users = await model.getUsers();
            assert(users);
        });

        it('checks user existence', async () => {
            assert(await model.userExists("AA00000"));
            assert(!(await model.userExists("BB11111")));
        });

        it('updates a photo', async () => {
            const imgUrl = "https://mlpforums.com/uploads/monthly_10_2013/post-18536-0-17144400-1381282031.jpg";
            cloudinary.uploader = {
                upload: jest.fn(() => new Promise(resolve => resolve({ secure_url: imgUrl })))
            };
            await model.updatePhoto("AA00000", imgUrl);
            const photo = await model.getUserById("AA00000").then(user => user.photo);
            assert.equal(photo, imgUrl);
        });

        it('uploads a photo', async () => {
            const imgUrl = "https://mlpforums.com/uploads/monthly_10_2013/post-18536-0-17144400-1381282031.jpg";
            const mock = jest.fn(() => new Promise(resolve => resolve({ secure_url: imgUrl })));
            cloudinary.uploader = {
                upload: mock
            };
            model.uploadPhoto(imgUrl);
            assert.equal(mock.mock.calls.length, 1);
            assert.equal(mock.mock.calls[0][0], "data:image/jpeg;base64," + imgUrl);
            const mock2 = jest.fn(() => new Promise((_, reject) => reject()));
            cloudinary.uploader = {
                upload: mock2
            };
            model.uploadPhoto(imgUrl);
            assert.equal(mock2.mock.calls.length, 1);
            assert.equal(mock2.mock.calls[0][0], "data:image/jpeg;base64," + imgUrl);
        });

        it('matches user info', async () => {
            model.updateUser("AA00000", {
                fname: "a",
                name: "a"
            });
            const user = await model.getUserById("AA00000");
            const info = {
                fname: "a",
                name: "a"
            }
            const info2 = {
                fname: "a",
                name: "b"
            }
            const info3 = {
                fname: "b",
                name: "b"
            }
            assert(model.matchUserInfo(user, info));
            assert(!model.matchUserInfo(user, info2));
            assert(!model.matchUserInfo(user, info3));
        });
    });

    describe('Places collection', () => {
        it('adds a new place', async () => {
            await model.addPlace("4-V-RER10");
            const place = await model.getPlaceById("4-V-RER10");
            assert(place);
        });

        it('updates a place', async () => {
            model.updatePlace("4-V-RER10", { using: true, id_user: "AA00000" });
            const place = await model.getPlaceById("4-V-RER10").then(place => {
                return { using: place.using, id_user: place.id_user }
            });
            assert.deepEqual(place, { using: true, id_user: "AA00000" });
        });

        it('gets a place by ID', async () => {
            const place = await model.getPlaceById("4-V-RER10");
            assert(place);
        });

        it('gets all places', async () => {
            const places = await model.getPlaces();
            assert(places);
        });

        it('gets the user using a place', async () => {
            const id_user = await model.whoUses("4-V-RER10");
            assert.equal(id_user, "AA00000");
            model.updatePlace("4-V-RER10", { using: false, id_user: "" });
            const noOne = await model.whoUses("4-V-RER10");
            assert(!noOne);
            const sharp = await model.whoUses("WrongID");
            assert.equal(sharp, "#");
        });

        it('resets places', async () => {
            await model.addPlace("4-V-RER11");
            model.updatePlace("4-V-RER11", { using: true });
            await model.addPlace("4-V-RER12");
            model.updatePlace("4-V-RER12", { using: true });
            const mockB = jest.fn();
            const mockA = jest.fn(() => { return { emit: mockB }});
            const websocket = {
                sockets: { adapter: { rooms: {
                    "4-V-RER11": true,
                    "4-V-RER12": false
                }}},
                in: mockA
            };
            const pooledPlaces = await model.getPooledPlaces();
            await model.resetPlaces(websocket, pooledPlaces);
            assert.equal(mockA.mock.calls.length, 1);
            assert.equal(mockB.mock.calls.length, mockA.mock.calls.length);
            assert.equal(mockA.mock.calls[0][0], "4-V-RER11");
            assert.equal(mockB.mock.calls[0][0], 'leavePlace');
        });

        it('adds pooled place', async () => {
            const id_place = "4-V-RER10";
            await model.addPooledPlace(id_place);
            const place = await PooledPlace.findOne({ id: id_place });
            assert(place);
        });

        it('removes pooled place', async () => {
            const id_place = "4-V-RER10";
            await model.removePooledPlace(id_place);
            const place = await PooledPlace.findOne({ id: id_place });
            assert(!place);
        });

        it('gets all pooled places', async () => {
            const pooledPlaces = await model.getPooledPlaces();
            assert(pooledPlaces);
        });
    })

    afterAll(() => {
        mongoose.disconnect();
        mockDB.stop();
    });

});