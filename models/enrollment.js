var mongoose = require('mongoose');
const { Schema } = mongoose

// var Schema = mongoose.Schema;

var enrollmentSchema = new Schema({
    first_pass: {
        // type: String,
        // required: true,
        end : {
        	required: true,
        	type: String
        },
        start : {
        	required: true,
        	type: String
        },
        units : {
        	required: true,
        	type: String
        },
    },

    second_pass: {
        // type: String,
        // required: true,
        end : {
        	required: true,
        	type: String
        },
        start : {
        	required: true,
        	type: String
        },
        units : {
        	required: true,
        	type: String
        },
    }
});

// modules.exports = enrollmentSchema;
mongoose.model('enrollmentSchema', enrollmentSchema);