const mongoose = require("mongoose");

const workSpaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  owner: {
    type: String,
    required: true,
  },
  memberList: [new mongoose.Schema({memberId: String, memberName: String})]
});

module.exports = mongoose.model("workSpace", workSpaceSchema);
