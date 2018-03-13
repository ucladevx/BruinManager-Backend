var mongoose = require('mongoose');

//Require schemas 
var classSchema = require('./class');
var enrollmentSchema = require('./enrollment');
var noteSchema = require('./notes');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	user_id: {type: String},
	name: {type: String},
	email: {type: String}, 
	classes: {type: [classSchema], required: true},
	enrollment: {type: [enrollmentSchema], required: true },
	notes: {type: [noteSchema]},
	phone_number: {type: String}
});

mongoose.model('userSchema', userSchema)