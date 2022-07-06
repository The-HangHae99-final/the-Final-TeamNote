const soMiddleware = (req, res, next) => {
  // middleware 만듬 -> session.authData가 없으면
  const { session } = req;
  if (session.authData == undefined) {
    console.log('로그인 안되어 있음 '); // 요거 출력
    res.redirect('/?msg=로그인 안되어 있습니다.');
  } else {
    console.log('로그인 되어 있음 '); //되어 있으면 next() - 계속가 ~
    next();
  }
};
