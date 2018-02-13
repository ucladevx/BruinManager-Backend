const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
var path = require("path");
var ObjectID = mongodb.ObjectID;

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

// var db;

// mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
//   if (err) {
//     console.log(err);
//     process.exit(1);
//   }

//   // Save database object from the callback for reuse.
//   db = database;
//   console.log("Database connection ready");

//   // Initialize the app.
//   var server = app.listen(process.env.PORT || 8080, function () {
//     var port = server.address().port;
//     console.log("App now running on port", port);
//   });
// });

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


const app = express();
app.use(bodyParser.json())

app.get('/hi', function(req, res) {
	res.send("hello");
})

app.listen(process.env.PORT || 3000, () => {
	console.log("listening on port 3000");
})