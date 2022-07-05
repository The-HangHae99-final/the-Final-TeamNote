JS Toolbox
==========

Author: Rich Hildred forked from [Jimmy Do](https://github.com/jimmydo/js-toolbox)

License: MIT

Class based inheritance in the style of BackBone in JavaScript code for Node.js.

index.js
----------

`npm install js-toolbox`

Provides a primitive base class (Toolbox.Base) for class-based inheritance. Install with `npm install js-toolbox --save`.
Based on code from Backbone (http://documentcloud.github.com/backbone/).

	var Toolbox = require('js-toolbox').Toolbox;
	var assert = require('assert');
	
	var Animal = Toolbox.Base.extend({
	    constructor: function (name) {
	        this._name = name;
	    },
	    sayName: function () {
	        return('Hi, my name is ' + this._name);
	    }
	});

	var oAnimal = new Animal("Tony the Tiger");
	assert(oAnimal.sayName() === 'Hi, my name is Tony the Tiger');

js-toolbox can also be used in a browser [see browserTest.html.](https://github.com/rhildred/js-toolbox/blob/master/js-toolbox/browserTest.html). To use it in a browser I added require and module.exports implementations that are also usable in any file included after js-toolbox. To browserify js-toolbox I needed jQuery.extend, since I had it already I added it, jQuery.proxy, jQuery.ajax and just plain jQuery dom parsing to my exports as `_jQuery`. If you wanted to use jQuery.ajax on node for instance you would use `var jQuery = require('js-toolbox')._jQuery;` See the file [tests/index.js](https://github.com/rhildred/js-toolbox/blob/master/js-toolbox/test/index.js)

Depends on:
- extend (https://github.com/justmoon/node-extend)
- najax (https://github.com/alanclarke/najax)
- nodeproxy (https://github.com/iainjmitchell/nodeproxy)
- cheerio (https://github.com/MatthewMueller/cheerio)