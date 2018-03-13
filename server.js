const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
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

require("./models/user");			// authentication 

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

// api routes
app.use('/api', require('./routes/api'));

// routes to post data
app.use('/post', require('./routes/post'));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/views/index.html'));
	// res.render('./views/index.ejs');
});

app.listen(process.env.PORT || 3000, () => {
	console.log("listening on port 3000");
});

// TODO: change routes to use user_id
