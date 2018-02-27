// routes for /api
const mongoose = require('mongoose');
const axios = require('axios')
var rp = require('request-promise');
var cheerio = require('cheerio');
const express = require('express')
  , router = express.Router()

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

// TODO: Scrape once per day, save in DB and then query db on endpoint call
// request a dining hall name, return hours open for each meal period
router.get('/hours/:diningHall', function(req,res){
	
	var d = new Date();			//Get the date

	//Get name from request
	var name = req.params.diningHall;
	name = name.toLowerCase();

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
			}

			//Return open/closed times for specified dining hall
			res.send(diningHours[name]);

		})
		.catch((err) => {
			console.log(err);
		});
});

module.exports = router

