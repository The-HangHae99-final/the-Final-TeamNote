var TestRunner = require('assert-runner'),
assert = require('assert'),
renderAsync = require('./render-async.js'),
renderFile = renderAsync.__express,
jQuery = require('js-toolbox')._jQuery;

//now we need a server for this so that we can test include
var app= renderAsync.express({welcomeFile: "index.js.html"});
app.set('views', __dirname + '/examples');

var tests = {
	"Test hello": function(done){
		renderFile(__dirname + '/examples/hello.js.html', {first: "Rich", last: "Hildred"}, function(err, html){
			assert(err == null);
			assert(html == '<!DOCTYPE html><html lang="en"><body>hello Rich Hildred</body></html>');
			done();
		});
		
	},
	"Test include": function(done){
		renderFile(__dirname + '/examples/include.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<!Doctype html><body>included from _included.js.html <p>Rich was here</p></body></html>');
			done();
		});
		
	},		
	"Test nested include": function(done){
		renderFile(__dirname + '/examples/nestedinclude.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<!Doctype html><body>included from _nestedincluded.js.html <div><p>Rob was here and Rich was here</p></div></body></html>');
			done();
		});
	},		
	"Test layout": function(done){
		renderFile(__dirname + '/examples/layout.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<!Doctype html><html><body><p>Rich was Here</p></body></html>');
			done();
		});
		
	},
	"Test external include": function(done){
		renderFile(__dirname + '/examples/ajaxinclude.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<!Doctype html><body>included from http://localhost:8080/test <p>Hello World!</p></body></html>');
			done();
		});
	},
	"Test partial": function(done){
		renderFile(__dirname + '/examples/partialouter.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<ul><li>1</li><li>2</li></ul>');
			done();
		});
		
	},
	"Test partial with Ajax": function(done){
		renderFile(__dirname + '/examples/partialouter2.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<ul><li>3</li><li>4</li></ul>');
			done();
		});
		
	},
	"Test partial with Ajax and only 1 result": function(done){
		renderFile(__dirname + '/examples/partialouter3.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<ul><li>1</li></ul>');
			done();
		});
		
	},
	"Test link with local resource": function(done){
		renderFile(__dirname + '/examples/link.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<script id="navTemplate" type="text/template"><li><%= test %></li></script>');
			done();
		});
		
	},
	"Test link with external resource and no protocol": function(done){
		renderFile(__dirname + '/examples/link2.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<script> var oTest = [{"test": 3}, {"test": 4}];</script>');
			done();
		});
		
	},
	"Test link with absolute resource": function(done){
		renderFile(__dirname + '/examples/link3.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<script> var oTest = [{"test": 3}, {"test": 4}];</script>');
			done();
		});
		
	},
	"Test link with external resource with protocol": function(done){
		renderFile(__dirname + '/examples/link4.js.html', {}, function(err, html){
			assert(err == null);
			assert(html == '<script> var oTest = [{"test": 3}, {"test": 4}];</script>');
			done();
		});
		
	},
/*	
 * Doesn't work on Windoze, and I don't care enough about supporting other than .js.html extension
 * "Install it and test with ejs extension": function(done){
		app.engine('ejs', renderFile);
		app.get("*.ejs", function(req, res){
			res.render(req._parsedUrl.path.substring(1));
		});
		jQuery.ajax("http://localhost:8080/test.ejs")
		.done(function(html){
			assert(html == "Rich was here");
			done();
		})
		.fail(function(err){
			assert(err == false);
		});
	},*/
	"Install it and test with js.html extension": function(done){
		// we don't seem to be able to have an engine with a . in it.
		app.get("*.js.html", renderAsync.renderAsync);
		jQuery.ajax("http://localhost:8080/include.js.html")
		.done(function(html){
			assert(html == "<!Doctype html><body>included from _included.js.html <p>Rich was here</p></body></html>");
			done();
		})
		.fail(function(err){
			assert(err == false);
		});
	},
	"Install it and test for welcome file": function(done){
		// we don't seem to be able to have an engine with a . in it.
		app.get("*.js.html", renderAsync.renderAsync);
		jQuery.ajax("http://localhost:8080/")
		.done(function(html){
			assert(html == "<!Doctype html><body>Hello</body></html>");
			done();
		})
		.fail(function(err){
			assert(err == false);
		});
	},
	"Make sure we still serve a plain old html file": function(done){
		jQuery.ajax("http://localhost:8080/test.html")
		.done(function(html){
			assert(html == "hello html");
			done();
		})
		.fail(function(err){
			assert(err == false);
		});
	},
	"Try for French": function(done){
		jQuery.ajax("http://localhost:8080/fr/multilingual.js.html")
		.done(function(html){
			assert(html == "Bonjour");
			done();
		})
		.fail(function(err){
			assert(err == false);
		});

	},
	"Try for English": function(done){
		jQuery.ajax("http://localhost:8080/multilingual.js.html")
		.done(function(html){
			assert(html == "Hello");
			done();
		})
		.fail(function(err){
			assert(err == false);
		});

	},
	"Try for French in welcome file": function(done){
		jQuery.ajax("http://localhost:8080/fr/")
		.done(function(html){
			assert(html == "<!Doctype html><body>Bonjour</body></html>");
			done();
		})
		.fail(function(err){
			assert(err == false);
		});

	},
	"do a post and make sure we get our variables": function(done){
		jQuery.ajax({
			url: "http://localhost:8080/test4",
			type:"post",
			headers:{
				"Content-type": "application/x-www-form-urlencoded"
			},
			data: "test1=test2&test3=test4",
			dataType: "json"
		})
		.done(function(html){
			console.log(html);
			done();
		}).
		fail(function(err){
			console.log(err);
			assert(err == false);
		});
	}

};

app.get("/test", function(req, res){
    res.setHeader("Content-Type", "text/html");
    res.end("Hello World!");
});

app.get("/test2", function(req, res){
    res.setHeader("Content-Type", "application/json");
    res.end("[{\"test\": 3}, {\"test\": 4}]");
});

app.get("/test3", function(req, res){
    res.setHeader("Content-Type", "application/json");
    res.end("[{\"test\": 1}]");
});

app.post("/test4", function(req, res){
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(req.params));
});


//server everything index.html welcome file
app.use(renderAsync.webServer);


//set ipaddress from openshift, to command line or to localhost:8080
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || parseInt(process.argv.pop()) || 8080;

//start the server listening for requests
app.listen(port, ipaddr);

new TestRunner(tests).again(0);
