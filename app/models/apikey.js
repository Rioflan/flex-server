let mongoose     = require('mongoose');
let Schema       = mongoose.Schema;

let ApiSchema   = new Schema({
  name:           String,
  email:          String,
  api_key:        String,//password != token
  creation:       Date
});

module.exports = mongoose.model('Api', ApiSchema);
