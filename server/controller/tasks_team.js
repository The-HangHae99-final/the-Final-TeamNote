const TeamTask = require('../schemas/task_team');
const moment = require('moment');

// 팀 일정 생성
async function teamTaskUpload(req, res, next) {
  try {
    //#swagger.tags= ['팀 일정 API'];
    //#swagger.summary= '팀 알정 생성 API'
    //#swagger.description='-'

    const { userEmail } = res.locals.User;
    // console.log((res.locals.user))
    const { startDate, endDate, title, desc, color, workSpaceName } = req.body;
    const maxTaskId = await TeamTask.findOne({ workSpaceName }).sort('-taskId');
    let taskId = 1;
    if (maxTaskId) {
      taskId = maxTaskId.taskId + 1;
    }
    const createdTask = await TeamTask.create({
      taskId,
      startDate,
      endDate,
      title,
      desc,
      userEmail,
      workSpaceName,
      color,
    });

    return res.json({
      result: createdTask,
      ok: true,
      message: '팀 일정 생성 성공',
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({ ok: false, message: '팀 일정 생성 실패' });
  }
}

// 팀 전체 일정 조회
async function teamTaskAll(req, res, next) {
  try {
    //#swagger.tags= ['일정 API'];
    //#swagger.summary= '팀 전체 일정 조회 API'
    //#swagger.description='-'
    const { workSpaceName } = req.body;
    tasks = await TeamTask.find({ workSpaceName }).sort('-taskId');
    return res.json({
      result: {
        count: tasks.length,
        rows: tasks,
      },
      ok: true,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ ok: false, message: '전체 팀 일정 조회 실패' });
  }
}

// 팀 일정 상세 조회
async function teamTaskDetail(req, res, next) {
  try {
    //#swagger.tags= ['팀 일정 API'];
    //#swagger.summary= '팀 일정 상세조회  API'
    //#swagger.description='-'
    const { taskId } = req.params;
    console.log('taskId-----------' + taskId);
    const task = await TeamTask.findOne({ taskId });

    const now = moment();
    const { endDate } = task;
    const diff = now.diff(endDate, 'days');

    return res.json({
      result: task,
      dayCount: -diff + 1, // 마감까지 D-day
      ok: true,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(400)
      .json({ ok: false, message: '팀 일정 상세 조회 실패' });
  }
}

// 팀 일정 수정
async function teamTaskEdit(req, res, next) {
  try {
    //#swagger.tags= ['팀 일정 API'];
    //#swagger.summary= '일정 수정 API'
    //#swagger.description='-'
    const { workSpaceName } = req.body;
    const taskId = Number(req.params.taskId);
    const [existTask] = await TeamTask.find({ taskId, workSpaceName });
    console.log('existTask: ', existTask);
    const { userEmail } = res.locals.User;
    const { startDate, endDate, title, desc, color } = req.body;

    if (!startDate || !endDate || !title) {
      return res.status(400).json({ ok: false, message: '빈값을 채워주세요' });
    }

    await TeamTask.updateOne(
      { taskId },
      { $set: { startDate, endDate, title, desc } }
    );
    return res.status(200).json({
      result: await TeamTask.findOne({ taskId }),
      ok: true,
      message: '팀 일정 수정 성공',
    });
  } catch (err) {
    console.log('err: ', err);
    return res
      .status(400)
      .json({ success: false, message: '팀 일정 수정 에러' });
  }
}

// 팀 일정 삭제
async function teamTaskRemove(req, res, next) {
  try {
    //#swagger.tags= ['팀 일정 API'];
    //#swagger.summary= '팀 일정 삭제 API'
    //#swagger.description='-'
    const taskId = Number(req.params.taskId);
    const existTask = await TeamTask.findOne({ taskId });

    if (!existTask) {
      return res
        .status(400)
        .json({ ok: false, message: '없는 팀 일정입니다.' });
    }

    await TeamTask.deleteOne({ taskId });
    return res.json({ ok: true, message: '팀 일정 삭제 성공' });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      message: '팀 일정 삭제 실패',
    });
  }
}

module.exports = {
  teamTaskUpload,
  teamTaskAll,
  teamTaskDetail,
  teamTaskEdit,
  teamTaskRemove,
};
