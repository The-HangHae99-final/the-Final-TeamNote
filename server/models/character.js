const mongoose = require('mongoose');
const Items = require('./item');
const CharacterSchema = new mongoose.Schema(
  {
    userEmail: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    characterCurrentPoint: {
      type: Number,
      required: true,
    },
    equippedItems: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Items' }],
    },
    haveItems: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Items' }],
    },
  },

  { timestamps: true } // createdAt, updatedAt 으로 Date형 객체 입력
);

CharacterSchema.virtual('characterId').get(function () {
  return this._id.toHexString();
});

CharacterSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Characters', CharacterSchema);
