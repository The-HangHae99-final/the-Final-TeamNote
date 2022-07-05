var Toolbox = require('js-toolbox').Toolbox, jQuery = require('js-toolbox')._jQuery, i18n = require('i18n-abide'),
fs = require('fs'), _eval = require('eval'), path = require('path'), uuid = require('node-uuid'),
express = require('express');

var AsyncOptions = Toolbox.Base.extend({oOptions:{app: null}});

var renderAsync = new AsyncOptions();

module.exports.express = jQuery.proxy(function(oOptions){
	if(typeof oOptions != "undefined") jQuery.extend(this.oOptions, oOptions);
	this.oOptions.app = express();
	try{
		this.oOptions.app.use(express.bodyParser());
		//this.oOptions.app.use(require('connect').bodyParser());
		// these must be in this order
		this.oOptions.app.use(express.cookieParser());
		this.oOptions.app.use(express.session({secret:uuid.v4()}));
		// find out what i18n directories we have and therefore what languages are supported
		var aSupported = fs.readdirSync("i18n");
		// en-US is alway supported
		aSupported.push("en-US");
		this.oOptions.app.use(i18n.abide({
		  supported_languages: aSupported,
		  default_lang: 'en-US',
		  translation_directory: 'i18n',
		  translation_type: 'key-value-json',
		  locale_on_url: true
		}));
		this.oOptions.app.use(this.oOptions.app.router);
		//add a route for environment variables
		this.oOptions.app.get("/process.env.OPENSHIFT_MYSQL_DB_HOST", function(req, res){
			res.setHeader("Content-Type", "application/json");
			var oHost = {OPENSHIFT_MYSQL_DB_HOST: process.env.OPENSHIFT_MYSQL_DB_HOST};
			console.log(oHost);
			res.end(JSON.stringify(oHost));
		});
	}catch(e){
		console.log("no i18n support " + e.toString());
	}
	return this.oOptions.app;
}, renderAsync);

module.exports.__express = jQuery.proxy(function(path, options, callback) {
	if(typeof options == "undefined") options = {};
	var newOptions = {};
	jQuery.extend(newOptions, options, this.oOptions);
	var oRender = new RenderFileAsync(path, newOptions, callback);
	fs.readFile(path, jQuery.proxy(oRender.parseFile, oRender));
}, renderAsync);

module.exports.renderAsync = jQuery.proxy(function(req, res) {
	var sPath = req.app.get('views') + req._parsedUrl.path;
	this.oOptions.gettext = req.gettext;
	this.oOptions.lang = req.lang;
	this.oOptions.sHost = req.headers['host'];
	this.oOptions.sCookie = req.headers['cookie'];
	//internationalize
	var slang_dir = "ltr";
	try
	{
		// note that if we have a rtl language we need to set "ltr":"rtl" in messages.json (see ar for example)
		slang_dir = req.gettext("ltr");
	}
	catch(e)
	{
		//ignore this exception since we already set lang_dir
	}
	this.oOptions.lang_dir = slang_dir;
	this.oOptions["__"] = req.gettext;
	var oRender = new RenderFileAsync(sPath, this.oOptions, function(err, html){
		if(err){
			console.log(err);
			res.send(err.status, err.code);
		}else{
			res.setHeader("Content-Type", "text/html");
			res.end(html);
		}
	});
	fs.readFile(sPath, jQuery.proxy(oRender.parseFile, oRender));
}, renderAsync);

module.exports.webServer = jQuery.proxy(function(req, res){
	var sPath = req._parsedUrl.path; 
	if( sPath == '/' && typeof this.oOptions.welcomeFile != "undefined"){
		req._parsedUrl.path = '/' + this.oOptions.welcomeFile;
		module.exports.renderAsync(req, res); 
	}else{
		res.sendfile(req.app.get('views') + sPath, function(err){
			if(err){
				console.log(err);
				res.send(err.status, err.code);
			}
		});		
	}
}, renderAsync);

var RenderFileAsync = Toolbox.Base.extend({
	sPath : null,
	oOptions : {},
	fCallback : null,
	constructor : function(sPath, oOptions, fCallback) {
		jQuery.extend(this.oOptions, oOptions);
		if (typeof this.oOptions.sProtocol == 'undefined')
			this.oOptions.sProtocol = "http";
		if (typeof this.oOptions.sHost == 'undefined'){
			//set ipaddress from openshift, to command line or to localhost:8080
			var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
			var port = process.env.OPENSHIFT_NODEJS_PORT || parseInt(process.argv.pop()) || 8080;
			this.oOptions.sHost = ipaddr + ':' + port;
		}
		if (typeof this.oOptions.locals == 'undefined')
			this.oOptions.locals = {};
		if (typeof this.oOptions.sBefore == 'undefined')
			this.oOptions.sBefore = "<%";
		if (typeof this.oOptions.sAfter == 'undefined')
			this.oOptions.sAfter = "%>";
		this.sPath = sPath;
		this.oOptions.include = jQuery.proxy(this.include, this);
		this.oOptions.layout = jQuery.proxy(this.layout, this);
		this.oOptions.partial = jQuery.proxy(this.partial, this);
		this.oOptions.link = jQuery.proxy(this.link, this);
		this.oOptions.body = jQuery.proxy(this.body, this);
		if (typeof fCallback != 'undefined')
			this.fCallback = fCallback;
	},
	aTokens : null,
	// break file up in to pieces that are all javascript or all html
	parseFile : function(err, sContents) {
		if (err)
			this.renderError(err);
		this.aTokens = sContents.toString().split(this.oOptions.sBefore);
		for (var i = 0; i < this.aTokens.length; i++) {
			if (this.aTokens[i].indexOf(this.oOptions.sAfter) != -1) {
				var aTemp = this.aTokens[i].split(this.oOptions.sAfter);
				this.aTokens[i] = this.oOptions.sBefore + aTemp[0]
						+ this.oOptions.sAfter;
				this.aTokens.splice(i + 1, 0, aTemp[1]);
			}
		}
		this.parseToken();
	},
	// when we include we always do a jQuery ajax ala php
	include : function(sPath) {
		// path needs to be changed from filesystem to path to resource
		var sFilePath = sPath;
		var sDir = path.dirname(this.sPath.replace(this.oOptions.app.get('views'), '')).replace('.', '');
		if(sPath.indexOf('//') == -1){
			sFilePath = this.oOptions.sProtocol + '://' + this.oOptions.sHost + sDir + sPath;
		}else if(sPath.indexOf('//') == 0){
			sFilePath = this.oOptions.sProtocol + ':' + sPath;
		}
		// we are doing asynchronous stuff
		this.nNesting++;
		var oRender = new RenderFileAsync(sDir + sPath, this.oOptions, 
				jQuery.proxy(this.render, this));
		// get the resource
		jQuery.ajax({url:sFilePath,
			headers:{
				Cookie: this.oOptions.sCookie
			}})
			.done(jQuery.proxy(function(html){
				this.parseFile(null,html);
			}, oRender))
			.fail(jQuery.proxy(this.renderError, this));
	},
	// records the name of the layout for later
	layout : function(sPath) {
		this.sLayout = path.dirname(this.sPath) + '/' + sPath;
	},
	// renders a template for every item in a collection
	partial : function(sPath, oCollection){
		// we will be async at least to read the file
		this.nNesting++;
		var sFilePath = path.dirname(this.sPath) + '/' + sPath;
		fs.readFile(sFilePath, jQuery.proxy(function(err, sContents){
			if(err) this.renderError(err);
			else{
				if(typeof oCollection == "string"){
					// then we also need to get the collection resource turning a file path into a URI
					if(oCollection.indexOf('//') == -1){
						oCollection = this.oOptions.sProtocol + '://' + this.oOptions.sHost + oCollection;
					}else if(oCollection.indexOf('//') == 0){
						oCollection = this.oOptions.sProtocol + ':' + oCollection;
					}
					jQuery.ajax({url: oCollection, dataType: 'json',
						headers:{
							Cookie: this.oOptions.sCookie
						}})
					.done(jQuery.proxy(function(oCollection){
						this.renderPartial(sContents, oCollection);						
					}, this))
					.fail(jQuery.proxy(this.renderError, this));
				}else{
					this.renderPartial(sContents, oCollection);
				}
			}
		}, this)); 
	},
	// link pulls in a resource verbatim
	link : function(sPath){
		// we will be async at least to read the file
		this.nNesting++;
		if(sPath.charAt(0) != '/' && sPath.indexOf('http') == -1){
			// then we are looking for a local resource and just need to read the file so that our 
			//server doesn't do anything with it
			var sFilePath = path.dirname(this.sPath) + '/' + sPath;
			fs.readFile(sFilePath, jQuery.proxy(this.render, this));
		}else{
			// then we are getting an external resource and need to use ajax
			if(sPath.indexOf('//') == 0){
				sPath = this.oOptions.sProtocol + ':' + sPath;
			}else if(sPath.indexOf('http') == -1){
				sPath = this.oOptions.sProtocol + '://' + this.oOptions.sHost + sPath;
			}
			jQuery.ajax({url:sPath,
				headers:{
					Cookie: this.oOptions.sCookie
				}})
			.done(jQuery.proxy(this.renderDone, this))
			.fail(jQuery.proxy(this.renderError, this));
		}
		
	},
	// body used in the rendering of a layout
	body: function(){
		// need this to be in the options so it will be copied in to the layout
		return(this.oOptions._body);
	},
	// internals
	sHtml : "",
	nCur : 0,
	nNesting : 0,
	sLayout : null,
	// parse a piece of javascript or html
	parseToken : function() {
		if (this.nCur < this.aTokens.length) {
			var sToken = this.aTokens[this.nCur];
			if (sToken.substring(0, 2) == this.oOptions.sBefore) {
				// then we have javascript
				var sJavaScript = sToken.substring(2, sToken.length - 2);
				if (sJavaScript.charAt(0) == '=') {
					sJavaScript = "module.exports" + sJavaScript;
					this.sHtml += _eval(sJavaScript, this.sPath, this.oOptions,
							false).toString();
				} else
					_eval(sJavaScript, this.sPath, this.oOptions, false);
				if (!this.nNesting)
					this.parseToken(++this.nCur);
			} else {
				// then we just have html
				this.sHtml += sToken;
				this.parseToken(++this.nCur);
			}
		} else if (this.sLayout) {
			// set in the layout method
			this.renderLayout();
		} else if (this.fCallback)
			// then we are done
			this.fCallback(null, this.sHtml);
	},
	// actually render the outside portion 
	renderLayout: function(){
		this.oOptions._body = this.sHtml;
		this.sHtml = "";
		var oRender = new RenderFileAsync(this.sLayout, this.oOptions, jQuery.proxy(
			function(err, html) {
				if (err)
					this.renderError(err);
				if (this.fCallback)
					this.fCallback(null, html);
			}, this));
		fs.readFile(this.sLayout, jQuery.proxy(oRender.parseFile, oRender));
	},
	// we actually have all of the pieces, lets do it!
	renderPartial: function(sContents, oCollection){
		for(var nCollection = 0;  nCollection < oCollection.length; nCollection++){
			var oRender = new RenderFileAsync(this.sPath, oCollection[nCollection], 
				jQuery.proxy(function(err, html){
				if(err)this.renderError(err);
				else if(nCollection == oCollection.length - 1)	this.renderDone(html);
				else this.sHtml += html;
			}, this));
			oRender.parseFile(null, sContents);
		}
	},
	render: function(err, html){
		if(err) this.renderError(err);
		else this.renderDone(html);
	},
	renderDone: function(html){
		this.sHtml += html;
		this.nNesting--;
		if (!this.nNesting)
			this.parseToken(++this.nCur);
		
	},
	// err callback for ajax fail and also used elsewhere
	renderError : function(err) {
		console.log(err);
		if (this.fCallback)
			this.fCallback(err);
	}
});