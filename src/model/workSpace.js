const mongoose = require('mongoose');
const workSpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  }
});

const workSpace = mongoose.model('workSpace', workSpaceSchema);
module.exports = workSpace

