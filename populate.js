const mongoose = require('mongoose')
const axios = require('axios')

require("./models/events");
require("./models/eventArray");

var eventArr = [];

const eventSchema = mongoose.model('eventSchema');
const eventArraySchema = mongoose.model('eventArraySchema');

axios.get('http://whatsmappening.io/api/v1/events')
	.then((res) => {
		for(var i = 0; i < 10; i++){
			
			var data = (res.data.features)[i].properties;
			// console.log(data);
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

	})
	.catch((err) => console.log(err));