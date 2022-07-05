var Toolbox = require('../js-toolbox.js').Toolbox;
var jQuery = require('../js-toolbox.js')._jQuery;
var assert = require('assert');

var Animal = Toolbox.Base.extend({
    constructor: function (name) {
        this._name = name;
    },
    sayName: function () {
        return('Hi, my name is ' + this._name);
    }
});

var Tiger = Animal.extend({
	constructor: function () {
		// all tigers are named Tony
		this._name = "Tony";
	}
});

var BengalTiger = Tiger.extend({
	constructor: function () {
		// you can't name a Bengal tiger Tony
		this._name = "Shere Khan";
	},
    sayName: function () {
        return('Hi, my name is ' + this._name + ' and I am the true lord of the jungle!');
    }
});

var tests = {
    "basic first level inheritance": function (){ 	
    	var oAnimal = new Animal("Tony the Tiger");
    	assert(oAnimal.sayName() === 'Hi, my name is Tony the Tiger');
    },
    "second level inheritance": function(){
    	var oTiger = new Tiger();
    	assert(oTiger.sayName() === 'Hi, my name is Tony');
    },
    "third level inheritance with polymorphism": function (){
    	var oBengal = new BengalTiger();
    	assert(oBengal.sayName() === 'Hi, my name is Shere Khan and I am the true lord of the jungle!');
    },
    "test of jQuery.proxy": function(){
    	var oBengal = new BengalTiger();
    	var fCallBack = jQuery.proxy(oBengal.sayName, oBengal);
    	assert(fCallBack() == 'Hi, my name is Shere Khan and I am the true lord of the jungle!');
    },
    "test of jQuery.ajax": function(done){
    	jQuery.ajax("http://www.google.com").done(done)
    	.fail(function(err){
    		assert(true == false);
    	});
    },
    "test of jQuery": function(){
    	var sTest = jQuery("#testme", "<div id=\"testme\">Rich was here</div>").html();
    	assert(sTest == "Rich was here");
    },
    "test of jQuery no context": function(){
    	var sTest = jQuery("<div id=\"testme\">Rich was here</div>").find("#testme").html();
    	assert(sTest == "Rich was here");
    },
    "test of jQuery global": function(){
    	jQuery("<div id=\"testme\">Rob was here</div>");
    	var sTest = jQuery("#testme").html();
    	assert(sTest == "Rob was here");
    },
    "test of jQuery getting and parsing xml": function(done){
    	jQuery.ajax("https://groups.google.com/forum/feed/fancybox/msgs/rss_v2_0.xml?num=50")
    	.done(function(xml){
    		var aItems = jQuery(xml).find("item");
    		aItems.each(function(){
    			var oItem = jQuery(this);
    			var sTitle = oItem.find("title").text();
    			//console.log(sTitle);
    			assert(sTitle != "");
    		});
    		done();
    	})
    	.fail(function(err){
    		assert(err == null);
    	});
    }
};

var keys = Object.keys (tests);
var keysLength = keys.length;

(function again (i){
    if (i<keysLength){
        var fn = tests[keys[i]];
        if (fn.length){
            fn (function (){
                console.log("Passed Test: \"" + keys[i] + "\" " + ++i + " of " + keys.length);
                again (i);
            });
        }else{
            fn ();
            console.log("Passed Test: \"" + keys[i] + "\" " + ++i + " of " + keys.length);
            again (i);
        }
    }
})(0);