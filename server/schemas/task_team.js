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
      required: true,
    },
    desc: {},
    workSpace: {
      type: Object,
    },
    color: {
      type: String,
    },

    workSpaceName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const TeamTask = mongoose.model('TeamTask', teamTaskSchema);
module.exports = TeamTask;
