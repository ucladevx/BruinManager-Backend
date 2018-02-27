var express = require('express');
var fs = require('fs');
var rp = require('request-promise');
var cheerio = require('cheerio');
var router = express.Router();

//Include ical2json module */
var ical2json = require('ical2json');
//Read in .ics file
// var file = fs.readFileSync("../icsfile.ics", 'utf8');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET dining hall hours */
// router.get('/dining/:name',  function(req, res, next) {
	//name = req.params.name;
	//res.render('index', { title: name});

	//Get the date
	var d = new Date();

	//Day format: Sunday - Saturday -> 0 - 6
	var day = d.getDay();

	var meal;

	var name = 'lunch';

	//Switch case to determine meal period
	switch(name) {
		case 'breakfast': meal = '.hours-open Breakfast'; break;
		case 'brunch':
		case 'lunch': 
			//Check if on the weekend -> Only brunch
			if(day == 0 | day == 1) {
				meal = '.hours-open Brunch';
			} else {
			//Else, only lunch and no brunch
				meal = '.hours-open Lunch';
			}
			break;
		case 'dinner': meal = '.hours-open Dinner'; break;
	}

	var options = {
		uri: 'http://menu.dining.ucla.edu/Hours',
		transform: function(body) {
			return cheerio.load(body);
		}
	};

	rp(options)
		.then(($) => {
			/* Get breakfast hours */
			//var t = $('tbody').html();
			//var h = t.children('tr').html();

			var diningHours = {
				Covel: [],
				DeNeve: [],
				FEAST: [],
				BruinPlate: [],
				BruinCafe: [],
				Cafe1919: [],
				Rendezvous: [],
				DeNeveGrabNGo: [],
				TheStudyatHedrick: []
			};

			var t = $('tbody').find('tr').first('td');

			var dine = [];

			dine[0] = t;



			//console.log(t.next().text());

			//console.log(t.length);

			var hoursArray = [];

			for(var i = 1; i < 9; i++) {
				dine[i] = dine[i - 1].next();
				//console.log(dine[i].text());
			}


			//console.log(dine[0].children().first('td').next().next().text());


			//console.log(dine[0].children().first('td').next().html());

			//var n = dine[0].children().first('td').next().html();

			//console.log(n);

			
			//Iterate through each dining hall and add to array
		
			for(var i = 0; i < 9; i++) {

				var n =  dine[i].children().first('td');

				var diningName;

				var text;

				//Determine name of dining hall to index the diningHours object
				switch(i) {
					case 0: diningName = "Covel"; break;
					case 1: diningName = "DeNeve"; break;
					case 2: diningName = "FEAST"; break;
					case 3: diningName = "BruinPlate"; break;
					case 4: diningName = "BruinCafe"; break;
					case 5: diningName = "Cafe1919"; break;
					case 6: diningName = "Rendezvous"; break;
					case 7: diningName = "DeNeveGrabNGo"; break;
					case 8: diningName = "TheStudyatHedrick"; break;
				}

				for(var j = 0; j < 3; j++) {
					text = n.next().text();
					text = text.replace(/(\r\n|\n|\r)/gm,"");
					text = text.split(' ').join('');
					diningHours[diningName].push(text);
					n = n.next();					
				}
			}

			var jsonObject = JSON.stringify(diningHours);

			console.log(jsonObject);


		})
		.catch((err) => {
			console.log(err);
		});
//});

module.exports = router;
