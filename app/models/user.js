let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let UserSchema   = new Schema({
  id:       String,
  name:     String,
  fname:    String,
  id_place: String,
  historical: Array,
});

module.exports = mongoose.model('User', UserSchema);
