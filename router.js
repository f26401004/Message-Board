// load the module
var fs = require('fs'),
    path = require('path'),
    mime = require('./mime').types
    db = require('./db');

// let the route function can be called by other file. 
exports.route = (handle, pathname, request, response) => {
	console.log("About to route a request for " + pathname);
	// if the request is save or list, then just call the function.
	if (typeof handle[pathname] === 'function') {
		handle[pathname](request, response);
	} else {
		// let all request path add 'assets' in front, make sure that user can not access server.js.
		var realPath = "public" + pathname;
		// support mime file type.
		var ext = path.extname(realPath);
		ext = ext ? ext.slice(1) : 'unknown';
		var contentType = mime[ext] || "text/plain";
		// check if the path exist.
		fs.exists(realPath, function (exists) {
			// if not exist, then return 404 page to user.
			if (!exists) {
				response.writeHead(404, {
					'Context-Type' : 'text/plain'
				});
				response.write("This request URL" + pathname + " was not found");
				response.end();
			} else {
				fs.readFile(realPath, "binary", function (err, file) {
					// if there is an error when reading the file, then return 500 page to user.
					if (err) {
						response.writeHead(500, {
							' Content-Type' : 'text/plain'
						});
						response.end(err);
					// read the file to the user.
					} else {
						response.writeHead(200, {
							'Context-Type' : contentType
						});
						response.write(file, "binary");
						response.end();
					}
				});
			}
		});
	}
}
