const Task = require('../schemas/task');
const moment = require('moment');

// 일정 생성
async function taskUpload(req, res, next) {
  try {
    //#swagger.tags= ['개인 일정 API'];
    //#swagger.summary= '개인 일정 생성 API'
    //#swagger.description='-'

    const { userEmail } = res.locals.User;
    // console.log(
    //   'userEmail11111111111111--------------------------------------------------------',
    //   userEmail
    // );
    // console.log((res.locals.user))
    const { startDate, endDate, title, desc, color, workSpaceName } = req.body;
    const maxTaskId = await Task.findOne({ workSpaceName }).sort('-taskId');
    // console.log(
    //   'maxTaskId 222222222222222--------------------------------------------------------',
    //   maxTaskId
    // );
    let taskId = 1;
    if (maxTaskId) {
      taskId = maxTaskId.taskId + 1;
    }
    const createdTask = await Task.create({
      taskId,
      startDate,
      endDate,
      title,
      desc,
      userEmail,
      workSpaceName,
      color,
    });

    // console.log(
    //   'createdTask3333333333333333---------------------',
    //   createdTask
    // );

    return res.json({
      result: createdTask,
      success: true,
      message: '개인 일정 생성 성공',
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: '개인 일정 생성 실패',
      errorMeassage: error,
    });
  }
}

// 전체 일정 조회
async function taskAll(req, res, next) {
  try {
    //#swagger.tags= ['개인 일정 API'];
    //#swagger.summary= '개인 일정 전체조회 API'
    //#swagger.description='-'
    const { userEmail } = res.locals.User;

    const tasks = await Task.find({ userEmail }).sort('-taskId');
    // console.log('tasks: ', tasks[0].userEmail);
    // if (tasks[0].userEmail !== userEmail) {
    //   console.log('---------task[0].usermail-------' + tasks[0].userEmail);
    //   console.log('----------userEmail-----' + userEmail);
    //   return res.status(400).json({ success: false, message: '본인이 아닙니다.' });
    // }
    return res.json({
      result: {
        count: tasks.length,
        rows: tasks,
      },
      success: true,
    });
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      success: false,
      message: '전체 개인 일정 조회 실패',
      errorMessage: err.message,
    });
  }
}

// 일정 상세 조회
async function taskDetail(req, res, next) {
  try {
    //#swagger.tags= ['개인 일정 API'];
    //#swagger.summary= '개인 일정 상세 조회 API'
    //#swagger.description='-'
    const { userEmail } = res.locals.User;
    const { taskId } = req.params;
    const task = await Task.findOne({ taskId });

    const now = moment();
    const { endDate } = task;
    const diff = now.diff(endDate, 'days');

    if (task.userEmail !== userEmail) {
      return res
        .status(400)
        .json({ success: false, message: '본인이 아닙니다.' });
    }

    return res.json({
      result: task,
      dayCount: -diff + 1, // 마감까지 D-day
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).json({
      success: false,
      message: '개인 일정 상세 조회 실패',
      errorMeassage: error.message,
    });
  }
}

// 일정 수정
async function taskEdit(req, res, next) {
  try {
    //#swagger.tags= ['개인 일정 API'];
    //#swagger.summary= '개인 일정 수정 API'
    //#swagger.description='-'

    const taskId = Number(req.params.taskId);
    const [existTask] = await Task.find({ taskId, workSpaceName });
    console.log('existTask: ', existTask);
    const { userEmail } = res.locals.User;
    const { startDate, endDate, title, desc, color } = req.body;
    if (userEmail !== existTask.userEmail) {
      res.status(401).json({ success: false, message: '작성자가 아닙니다.' });
    }
    if (!startDate || !endDate || !title) {
      res.status(400).json({ success: false, message: '빈값을 채워주세요' });
    }

    await Task.updateOne(
      { taskId },
      { $set: { startDate, endDate, title, desc } }
    );
    const editTask = await Task.findOne({ taskId });
    res.status(200).json({
      result: editTask,
      success: true,
      message: '개인 일정 수정 성공',
    });
  } catch (err) {
    console.log('err: ', err);
    res.status(400).json({
      success: false,
      message: '개인 일정 수정 에러',
      errorMeassage: err.message,
    });
  }
}

// 일정 삭제
async function taskRemove(req, res, next) {
  try {
    //#swagger.tags= ['개인 일정 API'];
    //#swagger.summary= '개인 일정 삭제 API'
    //#swagger.description='-'
    const taskId = Number(req.params.taskId);
    const existTask = await Task.findOne({ taskId });

    if (userEmail !== existTask.userEmail) {
      return res
        .status(401)
        .json({ success: false, message: '작성자가 아닙니다.' });
    }

    if (!existTask) {
      return res
        .status(400)
        .json({ success: false, message: '없는 개인 일정입니다.' });
    }

    await Task.deleteOne({ taskId });
    return res.json({ success: true, message: '개인 일정 삭제 성공' });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: '개인 일정 삭제 실패',
      errorMeassage: error.message,
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
