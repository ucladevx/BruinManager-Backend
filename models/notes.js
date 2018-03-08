var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var notes = new Schema({
	note: {type: String},
	date: {type: String}
});

mongoose.model('noteSchema', notes)