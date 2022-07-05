var Toolbox = require('js-toolbox').Toolbox;

var TestRequest = Toolbox.Base.extend({
	session: {},
	protocol: "http",
	url: "/login",
	params: {},
	constructor: function(){
		this.session.profile = {};
		this.session.profile.id = "110056483553960735640";
		return this;
	},
	get: function(){
		return("localhost:8080");
	},
	param: function(keyword){
		return this.params[keyword];
	}
});

module.exports.TestRequest = TestRequest;

