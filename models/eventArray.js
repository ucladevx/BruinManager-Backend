var mongoose = require('mongoose');
const { Schema } = mongoose

var eventSchema = require('./events');

var eventArr = new Schema({
    events : {type: [eventSchema], required: true},
    id : {type: Number, required: true},
});

mongoose.model('eventArraySchema', eventArr);