var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reminders = new Schema({
	user_id: {type: String},			// user_id, foreign key
	reminders: [{									// array of reminders, with...
		text: {type: String},				// string for reminder content
		date: {type: String},				// date/time to be alerted,
		completed: {type: Boolean},	// if it has been completed,
	}],
	textAlert: {type: Boolean}	// opt in for text message notifications
});

mongoose.model('reminders', reminders);

// ROUTES:
// GET return array of reminders for a user
// TODO:
// POST update reminders arr
