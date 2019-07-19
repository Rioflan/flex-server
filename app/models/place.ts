import mongoose, { Types } from 'mongoose';

const { Schema } = mongoose;

const PlaceSchema = new Schema({
  id: String,
  using: { type: Boolean, default: false },
  semi_flex: { type: Boolean, default: false },
  id_user: { type: String, default: "" },
  id_owner: { type: String, default: "" },
  start_date: Date,
  end_date: Date,
});

export interface PlaceSchema {
  _id?: Types.ObjectId,
  id: string,
  using: boolean,
  semi_flex: boolean,
  id_user: string,
  id_owner: string,
  save: Types.save,
}

const Model = mongoose.model('Place', PlaceSchema);

export default Model;
