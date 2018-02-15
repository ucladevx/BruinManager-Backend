var mongoose = require('mongoose');
const { Schema } = mongoose
// var Schema = mongoose.Schema;

const classSchema = new Schema({
    discussion: {
        // type: String,
        // required: true,
        
        days : {
        	required: true,
        	type: String
        },
        instructor : {
        	required: true,
        	type: String
        },
        location : {
        	required: true,
        	type: String
        },
        section : {
        	required: true,
        	type: String
        },
        status : {
        	required: true,
        	type: String
        },
        time : {
        	required: true,
        	type: String
        },
        waitlist_status : {
        	required: true,
        	type: String
        },
    },
    lecture: {
        // type: String,
        // required: true,

        days : {
        	required: true,
        	type: String
        },
        instructor : {
        	required: true,
        	type: String
        },
        location : {
        	required: true,
        	type: String
        },
        name : {
        	required: true,
        	type: String
        },
        section : {
        	required: true,
        	type: String
        },
        status : {
        	required: true,
        	type: String
        },
        time : {
        	required: true,
        	type: String
        },
       	units : {
        	required: true,
        	type: String
        },
        waitlist_status : {
        	required: true,
        	type: String
        },
    }
});

// modules.exports = classSchema;
mongoose.model('classSchema', classSchema);