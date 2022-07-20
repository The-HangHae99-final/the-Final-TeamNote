const mongoose = require('mongoose');

const workSpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  memberList: {
    required: true,
  },
});

module.exports = mongoose.model('workSpace', workSpaceSchema);
