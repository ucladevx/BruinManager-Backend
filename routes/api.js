// routes for /api
const mongoose = require('mongoose');
const axios = require('axios')
var rp = require('request-promise');
var cheerio = require('cheerio');
const express = require('express')
  ,router = express.Router()

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
router.get('/classes/:username', function(req, res){

	userSchema.findOne({ "name" : req.params.username}, 'classes', function (err, classArr) {
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

				  	var r = status(times);
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


// returns -1 if the dining hall is closed, 
// or the closing time(string) for the current meal period if the dining hall is open
function status(times){

	if(times == "CLOSED"){
		return -1;
	}

	var d = new Date();			//Get the date
	var hour = d.getHours();
	var min = d.getMinutes();

	// testing
	// var hour = 20;
	// var min = 0;

	// debugging
	console.log(hour);
	console.log(min);

	var t1 = times[0];		// opening time
	var t2 = times[1];		// closing time

	var open = timeArr(t1, 0, 0);
	var close = timeArr(t2, 1, t1);

	// debugging
	console.log("open");	
	console.log(open[0]);
	console.log(open[1]);

	console.log("close");
	console.log(close[0]);
	console.log(close[1]);

	if(hour >= open[0] && hour <= close[0]){
		if(hour == close[0] && min >= close[1]){		// if same hr as closing hr, check the minutes
			console.log("here1");
			return -1;
		}
		else{
			return t2;										// return closing time
		}
	}
	console.log("here2");
	return -1;											// means not open
}

// returns array of two ints
// [current hr (24 format), current minutes]
function timeArr(str, check, time){

	var l1;
	var ap;

	if(check == 1){
		ap = str.substring(str.length - 2, str.length - 1);
		l1 = time.substring(time.length - 2, time.length - 1);
	}
	
	// console.log(ap);
	var i;
	for(i = 0; i < str.length; i++){
	  	if(str[i] == ':'){
	  		break;
	  	}
	}

	var hr = parseInt(str.substring(0, i));
	var min = parseInt(str.substring(i + 1, i + 3));

	if(ap == 'p' && hr != 12){			// convert to 24 hr format
		hr = hr + 12;
	}

	if(ap == 'a' && l1 == 'p'){			// if study period opens at 9 pm and closes at 2 am
		console.log("oh no");
		hr = hr + 24;
	}

	var result = [hr, min];
	return result;
}

module.exports = router
