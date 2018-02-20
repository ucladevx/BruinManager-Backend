const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
var path = require("path");

//get key for mLab
const keys = require('./config/keys');
// defined in heroku environment

// get schema defined in model
require('./models/db');
require('./models/class');
require('./models/enrollment');

const userSchema = mongoose.model('userSchema');
const classSchema = mongoose.model('classSchema');
const enrollmentSchema = mongoose.model('enrollmentSchema');

// connect to mLabs database
mongoose.connect(keys.mongoURI);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.post('/user', function(req, res){

	var classes = req.body.classes;
	var classArr = [];

	for(var i = 0; i < classes.length; i++){
		var addC = new classSchema(classes[i]);
		classArr.push(addC);
	}

	var enrollments = new enrollmentSchema(req.body.enrollment);

	var p = new userSchema({
		name: req.body.name,
		classes: {classes},
		enrollment:{enrollments}
	});

	p.save();
	res.send("posted");
});

app.get('/api/classes/:username', function(req, res){

	userSchema.findOne({ "name" : req.params.username}, 'classes', function (err, classArr) {
	  	if (err) return handleError(err);

		res.send(classArr.classes);
	  
	});
});

app.get('/api/passes/:username', function(req, res){

	userSchema.findOne({ "name" : req.params.username}, 'enrollment', function (err, passArr) {
	  	if (err) return handleError(err);

	  	res.send(passArr.enrollment);
		// console.log(passArr.enrollment);
	});

});

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT || 3000, () => {
	console.log("listening on port 3000");
});
	