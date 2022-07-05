google-login Node Module
=======================

`npm install google-login`

This is a npm module that gets a CurrentUser session based on a login to Google. I struggled with just using a plain jQuery.ajax style interface to this and ended up using `googleapis` interface instead.

	var GoogleLogin = require('google-login');
	var oGoogleLogin = new GoogleLogin();
	// `/login` is the place to login
	app.get('/login', jQuery.proxy(oGoogleLogin.login, oGoogleLogin));
	//don't need to proxy this because the currentUser is in the session 
	app.get('/logout', oGoogleLogin.logout);
	app.get('/currentUser', oGoogleLogin.currentUser);

	//redirect to login page unless we have a session with a current user
	app.use(function(req, res, next){
		if((req._parsedUrl.path == '/' || req._parsedUrl.path.indexOf('html') != -1) 
				&& (!req.session || !req.session.profile))
		{
			// then we are going for an html file without logged in user
			req._parsedUrl.path = '/login.js.html';
			renderAsync.renderAsync(req, res); 
		}else{
			next();
		}
	});
