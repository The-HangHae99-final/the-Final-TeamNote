Assert Runner
=============

Author: Rich Hildred inspired by Gabriel Llamas' answer to [this stack overflow question.](http://stackoverflow.com/questions/18185144/node-js-unit-testing-in-2013)

License: MIT

Really light weight test runner based on node's builtin assert.

TestRunner.js
-------------

`npm install assert-runner`

Given a class TestClass under test:

	var Toolbox = require('js-toolbox');
	
	var TestClass = Toolbox.Base.extend({
		constructor: function(){
			return this;
		},
		synchronous: function(req, res){
			res.end("synchronous test");
		},
		asynchronous: function(req, res, callback){
			res.end("asynchronous test");
			if(typeof callback != 'undefined') callback();
		}
	});
	
	module.exports = TestClass;

TestClass can be tested using the following code (in test.js):

	var TestRunner = require('TestRunner'),
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
				
			}
	};
	
	new TestRunner(tests).again(0);
	
If we run `node test.js` the output produced will be:

	Passed Test: "TestClass constructor" 1 of 3
	Passed Test: "TestClass synchronous" 2 of 3
	Passed Test: "Test asynchronous" 3 of 3

Depends on:

- js-toolbox (https://github.com/rhildred/js-toolbox)
