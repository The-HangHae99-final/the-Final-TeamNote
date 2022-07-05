render-async
============

An express template renderer that uses an object to potentially render asynchronously. Supported are layout():

	<% locals.title = "Rich's Calendar"; layout('_layout.js.html') %><p>Rich was Here</p>
	
and in `_layout.js.html`:

	<!Doctype html><html><body><%= body() %></body></html>
	
include(), which always uses jQuery.ajax to do the including so that we can include dynamic resources too:

	<!Doctype html><body>included from http://localhost:8080/test <p><%include('http://localhost:8080/test')%></p></body></html>
	
Of course relative resources can be included too:

	<!Doctype html><body>included from _included.js.html <p><%include('_included.js.html')%></p></body></html>
	
Finally partials can be included:

	<ul><% partial('partialinner.js.html', [{test: 1}, {test: 2}]) %></ul>

Or the collection to be iterated over by the partial can be pulled in with jQuery.ajax like so:

	<ul><% partial('partialinner.js.html', '/test2') %></ul>
	
In both cases the same `partialinner.js.html` is used:

	<li><%= test %></li>
	
This is intended to be a step on the way to a progressive enhancement type web app that runs on a node server with backbone on the client to give a good experience to both browsers and crawlers or browsers with javascript turned off. To this end there is also a link() method that pulls a resource like a `text/template` in to a page as it is. The idea being that, in one go a page could be delivered to a browser that would have everything needed to run, with or without javascript.

i18n (`gettext()`, `__()`) is also supported through the i18n-abide library.