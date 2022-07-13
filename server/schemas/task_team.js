const mongoose = require('mongoose');

const teamTaskSchema = mongoose.Schema({
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
  workSpace: {
    type: Object,
    required: true,
  },
}, { 
  timestamps: true
});

module.exports = mongoose.model("TeamTask", teamTaskSchema);