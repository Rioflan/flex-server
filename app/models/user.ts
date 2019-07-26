import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  id: String,
  name: String,
  fname: String,
  id_place: { type: String, default: "" },
  historical: Array,
  remoteDay: { type: Array, default: [] },
  photo: { type: String, default: "" },
  friend: Array,
  pool: { type: Boolean, default: false },
  start_date: Date,
  end_date: Date,
});

export interface UserSchema {
  _id?: Types.ObjectId,
  id: string,
  name: string,
  fname: string,
  id_place: string,
  historical: Array<object>,
  remoteDay: Array<string>,
  photo: string,
  friend: Array<object>,
  start_date: Date,
  end_date: Date,
}

const Model = mongoose.model("User", UserSchema);

export default Model;
