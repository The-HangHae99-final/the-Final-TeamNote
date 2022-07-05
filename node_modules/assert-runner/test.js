var TestRunner = require('./TestRunner.js'),
assert = require('assert'),
TestClass = require('./classes/TestClass.js');

var oTest = null;
var tests = {
		"TestClass constructor" : function(){
			oTest = new TestClass();
			assert(oTest != null);
		},
		"TestClass synchronous": function(){
			var oReq = new TestRunner.TestRequest();
			var oResp = new TestRunner.TestResponse();
			oTest.synchronous(oReq, oResp);
			assert(oResp.sBody == "synchronous test");
		},
		"Test asynchronous": function(done){
			var oReq = new TestRunner.TestRequest();
			var oResp = new TestRunner.TestResponse();
			oTest.asynchronous(oReq, oResp, function(){
				assert(oResp.sBody == "asynchronous test");
				done();
			});
			
		},
		"Test param": function(){
			var req = new TestRunner.TestRequest();
			req.params.test = 'test';
			assert(req.param('test') == 'test');
		}
};

new TestRunner(tests).again(0);