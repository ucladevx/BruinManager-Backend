// routes for /api
const mongoose = require('mongoose');
const axios = require('axios')
var rp = require('request-promise');
var cheerio = require('cheerio');
const express = require('express');
var router = express.Router();
var twilio = require('twilio');

/**** API Functions ****/

// functions called by API endpoints
const api_functions = require('../js/api_functions');

/**** API Functions ****/

/**** Schemas ****/

// user data that holds classes and enrollment passes
require('../models/db');
const userSchema = mongoose.model('userSchema');

// mappening events
require("../models/events");	
const eventSchema = mongoose.model('eventSchema');		

// holds array of events 
require("../models/eventArray");
const eventArraySchema = mongoose.model('eventArraySchema');

// saves times for each dining hall/takeout
// holds array of events 
require("../models/hours");
const hourSchema = mongoose.model('hourSchema');

require("../models/notes");
const noteSchema = mongoose.model('noteSchema');

/**** Schemas ****/

// return an array of the user's classes
router.get('/classes/:userID', function(req, res){

	userSchema.findOne({ "user_id" : req.body.userID}, 'classes', function (err, classArr) {
	  	if (err) return handleError(err);

		res.send(classArr.classes);
	});
});

// return an array of the user's passes
router.get('/passes/:username', function(req, res){

	userSchema.findOne({ "name" : req.params.username}, 'enrollment', function (err, passArr) {
	  	if (err) return handleError(err);

	  	res.send(passArr.enrollment);
	});
});

// save 10 Mappening events to db
// TODO: call once per day, implement search, return more than just a random group of 10 events
// , move to different router file?
router.get('/getEvents', function(req, res){

	var eventArr = [];

	axios.get('http://whatsmappening.io/api/v1/events')
		.then((res) => {
			for(var i = 0; i < 10; i++){
				
				var data = (res.data.features)[i].properties;
				var event = new eventSchema({
				    name : data.event_name,
				    start_time : data.start_time,
				    end_time : data.end_time,
				    location : data.venue.name,
				    going : data.stats.attending,
				    interested : data.stats.interested,
				    picture : data.cover_picture,
				    category : data.category
				});
				eventArr.push(event);
			}

			// console.log(eventArr);
			var eventContainer = new eventArraySchema({
				events: {eventArr},
				id: 1
			})

			eventContainer.save();
			res.send("Saved Mappening Data!");

		})
		.catch((err) => console.log(err));
		res.send("An error occurred");
});

// return an array of 10 top events from Mappening API for the day
router.get('/events/:dateID', function(req, res){

	eventArraySchema.findOne({ "id" : req.params.dateID}, 'events', function (err, eventArr) {
	  	if (err) return handleError(err);

	  	res.send(eventArr);
	});
});

// TODO: Scrape once per day
// request a dining hall name, return hours open for each meal period
router.get('/hours/', function(req,res){
	
	var d = new Date();			//Get the date
	var day = d.getDay();		//Day format: Sunday - Saturday -> 0 - 6

	// get page to scrape data from
	var options = {
		uri: 'http://menu.dining.ucla.edu/Hours',
		transform: function(body) {
			return cheerio.load(body);
		}
	};

	// store scraped data here
	var diningHours = {
		"covel": [],
		"deneve": [],
		"feast": [],
		"bruinplate": [],
		"bruincafe": [],
		"cafe1919": [],
		"rendezvous": [],
		"denevegrabngo": [],
		"thestudyathedrick": []
	};

	rp(options)
		.then(($) => {

			var t = $('tbody').find('tr').first('td');

			var dine = [];
			dine[0] = t;

			var hoursArray = [];

			for(var i = 1; i < 9; i++) {
				dine[i] = dine[i - 1].next();
			}

			//Iterate through each dining hall and add to array
			for(var i = 0; i < 9; i++) {

				var diningName;
				var text;

				var n =  dine[i].children().first('td');

				//Determine name of dining hall to index the diningHours object
				switch(i) {
					case 0: diningName = "covel"; break;
					case 1: diningName = "deneve"; break;
					case 2: diningName = "feast"; break;
					case 3: diningName = "bruinplate"; break;
					case 4: diningName = "bruincafe"; break;
					case 5: diningName = "cafe1919"; break;
					case 6: diningName = "rendezvous"; break;
					case 7: diningName = "denevegrabngo"; break;
					case 8: diningName = "thestudyathedrick"; break;
				}

				for(var j = 0; j < 4; j++) {
					text = n.next().text();
					text = text.replace(/(\r\n|\n|\r)/gm,"");
					text = text.split(' ').join('');
					diningHours[diningName].push(text);
					n = n.next();
				}

				// console.log(diningHours[diningName]);

				var hall = new hourSchema({
					name: diningName,
					hours: diningHours[diningName]
				});

				hall.save();
			}

			res.send("Saved dining hall data");
		})

		.catch((err) => {
			console.log(err);
		});
});

// Theres a BUGGGG
router.get('/hours/:diningHall', function(req,res){
	
	var name = req.params.diningHall;
	name = name.toLowerCase();

	hourSchema.findOne({ "name" : req.params.diningHall })
		.then((hallData) => {

			var foodStatus = "CLOSED";
			var foodClosingTime = -1;

				 for(var i = 0; i < hallData.hours.length; i++){

				  var times = hallData.hours[i].split('-');

				  	var r = api_functions.status(times);
				  	console.log(times);
				  	console.log(r);
				  	if(r != -1){				// found an open time
				  		foodStatus = "OPEN";
				  		foodClosingTime = r;
				  		break;
				  	}
				 }

				 // form response JSON
				 var r = {
				  status: foodStatus, 
				  closingTime: foodClosingTime
				 }

				 res.send(r);
		})
		.catch((e) => {
			console.log(e);
		})
});

// return array of a user's notes
// move notes routes to one file
router.get('/notes/:userName', (req,res) =>{

	userSchema.findOne({ "name" : req.params.userName })
		.then((user) => {
			res.send(user.notes);
		})
		.catch((e) => {
			console.log(e);
		})
})

// delete given index in note array
router.get('/notes/delete/:userName/:noteNumber', (req,res) => {
	userSchema.findOne({ "name" : req.params.userName })
		.then((user) => {
			var index = parseInt(req.params.noteNumber);
			if(index < user.notes.length && index >= 0){
				var removedNote = user.notes.splice(index,1);
				user.save();
				res.send(removedNote);
			}
			else{
				res.send("note index out of bounds");
			}
		})
		.catch((e) => {
			console.log(e);
		})
});

// TODO: need to continuously check if its the pass time
// route to call to text user
router.get('/alert/:userName', (req,res) => {

	userSchema.findOne({ "name" : req.params.userName })
		.then((user) => {

			// TODO: Check if current time is 15 min before one of the user's passes
			// TODO: make sure there are always two passes in schema
			var first = user.enrollment[0].start;
			var second = user.enrollment[1].start;


			var d = new Date();			//Get the date

			//if curr date and time match date and time -15 of passes
				// send a text "your first/second pass is in 15 min"


			// if so, send a text to this number
			var number = user.phone_number;

		})
		.catch((e) => {
			console.log(e);
		})
});


//Twilio API
//Twilio Phone Number (747) 233-1904
//user email: arsaad@g.ucla.edu
//pass:as980612692018
router.get('/textalerts', (req, res) => {
	var accountSid = 'AC7ec6e3be87d0ef44e1cb66a9894e9373'; // Your Account SID from www.twilio.com/console
	var authToken = '684de93e923c5ffb69a0f0d9f4702008';   // Your Auth Token from www.twilio.com/console

	// var twilio = require('twilio');
	var client = new twilio(accountSid, authToken);
	
	client.messages.create({
    	body: 'Hello from Node',
    	to: '+15106486565',  // Enter your phone number here
    	from: '+7472331904' // From a valid Twilio number
	}).then((message) => console.log(message.sid));
});


module.exports = router
