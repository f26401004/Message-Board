// load the module.
var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');
// create a handle variable to handle the request from client.
var handle = {};
handle['/'] = requestHandlers.start;
handle['/save'] = requestHandlers.save;
handle['/list'] = requestHandlers.list;
// server start.
server.start(router.route, handle);

