// // config/passport.js

// const dotenv = require('dotenv'); // 설정파일
// dotenv.config();

// const GUser = require('../schemas/googleUser');

// var passport = require('passport');
// var GoogleStrategy = require('passport-google-oauth2').Strategy;

// passport.serializeUser(function (user, done) {
//   done(null, user);
// });
// passport.deserializeUser(function (user, done) {
//   done(null, user);
// });

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_SECRET,
//       callbackURL: 'http://hayeon-sum.shop/auth/google/callback',
//       passReqToCallback: true,
//     },
//     async (request, accessToken, refreshToken, profile, done) => {
//       let user = profile;
//       const userId = 'abc' + user.id.slice(0, 7);
//       const username = user.given_name;
//       const profileimage = user.picture;
//       const iscompany = false;

//       const exUser = await GUser.findOne({ userId });

//       if (exUser) {
//         done(null, exUser);
//       } else {
//         const user_save = new GUser({
//           userId,
//           username,
//           profileimage,
//           iscompany,
//         });
//         user_save.save();
//       }
//     }
//   )
// );

// module.exports = passport;
