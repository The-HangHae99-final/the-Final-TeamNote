const mongoose = require('mongoose');
const invitingSchema = new mongoose.Schema({
  workSpaceId: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  inviter: {
    type: String,
    required: true
  }
});

const inviting = mongoose.model('inviting', invitingSchema);
module.exports = inviting;
