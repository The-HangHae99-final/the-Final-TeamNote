// const teamTaskController = require('../../src/controller/teamTasks');
// const request = require('supertest');
// const app = require('../../app');
// const httpMocks = require('node-mocks-http');
// const teamTasks = require('../../src/model/teamTask');
// const boardData = require('../data/board.json');
// const userEmail = 'test@test.com';
// teamTasks.findOne = jest.fn();
// teamTasks.find = jest.fn();
// teamTasks.findById = jest.fn();
// teamTasks.findByIdAndUpdate = jest.fn();
// teamTasks.findByIdAndDelete = jest.fn();

// let req, res, next;

// beforeEach(() => {
//   req = httpMocks.createRequest();
//   res = httpMocks.createResponse();
//   next = jest.fn();
// });

// //===============팀 일정 생성하기======================
// describe('test 팀 일정 생성 API ', () => {
//   beforeEach(() => {});
//   it('should createTeamTask 은 함수여야 한다.', () => {
//     expect(typeof teamTaskController.createTeamTask).toBe('function');
//   });
//   it('should call teamTasks.create을 호출한다.', async () => {
//     await teamTaskController.createTeamTask(req, res, next);
//     expect(teamTasks.create);
//   });
// });

// //=============== 일정 전체조회, 상세조회 ======================
// describe('test 일정 조회 API', () => {
//   let teamData;
//   beforeEach(() => {
//     const teamData = {
//       startDate: '123',
//       endDate: '123',
//       title: '123',
//       desc: '123',
//       color: '123',
//       workSpaceName: 'chocokakao@naver.com+123',
//     };
//   });
//   it('should have a showTeamTasks 함수 타입을 가진다.', () => {
//     expect(typeof teamTaskController.showTeamTasks).toBe('function');
//   });

//   it('should showTeamTasks는 실패 응답값으로 object 값을 반환한다.', async () => {
//     teamTasks.findOne.mockReturnValue(teamData);
//     await teamTaskController.showTeamTasks(req, res, next);
//     console.log(res._getData());
//     expect(typeof res._getData()).toBe('object');
//   });

//   it('should showTeamTaskDetail는 함수 타입을 가진다.', () => {
//     expect(typeof teamTaskController.showTeamTaskDetail).toBe('function');
//   });

//   it('should 실패 응답값으로 string 값을 반환한다.', async () => {
//     teamTasks.find.mockReturnValue(teamData);
//     await teamTaskController.showTeamTaskDetail(req, res, next);
//     console.log('-----', res._getData());
//     expect(typeof res._getData()).toBe('string');
//   });
// });

// //===============일정 수정 ======================

// describe('test 일정 수정 API', () => {
//   let teamData;
//   beforeEach(() => {
//     const teamData = {
//       startDate: '123',
//       endDate: '123',
//       title: '123',
//       desc: '123',
//       color: '123',
//       workSpaceName: '123',
//     };
//   });
//   it('should editTeamTask 타입은 함수여야 한다.', () => {
//     expect(typeof teamTaskController.editTeamTask).toBe('function');
//   });
//   it('editTeamTask 실패 응답값은 string을 반환해야 한다.', async () => {
//     req.body = teamData;
//     await teamTaskController.editTeamTask(req, res, next);
//     console.log('-----', res._getData());
//     expect(typeof res._getData()).toBe('string');
//   });
// });

// //===============일정 삭제 ======================

// describe('test 글 삭제 API', () => {
//   it('should deleteTeamTask의 타입은 함수여야 한다.', () => {
//     expect(typeof teamTaskController.deleteTeamTask).toBe('function');
//   });
//   it('deleteTeamTask의 실패 결과값은 string을 반환해야 한다.', async () => {
//     req.params.boardId = 1;
//     await teamTaskController.deleteTeamTask(req, res, next);
//     console.log('-----', res._getData());
//     expect(typeof res._getData()).toBe('string');
//   });

//   it('should call teamTasks.delete를 호출한다.', async () => {
//     await teamTaskController.deleteTeamTask(req, res, next);
//     expect(teamTasks.delete);
//   });
// });
