// load the module
var url = require("url");
var util = require("util");
var queryString = require("querystring");
var db = require("./db");

// let the start function can be called by other file.
exports.start = (request, response) => {
	console.log("start method");
	// write a Hello World to user.
	response.writeHead(200, {
		"Content-Type" : "text/html"
	});
	response.write("<div>Hello World!!</div>");
	response.end();
}
// let the save function can be called by other file.
exports.save = (request, response) => {
	var str = '';
	// bind hte event that data sent to server
	request.on("data", (chunk) => {
		// decode the request from request.
		str += decodeURIComponent(chunk);
	});
	// bind the event that request sent end
	request.on("end", () => {
		var data = {};
		var param = queryString.parse(str);
		data.msg = param.msg;
		data.time = new Date();
		// use mongoDB to store the data.
		db.save(data, (result) => {
			response.end();
		});
	});
}
// let the list function can be called by other file.
exports.list = (request, response) => {
	// get the request query.
	var params = url.parse(request.url, true).query;
	// use mongoDB to read the data
	db.list((err, collections) => {
		if (err) {
			console.log(err);
		}
		else {
			// create a html.
			response.writeHead(200, {
				'Content-Type' : 'text/plain'
			});
			console.log(collections);
			// write the data to the client.
			response.write(JSON.stringify(collections));
			response.end();
		}
	});
}
