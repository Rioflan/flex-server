import mongoose, { Types } from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema({
  id: String,
  name: String,
  fname: String,
  id_place: { type: String, default: "" },
  historical: Array,
  remoteDay: { type: String, default: "" },
  photo: { type: String, default: "" },
  friend: Array,
  pool: { type: Boolean, default: false }
});

export interface UserSchema {
  _id?: Types.ObjectId,
  id: string,
  name: string,
  fname: string,
  id_place: string,
  historical: Array<object>,
  remoteDay: string,
  photo: string,
  friend: Array<object>
}

const Model = mongoose.model("User", UserSchema);

export default Model;
