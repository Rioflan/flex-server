import * as mongoose from 'mongoose';

export const PlaceSchema = new mongoose.Schema({
  id: String,
  using: { type: Boolean, default: false },
  semi_flex: { type: Boolean, default: false },
  id_user: { type: String, default: "" },
  id_owner: { type: String, default: "" },
});

export interface PlaceSchema {
  _id?: mongoose.Types.ObjectId,
  id: string,
  using: boolean,
  semi_flex: boolean,
  id_user: string,
  id_owner: string,
  save: mongoose.Types.save,
}

const Model = mongoose.model('Place', PlaceSchema);

export default Model;
