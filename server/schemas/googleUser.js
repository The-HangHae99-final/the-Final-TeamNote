const mongoose = require("mongoose");
const GuserSchema = new mongoose.Schema({
  username: {
    type: String,
  },

  userId: {
    type: String,
    unique: true,
  },

  profileimage: {
    type: String,
  },

  iscompany: {
    type: String,
  },
});

module.exports = mongoose.model("GUser", GuserSchema);
