const mongoose = require('mongoose');
const memberSchema = new mongoose.Schema({
  memberName: {
    type: String,
    required: true,
  },
  memberEmail: {
    type: String,
    required: true,
  },
  workSpace: {
    type: String,
    required: true,
  },
});

const member = mongoose.model('member', memberSchema);
module.exports = member;
