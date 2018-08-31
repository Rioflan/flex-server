var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var PlaceSchema   = new Schema({
  id:           String,
  using:        Boolean,
  id_user:      String
});

module.exports = mongoose.model('Place', PlaceSchema);
