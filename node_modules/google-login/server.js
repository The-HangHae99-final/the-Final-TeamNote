var renderAsync = require('render-async'),
jQuery = require('js-toolbox')._jQuery,
renderFile = renderAsync.__express,
GoogleLogin = require('./GoogleLogin.js');

//now we need a server for this so that we can test include
var app= renderAsync.express({welcomeFile: "index.js.html"});

app.set('views', __dirname + '/public');

// add a route to login and another one to see the logged in user (if there is no logged in user then redirect)

var oGoogleLogin = new GoogleLogin();
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


//server everything index.html welcome file
app.use(renderAsync.webServer);


//set ipaddress from openshift, to command line or to localhost:8080
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || parseInt(process.argv.pop()) || 8080;
app.set('port', port);
//start the server listening for requests
app.listen(port, ipaddr);
