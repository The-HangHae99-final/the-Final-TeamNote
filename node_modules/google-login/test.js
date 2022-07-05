var assert = require('assert'),
TestRunner = require('assert-runner'),
GoogleLogin = require('./GoogleLogin');

var oLogin = new GoogleLogin();

var tests = {
    "current user": function (){ 	
    	var oReq = new TestRunner.TestRequest();
    	var oRes = new TestRunner.TestResponse();
    	oLogin.currentUser(oReq, oRes);
    	assert(oRes.sBody == '{"id":"110056483553960735640"}');
    },
    "login with no code": function(){
    	var oReq = new TestRunner.TestRequest();
    	var oRes = new TestRunner.TestResponse();
    	oLogin.login(oReq, oRes);
    	var sExpected = "302 Location : https://accounts.google.com/o/oauth2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&response_type=code";
    	assert(oRes.sHead.substring(0, sExpected.length) == sExpected);
    }
};

var oTestRunner = new TestRunner(tests);
oTestRunner.again(0);