import mongoose from 'mongoose';

const { Schema } = mongoose;

const ApiSchema = new Schema({
  name: String,
  email: String,
  api_key: String, // password != token
  creation: Date,
});

const Model = mongoose.model('Api', ApiSchema);

export default Model;
