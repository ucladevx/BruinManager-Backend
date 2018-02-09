const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')

//get key for mLab
const keys = require('./config/keys')

// get schema defined in model
require('./models/db')
const Person = mongoose.model('Person')

// connect to mLabs database
mongoose.connect(keys.mongoURI);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const app = express();
app.use(bodyParser.json())

app.get('/hi', function(req, res) {
	res.send("hello");
})

app.listen(process.env.PORT || 3000, () => {
	console.log("listening on port 3000");
})