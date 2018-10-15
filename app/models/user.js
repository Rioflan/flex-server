var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var UserSchema   = new Schema({
  id:       String,
  name:     String,
  fname:    String,
  id_place: String,
  historical: Array,
});

module.exports = mongoose.model('User', UserSchema);
