var mongoose = require('mongoose');

//Require schemas 
var classSchema = require('./class');
var enrollmentSchema = require('./enrollment');

var Schema = mongoose.Schema;

var userSchema = new Schema({
	//username
	name: {type: String, required: true},
	classes: {type: [classSchema], required: true},
	enrollment: {type: [enrollmentSchema], required: true },
});


mongoose.model('userSchema', userSchema)