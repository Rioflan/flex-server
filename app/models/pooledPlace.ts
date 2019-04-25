import mongoose, { Types } from 'mongoose';

const { Schema } = mongoose;

const PooledPlaceSchema = new Schema({
  id: String
});

export interface PooledPlaceSchema {
  _id?: Types.ObjectId,
  id: string,
  save: Types.save
}

const Model = mongoose.model('PooledPlace', PooledPlaceSchema);

export default Model;
