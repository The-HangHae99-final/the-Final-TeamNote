const mongoose = require('mongoose');
const Acess_tokenSchema = new mongoose.Schema({
  access_token: {
    type: String,
  },
});

module.exports = mongoose.model('Acesstoken', Acess_tokenSchema);
