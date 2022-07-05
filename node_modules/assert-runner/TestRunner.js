var Toolbox = require('js-toolbox').Toolbox;
var res = require('./classes/TestResponse.js').TestResponse;
var req = require('./classes/TestRequest.js').TestRequest;

var TestRunner = Toolbox.Base.extend({
	oTests: null,
	aKeys: null,
	constructor: function(tests){
		this.oTests = tests;
		this.aKeys = Object.keys(tests);
		return this;
	},
	again: function(i){
	    if (i < this.aKeys.length){
	        var fn = this.oTests[this.aKeys[i]];
	        if (fn.length){
	        	var self = this;
	            fn (function (){
	                console.log("Passed Test: \"" + self.aKeys[i] + "\" " + ++i + " of " + self.aKeys.length);
	                self.again (i);
	            });
	        }else{
	            fn ();
	            console.log("Passed Test: \"" + this.aKeys[i] + "\" " + ++i + " of " + this.aKeys.length);
	            this.again (i);
	        }
	    }else{
	    	var code = 0;

	    	process.on('exit', function() {
	    	  process.exit(code);
	    	});
	    }
	}
});
module.exports = TestRunner;
module.exports.TestRequest = req;
module.exports.TestResponse = res;