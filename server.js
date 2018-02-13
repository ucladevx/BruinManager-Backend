const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
var path = require("path");

//get key for mLab
const keys = require('./config/keys')
// defined in heroku environment

// get schema defined in model
require('./models/db')
const Person = mongoose.model('Person')

// var CONTACTS_COLLECTION = "contacts";

// connect to mLabs database
mongoose.connect(keys.mongoURI);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();
// app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// app.post("/contacts", function(req, res) {
//   var newContact = req.body;
//   newContact.createDate = new Date();

//   if (!(req.body.firstName || req.body.lastName)) {
//     handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
//   }

//   db.collection(CONTACTS_COLLECTION).insertOne(newContact, function(err, doc) {
//     if (err) {
//       handleError(res, err.message, "Failed to create new contact.");
//     } else {
//       res.status(201).json(doc.ops[0]);
//     }
//   });
// });

app.get('/', function(req, res) {
	res.send("hello, welcome to BruinManager");
})

app.get('/create/:name', function(req, res) {
	// console.log(req.params.name);
	var p = new Person({
		name: req.params.name,
		age: 5
	});
	p.save();
	res.send("created a person");
})

app.listen(process.env.PORT || 3000, () => {
	console.log("listening on port 3000");
})