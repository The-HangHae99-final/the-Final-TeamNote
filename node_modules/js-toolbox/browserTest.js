var Toolbox = require('js-toolbox').Toolbox;

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

module.exports = BengalTiger;