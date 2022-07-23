const mongoose = require('mongoose');
const invitingSchema = new mongoose.Schema({
  workSpaceName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  }
});

const inviting = mongoose.model('inviting', invitingSchema);
module.exports = inviting;
