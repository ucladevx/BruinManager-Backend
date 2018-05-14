var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userEvents = new Schema({
	user_id: {type: String},				// user_id, foreign key
	events: [{											// array of events (same format as events.js but with two extra attributes)
		name : {type: String},
    start_time : {type: String},
    end_time : {type: String},
    location : {type: String},
    going : {type: Number},
    interested : {type: Number},
    picture : {type: String},
    category : {type: String},
		isSaved : {type: Boolean},		// user has saved event
		isGoing : {type: Boolean},		// user is going to event
	}]
});

mongoose.model('userEvents', userEvents);

// ROUTES
// GET get saved events for a user
// GET get going events for a user

// TODO:
// POST to update events for a user
