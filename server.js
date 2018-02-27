const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios')
const cors = require('cors')
var path = require("path"); // needed?

// authentication
const passport = require('passport');
// const expressSession = require('express-session');
// const bCrypt = require('bcrypt-nodejs');
var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

//get key for mLab
const keys = require('./config/keys');		// defined in heroku environment
var configAuth = require('./config/fb');	// auth info

// get schemas defined in model
require('./models/db');				// user data
require('./models/class');			// classes
require('./models/enrollment');		// enrollment passes

require("./models/events");			// mappening events
require("./models/eventArray");		// array of events

require("./models/user");			// authentication 

const userSchema = mongoose.model('userSchema');
const classSchema = mongoose.model('classSchema');
const enrollmentSchema = mongoose.model('enrollmentSchema');

const eventSchema = mongoose.model('eventSchema');
const eventArraySchema = mongoose.model('eventArraySchema');

const accountSchema = mongoose.model('accountSchema');

// connect to mLabs database
mongoose.connect(keys.mongoURI);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cors());

app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

// authentication
// app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({
    clientID: configAuth.facebookAuth.clientID,
    clientSecret: configAuth.facebookAuth.clientSecret,
    callbackURL: configAuth.facebookAuth.callbackURL
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser(function(user, done) {
        done(null, user.id);
});

passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
});

app.get('/auth/facebook',
  passport.authenticate('facebook'));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

// request a dining hall name, return if its open or not and when it will close if open
app.get('/api/hours/:diningHall', function(req,res){
	// TODO: implement
});

// route to save user data once a quarter or whenever they want to update their classes
app.post('/user', function(req, res){

	var classes = req.body.classes;
	var classArr = [];

	for(var i = 0; i < classes.length; i++){
		var addC = new classSchema(classes[i]);
		classArr.push(addC);
	}

	var enrollments = new enrollmentSchema(req.body.enrollment);

	var p = new userSchema({
		name: req.body.name,
		classes: {classes},
		enrollment:{enrollments}
	});

	p.save();
	res.send("posted");
});

// return an array of the user's classes
app.get('/api/classes/:username', function(req, res){

	userSchema.findOne({ "name" : req.params.username}, 'classes', function (err, classArr) {
	  	if (err) return handleError(err);

		res.send(classArr.classes);
	});
});

// return an array of the user's passes
app.get('/api/passes/:username', function(req, res){

	userSchema.findOne({ "name" : req.params.username}, 'enrollment', function (err, passArr) {
	  	if (err) return handleError(err);

	  	res.send(passArr.enrollment);
	});
});

// save 10 Mappening events to db
app.get('/api/getEvents', function(req, res){

	var eventArr = [];

	axios.get('http://whatsmappening.io/api/v1/events')
		.then((res) => {
			for(var i = 0; i < 10; i++){
				
				var data = (res.data.features)[i].properties;
				// console.log(data);
				var event = new eventSchema({
				    name : data.event_name,
				    start_time : data.start_time,
				    end_time : data.end_time,
				    location : data.venue.name,
				    going : data.stats.attending,
				    interested : data.stats.interested,
				    picture : data.cover_picture,
				    category : data.category
				});
				eventArr.push(event);
			}

			// console.log(eventArr);
			var eventContainer = new eventArraySchema({
				events: {eventArr},
				id: 1
			})

			eventContainer.save();
			res.send("Saved Mappening Data!");

		})
		.catch((err) => console.log(err));
		res.send("An error occurred");
});

// return an array of 10 top events from Mappening API for the day
app.get('/api/events/:dateID', function(req, res){

	eventArraySchema.findOne({ "id" : req.params.dateID}, 'events', function (err, eventArr) {
	  	if (err) return handleError(err);

	  	res.send(eventArr);
	});
});

app.get('/profile', isLoggedIn, function(req, res) {
    res.render('profile.ejs', {
        user : req.user // get the user out of session and pass to template
    });
});

app.get('/', function(req, res) {
	// res.sendFile(path.join(__dirname + '/index.html'));
	res.render('index.ejs');
});

app.listen(process.env.PORT || 3000, () => {
	console.log("listening on port 3000");
});

