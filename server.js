// load the module.
var http = require('http'); 
var url = require('url');
// here can change the port.
var PORT = 9487;

// let start function can be called by other file.
exports.start = (route, handle) => {
	// create a server to listen on 9487 port
	http.createServer((request, response) => {
		// get the user request path name.
		var pathname = url.parse(request.url).pathname;
		// the function to deal with the request path name.
		route(handle, pathname, request, response);
	}).listen(PORT);
	console.log("now Server is listen on port " + PORT);
}



