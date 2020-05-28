import mongoose, { Types } from 'mongoose';

const { Schema } = mongoose;

const ApiSchema = new Schema({
  name: String,
  email: String,
  api_key: String, // password != token
  creation: Date,
});

export interface ApiSchema {
  _id?: Types.ObjectId,
  name: string,
  email: string,
  api_key: string,
  creation: Date,
}

const Model = mongoose.model('Api', ApiSchema);

export default Model;
