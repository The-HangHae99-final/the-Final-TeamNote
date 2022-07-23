const teamTaskController = require('../../server/controller/tasks_team');
const request = require('supertest');
const app = require('../../app');

describe('teamTasks Controller 함수 테스트', () => {
  test('should have a teamTasks signup function', () => {
    expect(typeof teamTaskController.teamTaskAll).toBe('function');
  });
  test('should have a teamTasks emailFirst function', () => {
    expect(typeof teamTaskController.teamTaskDetail).toBe('function');
  });
  test('should have a teamTasks passwordSecond function', () => {
    expect(typeof teamTaskController.teamTaskEdit).toBe('function');
  });
  test('should have a teamTasks deleteUser function', () => {
    expect(typeof teamTaskController.teamTaskRemove).toBe('function');
  });
  test('should have a teamTasks searchUser function', () => {
    expect(typeof teamTaskController.teamTaskUpload).toBe('function');
  });
});
