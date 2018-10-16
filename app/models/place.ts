import mongoose from 'mongoose';

const { Schema } = mongoose;

const PlaceSchema = new Schema({
  id: String,
  using: Boolean,
  id_user: String,
});

export default mongoose.model('Place', PlaceSchema);
