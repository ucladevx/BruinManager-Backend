var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hour = new Schema({
	//username
	name: {type: String, required: true},
	hours: [{type: String, required: true}],
});


mongoose.model('hourSchema', hour)