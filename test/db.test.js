// const dotenv = require('dotenv').config();
// const mongoose = require('mongoose');

// const { MongoClient } = require('mongodb');

// describe('insert', () => {
//   let connection;
//   let db;

//   beforeAll(async () => {
//     connection = await MongoClient.connect(process.env.DB_NAME, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     db = await connection.db('teamnote');
//   });

//   afterAll(async () => {
//     await connection.close();
//   });

//   it('should insert a doc into collection', async () => {
//     const users = db.collection('users');

//     const mockUser = {
//       userName: 'some-user-id11',
//       userEmail: 'John@naver.com',
//       password: '1234',
//     };
//     await users.insertOne(mockUser);

//     const insertedUser = await users.findOne({ userName: 'some-user-id11' });
//     console.log(insertedUser);
//     expect(insertedUser.userName).toEqual(mockUser.userName);
//   });
// });
