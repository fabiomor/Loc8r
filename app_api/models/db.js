var mongoose = require('mongoose')
var gracefulShutdown;
var dbURI = 'mongodb://localhost/Loc8r';
//var dbLoc8r = mongoose.createConnection(dbURI);
var options = { replset: { socketOptions: { connectTimeoutMS : 30000 }}};

if (process.env.NODE_ENV === 'production') {
	//dbURI = 'mongodb://heroku_xk19vhqj:ih9ndhfrr7k4chgieajv8rfuv6@ds013202.mlab.com:13202/heroku_xk19vhqj';
	dbURI = process.env.MONGOLAB_URI;
}
mongoose.connect(dbURI,options);

mongoose.connection.on('connected', function () {
	console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error',function (err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
	console.log('Mongoose disconnected');
});

var gracefulShutdown = function (msg, callback) {
	mongoose.connection.close(function () {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};

// For nodemon restarts
process.once('SIGUSR2', function () {
	gracefulShutdown('nodemon restart', function () {
		process.kill(process.pid, 'SIGUSR2');
	});
});

// For app termination
process.on('SIGINT', function() {
	gracefulShutdown('app termination', function () {
		process.exit(0);
	});
});

// For Heroku app termination
process.on('SIGTERM', function() {
	gracefulShutdown('Heroku app shutdown', function () {
		process.exit(0);
	});
});

// BRING IN YOUR SCHEMAS & MODELS
require('./locations');
