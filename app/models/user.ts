const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
  id: String,
  name: String,
  fname: String,
  id_place: String,
  historical: Array,
});

export default mongoose.model('User', UserSchema);
