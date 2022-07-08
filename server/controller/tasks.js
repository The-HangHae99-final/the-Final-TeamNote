const Task = require('../schemas/task');
const moment = require('moment');

// 일정 생성
async function taskUpload (req, res, next) {
  try {
    const { userId } = res.locals.user;
    const { startDate, endDate, title, desc } = req.body;
    const maxTaskId = await Task.findOne().sort("-taskId");
    let taskId = 1;
    if (maxTaskId) {
      taskId = maxTaskId.taskId + 1;
    }
    const createdTask = await Task.create({
      taskId, startDate, endDate, title, desc, userId
    });

    return res.json({ 
      result: createdTask,
      ok: true, 
      message: "일정 생성 성공"
    });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ ok: false, message: "일정 생성 실패" });
  }
}

// 전체 일정 조회
async function taskAll (req, res, next) {
  try {
    tasks = await Task.find({}).sort("-taskId");
    return res.json({ 
      result: {
        count: tasks.length,
        rows: tasks
      },
      ok: true
    });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ ok: false, message: "전체 일정 조회 실패" });
  }
}

// 글 상세 조회
async function taskDetail (req, res, next) {
  try {
    const taskId = Number(req.params.taskId);
    const task = await Task.findOne({ taskId });

    const now = moment();
    const { endDate } = task;
    const diff = now.diff(endDate, 'days')

    return res.json({ 
      result: task,
      dayCount: -diff + 1,   // 마감까지 D-day
      ok: true
    })
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ ok: false, message: "일정 상세 조회 실패" });
  }
}

// 일정 수정
async function taskEdit(req, res, next) {
  try {
    const taskId = Number(req.params.taskId);
    const [existTask] = await Task.find({ taskId });
    const { user } = res.locals;
    const { startDate, endDate, title, desc } = req.body;
    if (user.userId !== existTask.userId) {
      return res
        .status(401)
        .json({ ok: false, message: "작성자가 아닙니다." });
    }
    if (!startDate || !endDate || !title) {
      return res
        .status(400)
        .json({ ok: false, message: "빈값을 채워주세요" });
    }

    await Task.updateOne({ taskId }, { $set: { startDate, endDate, title, desc } });
    return res.status(200).json({ 
      result: await Task.findOne({ taskId }),
      ok: true,
      message: "일정 수정 성공"
    });
  } catch (err) {
    return res
      .status(400)
      .json({ success: false, message: "일정 수정 에러" });
  }
}

// 일정 삭제 
async function taskRemove(req, res, next) {
  try {
    const taskId = Number(req.params.taskId);
    const [targetTask] = await Task.find({ taskId })
    const {userId} = res.locals.user
    
    if (userId !== targetTask.userId){
      return res.status(401).json({ 
        ok : false, 
        message : "작성자가 아닙니다."
      });
    }

    await Task.deleteOne({ taskId })
    return res.json({ ok : true , message : "일정 삭제 성공"})
    
  } catch (error) {
    return res
      .status(400)
      .json({
          ok: false,
          message: "일정 삭제 실패"
    });
  }
}

module.exports = {
  taskUpload,
  taskAll,
  taskDetail,
  taskEdit,
  taskRemove,
};