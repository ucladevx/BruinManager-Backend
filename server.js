const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
var path = require("path");

//get key for mLab
const keys = require('./config/keys')
// defined in heroku environment

// get schema defined in model
// require('./models/db1')
require('./models/db')

const Person = mongoose.model('Person')

// connect to mLabs database
mongoose.connect(keys.mongoURI);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.send("hello, welcome to BruinManager");
})

// save schema to mLabs
app.get('/create/:name', function(req, res) {
	// console.log(req.params.name);
	// var p = new Person({
	// 	name: req.params.name,
	// 	age: 5
	// });
	var p = {
		name: "taasin",
		classes: {
			{
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
			}
		},
		enrollment:{
			{
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
			}
		}
	}
	p.save();
	res.send("created a seed user");
})

app.listen(process.env.PORT || 3000, () => {
	console.log("listening on port 3000");
})