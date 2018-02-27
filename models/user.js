var mongoose = require('mongoose');
const { Schema } = mongoose

var account = new Schema({
    username: String,
    password: String,
    email: String,
});

mongoose.model('accountSchema', account);