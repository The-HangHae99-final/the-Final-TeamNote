/**
 * jstoolbox ... Provides a primitive base class for class-based inheritance for node.js
 *
 * also provides shims to run node.js require and module.exports inside a browser
 */
// a global "document" context for jQuery document is sealed first time it is used in that context
var oContext = {oDocument:null, bSealed: false};

if(typeof require == "undefined"){
	// then you will need to have included any dependency already in a script tag
	require = function(value){
		if(typeof window[value] == "undefined"){
			// then the module's export is the name
			return window;
		}
		else{
			// then the module itself is the name
			return window[value];			
		}
	};
}else{
	//then I want to require some extras into node and add them into the namespace under _jQuery
	var cheerio = require('cheerio'), fNodeProxy = require('nodeproxy');
	module.exports._jQuery = fNodeProxy(function(sSelector, sContext){
		rc = null;
		if(typeof sContext == "undefined"){
			if(typeof sSelector == "string" && sSelector.indexOf('<') == -1){
				if(sSelector == 'document') rc = this.oDocument;
				else rc = this.oDocument.find(sSelector);
				// first time we use it in this context we don't allow the document to change
				this.bSealed = true;
			}else if(typeof sSelector == "string"){
				rc = cheerio.load(sSelector.replace(/<!\[CDATA\[([^\]]+)]\]>/ig, "$1")).root();				
				if(!this.bSealed) this.oDocument = rc;
			}else{
				rc = cheerio(sSelector);
			} 
		}else{
			rc = cheerio(sSelector, sContext);
		}
		return(rc);
	}, oContext);
	module.exports._jQuery.ajax = require('./lib/najax');
	module.exports._jQuery.proxy = fNodeProxy;
	var jQuery = {};
	module.exports._jQuery.extend = jQuery.extend = require('extend');
}

if(typeof module == "undefined"){
	module = {};
	module.exports = {};
}

var Toolbox = {};

(function () {
    "use strict";



    // Helper function to correctly set up the prototype chain, for subclasses.
    // Similar to `goog.inherits`, but uses a hash of prototype properties and
    // class properties to be extended.
    function inherits(parent, protoProps, staticProps) {
        var child;
        // `ctor` and `inherits` are from Backbone (with some modifications):
        // http://documentcloud.github.com/backbone/

        // Shared empty constructor function to aid in prototype-chain creation.
        var ctor = function () {};

        // The constructor function for the new subclass is either defined by you
        // (the "constructor" property in your `extend` definition), or defaulted
        // by us to simply call `super()`.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function () { return parent.apply(this, arguments); };
        }

        // Inherit class (static) properties from parent.
        jQuery.extend(child, parent);

        // Set the prototype chain to inherit from `parent`, without calling
        // `parent`'s constructor function.
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();

        // Add prototype properties (instance properties) to the subclass,
        // if supplied.
        if (protoProps) jQuery.extend(child.prototype, protoProps);

        // Add static properties to the constructor function, if supplied.
        if (staticProps) jQuery.extend(child, staticProps);

        // Correctly set child's `prototype.constructor`.
        child.prototype.constructor = child;

        // Set a convenience property in case the parent's prototype is needed later.
        child.__super__ = parent.prototype;

        return child;
    };

    // Self-propagating extend function.
    // Create a new class that inherits from the class found in the `this` context object.
    // This function is meant to be called in the context of a constructor function.
    function extendThis(protoProps, staticProps) {
        var child = inherits(this, protoProps, staticProps);
        child.extend = extendThis;
        return child;
    }

    // A primitive base class for creating subclasses.
    // All subclasses will have the `extend` function.
    // Example:
    //     var MyClass = Toolbox.Base.extend({
    //         someProp: 'My property value',
    //         someMethod: function () { ... }
    //     });
    //     var instance = new MyClass();
    Toolbox.Base = function () {};
    Toolbox.Base.extend = extendThis;
})();

module.exports.Toolbox = Toolbox;