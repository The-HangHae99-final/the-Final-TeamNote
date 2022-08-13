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
  workSpaceId: {
    type: String,
    required: true,
  },
  workSpaceName: {
    type: String,
    required: true,
  },
  profile_image: {
    type: String,
  },
});

const member = mongoose.model('member', memberSchema);
module.exports = member;
