import mongoose, { Types } from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  id: String,
  name: String,
  fname: String,
  id_place: String,
  historical: Array,
});

export interface UserSchema {
  _id?: Types.ObjectId,
  id: string,
  name: string,
  fname: string,
  id_place: string,
  historical: Array<object>,
}

const Model = mongoose.model('User', UserSchema);

export default Model;
