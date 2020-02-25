import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  id: String,
  name: String,
  fname: String,
  email: String,
  id_place: { type: String, default: "" },
  historical: Array,
  remoteDay: { type: Array, default: [] },
  photo: { type: String, default: "" },
  friend: Array,
  pool: { type: Boolean, default: false },
  start_date: { type: Date, default:null},
  end_date: { type: Date, default:null },
  confirmation_code: { type: String, default: "" },
  confirmation_token: { type: String, default: "" },
});

export interface UserSchema {
  _id?: mongoose.Types.ObjectId,
  id: string,
  name: string,
  fname: string,
  email: string,
  id_place: string,
  historical: Array<object>,
  remoteDay: Array<string>,
  photo: string,
  friend: Array<object>,
  start_date: Date,
  end_date: Date,
  confirmation_code: string,
  confirmation_token: string,
}

const Model = mongoose.model("User", UserSchema);

export default Model;
