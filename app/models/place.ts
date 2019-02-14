import mongoose, { Types } from 'mongoose';

const { Schema } = mongoose;

const PlaceSchema = new Schema({
  id: String,
  using: { type: Boolean, default: false },
  id_user: { type: String, default: "" }
});

export interface PlaceSchema {
  _id?: Types.ObjectId,
  id: string,
  using: boolean,
  id_user: string,
  save: Types.save,
}

const Model = mongoose.model('Place', PlaceSchema);

export default Model;
