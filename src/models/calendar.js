const mongoose = require('mongoose');

const taskSchema = mongoose.Schema(
  {
    task_id: {
      type: Number,
      required: true,
      unique: true,
    },
    start_date: {
      // 시작 날짜
      type: String,
      required: true,
    },
    end_date: {
      // 종료 날짜
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    user_id: {
      // 한 명인가, 여러 명인가? - 나중에 논의할 것
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Calendar = mongoose.model('Calendar', taskSchema);
module.exports = Calendar;
