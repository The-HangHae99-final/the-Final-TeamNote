const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  taskId: {
    type: Number,
    required: true,
    unique: true,
  },
  startDate: {  // 시작 날짜
    type: String,
    required: true,
  },
  endDate: {   // 종료 날짜
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
  userEmail: {   // 한 명인가, 여러 명인가? - 나중에 논의할 것
    type: String,
    required: true,
  },
}, { 
  timestamps: true
});

module.exports = mongoose.model("Task", taskSchema);