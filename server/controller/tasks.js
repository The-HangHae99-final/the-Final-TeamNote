const Task = require('../schemas/task');
const moment = require('moment');

// 일정 생성
async function taskUpload(req, res, next) {
  try {
    const { userName } = res.locals.user;
    const { start_date, end_date, title, desc } = req.body;
    const maxTaskId = await Task.findOne().sort('-task_id');
    let task_id = 1;
    if (maxTaskId) {
      task_id = maxTaskId.task_id + 1;
    }
    const createdTask = await Task.create({
      task_id,
      start_date,
      end_date,
      title,
      desc,
      userName,
    });

    return res.json({
      result: createdTask,
      ok: true,
      message: '일정 생성 성공',
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ ok: false, message: '일정 생성 실패' });
  }
}

// 전체 일정 조회
async function taskAll(req, res, next) {
  try {
    tasks = await Task.find({}).sort('-task_id');
    return res.json({
      result: {
        count: tasks.length,
        rows: tasks,
      },
      ok: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ ok: false, message: '전체 일정 조회 실패' });
  }
}

// 글 상세 조회
async function taskDetail(req, res, next) {
  try {
    const task_id = Number(req.params.task_id);
    const task = await Task.findOne({ task_id });

    const now = moment();
    const { end_date } = task;
    const diff = now.diff(end_date, 'days');

    return res.json({
      result: task,
      day_count: -diff + 1, // 마감까지 D-day
      ok: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ ok: false, message: '일정 상세 조회 실패' });
  }
}

// 일정 수정
async function taskEdit(req, res, next) {
  try {
    const task_id = Number(req.params.task_id);
    const [existTask] = await Task.find({ task_id });
    const { user } = res.locals;
    const { start_date, end_date, title, desc } = req.body;
    if (user.userName !== existTask.userName) {
      return res.status(401).json({ ok: false, message: '작성자가 아닙니다.' });
    }
    if (!start_date || !end_date || !title) {
      return res.status(400).json({ ok: false, message: '빈값을 채워주세요' });
    }

    await Task.updateOne(
      { task_id },
      { $set: { start_date, end_date, title, desc } }
    );
    return res.status(200).json({
      result: await Task.findOne({ task_id }),
      ok: true,
      message: '일정 수정 성공',
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: '일정 수정 에러' });
  }
}

// 일정 삭제
async function taskRemove(req, res, next) {
  try {
    const task_id = Number(req.params.task_id);
    const [targetTask] = await Task.find({ task_id });
    const { userName } = res.locals.user;

    if (userName !== targetTask.userName) {
      return res.status(401).json({
        ok: false,
        message: '작성자가 아닙니다.',
      });
    }

    await Task.deleteOne({ task_id });
    return res.json({ ok: true, message: '일정 삭제 성공' });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: '일정 삭제 실패',
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
