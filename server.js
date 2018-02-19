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

	var classes = new classSchema(req.body.classes);	//only for one class right now

	// var classes = [];

	for(var i = 0; i < classes.length; i++){
		console.log(classes[i]);
	}

	var enrollments = new enrollmentSchema(req.body.enrollment);

	var p = new userSchema({
		name: req.body.name,
		classes: {classes},
		enrollment:{enrollments}
	});

	p.save();
	res.send("posted");
})

// save schema to mLabs
app.get('/create', function(req, res) {

	var seedClass = new classSchema({
			discussion: {
			       days : "a",
			       instructor : "b",
			       location : "c",
			       section : "d",
			       status : "e",
			       time : "f",
			       waitlist_status : "g"
		    },
			lecture: {
			       days : "f",
			       instructor : "g",
			       location : "h",
			       name : "i",
			       section : "j",
			       status : "k",
			       time : "l",
			       units : "m",
			       waitlist_status : "n"
    		}
	});

	// // seedClass.save();

	var seedEnrollment = new enrollmentSchema({

		first_pass: {
			end : "o",
			start : "p",
			units : "q",
		},
		second_pass: {
			end : "r",
			start : "s",
			units : "t"
		}
	});

	var p = new userSchema({
		name: "taasin",
		classes: {seedClass},
		enrollment:{seedEnrollment}
	});

	p.save();
	
	res.send("created a seed user");
});

app.get('/', function(req, res) {
	// res.send("Hello, welcome to the BruinManager API");
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.listen(process.env.PORT || 3000, () => {
	console.log("listening on port 3000");
});
	
