const mongoose = require('mongoose');

const teamTaskSchema = mongoose.Schema(
  {
    taskId: {
      type: Number,

      unique: true,
    },
    startDate: {
      // 시작 날짜
      type: String,
    },
    endDate: {
      // 종료 날짜
      type: String,
    },
    title: {
      type: String,
    },
    userEmail: {
      type: String,
      required: true
    },
    desc: {},
    workSpace: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('TeamTask', teamTaskSchema);
