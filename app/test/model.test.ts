import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import assert from 'assert';
import cloudinary from "cloudinary";
import * as model from "../models/model";
import Place from '../models/place';

jest.mock('cloudinary');

let mockDB;

describe('Testing models', () => {
  beforeAll(async () => {
    mockDB = new MongoMemoryServer();
    const uri = await mockDB.getConnectionString();
    await mongoose.connect(uri, { useNewUrlParser: true });
  });

  describe('Users collection', () => {
    it('adds a new user', async () => {
      await model.addUser('a@a.com', 'AA00000', 'Name', 'Fname');
      const user = await model.getUserById('AA00000');
      assert(user);
    });

    it('updates a user', async () => {
      model.updateUser('AA00000', { name: 'OtherName' });
      const name = await model.getUserById('AA00000').then(user => user.name);
      assert.equal(name, 'OtherName');
    });

    it('updates many users', async () => {
      await model.addUser('b@a.com', 'AA00001', 'Name', 'Fname');
      model.updateManyUsers({ id: /AA0000\d/ }, { name: 'OtherName' });
      const nameA = await model.getUserById('AA00000').then(user => user.name);
      const nameB = await model.getUserById('AA00001').then(user => user.name);
      assert.equal(nameA, 'OtherName');
      assert.equal(nameA, 'OtherName');
    });

    it('gets a user by ID', async () => {
      const user = await model.getUserById('AA00000');
      assert(user);
    });

    it('gets all users', async () => {
      const users = await model.getUsers();
      assert(users);
    });

    it('checks user existence', async () => {
      assert(await model.userExists('AA00000'));
      assert(!(await model.userExists('BB11111')));
    });

    // Need to update the tests for image upload

    // it('updates a photo', async () => {
    //   const imgUrl =        'https://mlpforums.com/uploads/monthly_10_2013/post-18536-0-17144400-1381282031.jpg';
    //   cloudinary.uploader = {
    //     upload: jest.fn(
    //       () => new Promise(resolve => resolve({ secure_url: imgUrl })),
    //     ),
    //   };
    //   await model.updatePhoto('AA00000', imgUrl);
    //   const photo = await model.getUserById('AA00000').then(user => user.photo);
    //   assert.equal(photo, imgUrl);
    // });

    // it('uploads a photo', async () => {
    //   const imgUrl =        'https://mlpforums.com/uploads/monthly_10_2013/post-18536-0-17144400-1381282031.jpg';
    //   const mock = jest.fn(
    //     () => new Promise(resolve => resolve({ secure_url: imgUrl })),
    //   );
    //   cloudinary.uploader = {
    //     upload: mock,
    //   };
    //   model.uploadPhoto('testID', imgUrl);
    //   assert.equal(mock.mock.calls.length, 1);
    //   assert.equal(mock.mock.calls[0][0], 'data:image/jpeg;base64,' + imgUrl);
    //   const mock2 = jest.fn(() => new Promise((_, reject) => reject()));
    //   cloudinary.uploader = {
    //     upload: mock2,
    //   };
    //   model.uploadPhoto('testID', imgUrl);
    //   assert.equal(mock2.mock.calls.length, 1);
    //   assert.equal(mock2.mock.calls[0][0], 'data:image/jpeg;base64,' + imgUrl);
    // });

    it('matches user info', async () => {
      model.updateUser('AA00000', {
        fname: 'a',
        name: 'a',
      });
      const user = await model.getUserById('AA00000');
      const info = {
        fname: 'a',
        name: 'a',
      };
      const info2 = {
        fname: 'a',
        name: 'b',
      };
      const info3 = {
        fname: 'b',
        name: 'b',
      };
      assert(model.matchUserInfo(user, info));
      assert(!model.matchUserInfo(user, info2));
      assert(!model.matchUserInfo(user, info3));
    });
  });

  describe('Places collection', () => {
    it('adds a new place', async () => {
      await model.addPlace('JO-4-V-RER10');
      const place = await model.getPlaceById('JO-4-V-RER10');
      assert(place);
      await model.addPlace('JO-5-V-RER10', true, 'AB12345');
      const placeB = await model.getPlaceById('JO-5-V-RER10');
      assert(placeB);
    });

    it('updates a place', async () => {
      model.updatePlace('JO-4-V-RER10', { using: true, id_user: 'AA00000' });
      const place = await model
        .getPlaceById('JO-4-V-RER10')
        .then(place => ({ using: place.using, id_user: place.id_user }));
      assert.deepEqual(place, { using: true, id_user: 'AA00000' });
    });

    it('gets a place by ID', async () => {
      const place = await model.getPlaceById('JO-4-V-RER10');
      assert(place);
    });

    it('gets all places', async () => {
      const places = await model.getPlaces();
      assert(places);
    });

    it('gets the user using a place', async () => {
      const id_user = await model.whoUses('JO-4-V-RER10');
      assert.equal(id_user, 'AA00000');
      model.updatePlace('JO-4-V-RER10', { using: false, id_user: '' });
      const noOne = await model.whoUses('JO-4-V-RER10');
      assert(!noOne);
      const sharp = await model.whoUses('WrongID');
      assert.equal(sharp, '#');
    });

    it('resets places', async () => {
      await model.addPlace('JO-4-V-RER11');
      model.updatePlace('JO-4-V-RER11', { using: true, id_user: 'AA00000' });
      await model.addPlace('JO-4-V-RER12');
      model.updatePlace('JO-4-V-RER12', { using: true, id_user: 'AA00001' });
      const mockB = jest.fn();
      const mockA = jest.fn(() => ({ emit: mockB }));
      const websocket = {
        sockets: {
          adapter: {
            rooms: {
              'JO-4-V-RER11': true,
              'JO-4-V-RER12': false,
            },
          },
        },
        in: mockA,
      };
      const pooledUsers = await model.getPooledUsers();
      await model.resetPlaces(websocket, pooledUsers);
      assert.equal(mockA.mock.calls.length, 1);
      assert.equal(mockB.mock.calls.length, mockA.mock.calls.length);
      assert.equal(mockA.mock.calls[0][0], 'JO-4-V-RER11');
      assert.equal(mockB.mock.calls[0][0], 'leavePlace');
      const places = await model.getPlaces();
      assert(!places.some(x => x.using));
      assert(!(await model.getUserById('AA00000')).pool);
      assert((await model.getUserById('AA00001')).pool);
      assert.equal(pooledUsers[pooledUsers.length - 1], 'AA00001');
    });

    it('gets all pooled users', async () => {
      const pooledUsers = await model.getPooledUsers();
      assert(pooledUsers);
    });
  });

  afterAll(() => {
    mongoose.disconnect();
    mockDB.stop();
  });
});
