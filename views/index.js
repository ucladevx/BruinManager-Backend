// create a server and listen on settings.config.port
const settings = require('./config.js');
const express = require('express');
const url = require('url');

const app = express();
const exphbs = require('express3-handlebars');
const bodyParser = require('body-parser');
const datejs = require('datejs');
const session = require('express-session');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');

//database models
const db = //set database
const User = //pull from database

app.use(express.static('public'));
app.engine('hbs', exphbs({
	extname: 'hbs',
	defaultLayout: 'base',
	layoutsDir: __dirname + '/views/layouts/',
	partialsDir: __dirname + '/views/partials/',
	helpers: {
		// TODO make a more generic date formatter
		formatDate: (dateObj) => {
			// DateJS's custom "dddd, MMMM dd, yyyy" date format
			return dateObj.toString('D');
		},
		formatTime: (dateObj) => {
			// DateJS's custom "h:mm tt" date format
			return dateObj.toString('t');
		}
	}
}));
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

var facebook_id = 'our-app-fb-id';
var facebook_secret_id = 'our-app-fb-secret-id';
passport.use(new FacebookStrategy({
	clientID: facebook_id,
	clientSecret: facebook_secret_id,
	callbackURL: 'http://localhost:3000/auth/facebook/callback',
	profileFields: ['id', 'displayName', 'email']
},
	function (accessToken, refreshToken, profile, done) {
		let userName = profile.displayName || null;
		let profileId = profile.id;

		User.findByProfileId(profileId, (user) => {
			if (!user) {
				User.insert(userName, profileId, (user) => {
					return done(null, user);
				});
			}
			return done(null, user);
		});

	}
));

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	done(null, user);
});

app.listen(settings.port, () => {
	console.log("Listening on port 3000");
});

app.get('/', (req, res) => {
	if (req.user) {
		res.redirect('/dashboard');
	} else {
		res.redirect('/landing');
	}
});

app.get('/landing', (req, res) => {
	res.render('home', {
		title: "BruinManager",
		user: req.user
	});
});

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/' }), (req, res) => {
	res.redirect(req.session.returnTo || '/dashboard');
	delete req.session.returnTo;
});
app.get('/auth/facebook/logout', (req, res) => {
	req.logout();
	res.redirect('/landing');
});

function ensureAuthenticated(req, res, next) {
	if (req.user) {
		return next();
	} else {
		req.session.returnTo = req.path;
		res.redirect('/auth/facebook');
	}
}
