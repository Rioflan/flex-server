let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let PlaceSchema   = new Schema({
  id:           String,
  using:        Boolean,
  id_user:      String
});

module.exports = mongoose.model('Place', PlaceSchema);
