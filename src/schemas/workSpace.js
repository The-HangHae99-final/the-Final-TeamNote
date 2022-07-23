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
  memberList: [
    new mongoose.Schema({ memberEmail: String, memberName: String }),
  ],
});

const workSpace = mongoose.model('workSpace', workSpaceSchema);
module.exports = workSpace;
