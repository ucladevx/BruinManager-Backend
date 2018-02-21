var mongoose = require('mongoose');
const { Schema } = mongoose

var eventSchema = new Schema({
    name : {
        required: true,
        type: String
    },
    start_time : {
        required: true,
        type: String
    },
    end_time : {
        required: true,
        type: String
    },
    location : {
        required: true,
        type: String
    },
    going : {
        required: true,
        type: Number
    },
    interested : {
        required: true,
        type: Number
    },
    pincture : {
        required: true,
        type: String
    },
    category : {
        required: true,
        type: String
    },
});

mongoose.model('eventSchema', eventSchema);