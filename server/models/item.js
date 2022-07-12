const mongoose = require('mongoose');
const itemSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    categoryItemNum: {
      type: Number,
      required: true,
    },
    itemImgUrl: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true } // createdAt, updatedAt 으로 Date형 객체 입력)
);

itemSchema.virtual('itemId').get(function () {
  return this._id.toHexString();
});
itemSchema.set('toJSON', {
  virtuals: true,
});

module.exports = mongoose.model('Items', itemSchema);
