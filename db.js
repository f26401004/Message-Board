var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/msgBoard";
// use mongoose to maintain the database.
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/msgBoard');

var db = mongoose.connection;
// bind the event that error happened, then report the error the server.
db.on('error', console.error.bind(console, 'db connection error:'));
// bind the event that opened, then report to server once.
db.once('open', () => {
	console.log('Now database connected!!');
});
// set up a schema to store the data.
var schema = mongoose.Schema({
	msg : String,
	time : Date
});
// set up a model to store the data.
var message = mongoose.model('message', schema);

// let the save function can be called by other file.
exports.save = (data, callback) => {
	// connect the database.
	MongoClient.connect(url, (err, client) => {
		if (err) {
			console.log(err);
		} else {
			// put data into model format.
			var target = new message(data);
			// save the data directly.
			target.save();
			console.log("insert success!!");
			callback();
		}
	});
}

// let the list function can be called by other file.
exports.list = (callback) => {
	// connect the database.
	MongoClient.connect(url, (err, client) => {
		if (err) throw err;
		// find all the same schema format data from the database. 
		message.find({}, (err, collections) => {
			if (err) {
				console.log(err);
			} else {
				// use callback function return the collections
				callback("" , collections);
			}
		});
	}); 
}
