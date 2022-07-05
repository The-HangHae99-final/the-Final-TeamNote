var Toolbox = require('js-toolbox').Toolbox;

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