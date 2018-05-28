const mongoose = require('mongoose');
const express = require('express')
  , router = express.Router()

/**** Schemas ****/

// user data, holds an array of classes and an array of enrollment appointments
require('../models/db');
const userSchema = mongoose.model('userSchema');

// classes
require('../models/class');
const classSchema = mongoose.model('classSchema');

// enrollment passes
require('../models/enrollment');
const enrollmentSchema = mongoose.model('enrollmentSchema');

// notes
require("../models/notes");
const noteSchema = mongoose.model('noteSchema');

// reminders
require("../models/reminders");
const reminderSchema = mongoose.model('reminders');

/**** Schemas ****/

// creates a document in db for a new user on first login
// saves user_id provided by login service, name, and email
// this document will later be updated with classes when /user is posted to
router.post('/userID', function(req, res){

  // save user login info if they don't exist in db
  userSchema.find({user_id: req.body.user_id}).then((user) => {
    if(user.length){
      res.send("user already exists");
    }
    else {
      var p = new userSchema({
      	user_id: req.body.user_id,
      	name: req.body.name,
      	email: req.body.email,
      });

      p.save();
      res.send("saved new user data");
    }
  });
});

// post a user's class/enrollment data to save in database
// user should already have an object in the db, either add classes/enrollment or update it
router.post('/user', function(req, res){

  // create the user object complete with class and enrollment data
	var id = req.body.user_id;
	var classes = req.body.classes;
	var classArr = [];

  var enrollments = new enrollmentSchema(req.body.enrollment);

  var p = {
    user_id: req.body.user_id,
    name: req.body.name,
    email: req.body.email,
    classes: {classes},
    enrollment:{enrollments},
    notes: []					// user has no notes to start with
  };

  // update the schema that already exists, as it should have been created with a post to /userID
  userSchema.findOneAndUpdate({user_id: req.body.user_id}, p, {upsert:true}, function(err, doc){

      if(err){
        res.send(err);
      }
      else {
        res.send("updated user data");
      }
  });

  // init reminder object to empty for a new user
  var reminder = new reminderSchema({
    user_id: req.body.user_id,
    reminder_arr: [],
    textAlert: false
  });

  reminder.save()

});

/**** Notes ****/
// post a note to save to specified user's document
// request body: {"note": "insert note string"}
router.post('/notes/:userID', (req,res) =>{

	var note = req.body.note;
	var date = new Date();

	var newNote = new noteSchema({
		note: note,
		date: date
	});

	userSchema.findOne({ "user_id" : req.params.userID })
		.then((user) => {
			user.notes.push(newNote);
			user.save();
			res.send(newNote);
		})
		.catch((e) => {
			console.log(e);
			res.send(e);
		})
});

// save a user's phone number
router.post('/phonenumber/:userID', (req,res) => {
	var number = req.body.number;

	userSchema.update({ "user_id" : req.params.userID }, { $set: { phone_number: number }}, function(err,number){
		if (err) console.log(err);
  		res.send(number);
	});

})

// TODO: Use update, not save
// update given index in note array
router.post('/notes/update/:userID/:noteNumber', (req,res) => {

	var note = req.body.note;
	var date = new Date();

	var newNote = new noteSchema({
		note: note,
		date: date
	});

	userSchema.findOne({ "user_id" : req.params.userID })
		.then((user) => {
			var index = parseInt(req.params.noteNumber);
			if(index < user.notes.length && index >= 0){
				var oldNote = user.notes.splice(index,1);	// remove old note
				user.notes.splice(index, 0, newNote);		// add new note
				user.save();
				res.send(oldNote);
			}
			else{
				res.send("note index out of bounds");
			}
		})
		.catch((e) => {
			console.log(e);
			res.send(e);
		})
});

/**** Reminders ****/
// TODO: reminders in reminder_arr not saved in proper format
// TODO: need to know when to check if the reminder time has come
// TODO: update reminders with a diff route
// post a reminder to a user's array
/*
req body:
{
  text: "" // this is the string that the user wants to be reminded of
  date: "" // date and time user wants to be alerted
}
*/
router.post('/reminders/:userID', (req,res) =>{

	reminderSchema.findOne({ "user_id" : req.params.userID })
		.then((reminderObj) => {

        // push new reminder to this array
        var reminderArr = reminderObj.reminder_arr;
        var copy = reminderArr;

        var newReminder = {
          text: req.params.reminderText,
          date: req.params.date,
          completed: false
        }

        // console.log(copy);
        copy.push(newReminder);
        // console.log(copy);

        reminderSchema.update({ "user_id" : req.params.userID }, { $set: { reminder_arr: copy }}, function(err, reminderObj){

          if (err)
            res.send(err);

          res.send("saved reminder");
        });

		})
		.catch((e) => {
      res.send(e);
		})
});

// router.post('/userFB', (req,res) => {
// 	var fbdata = {
// 		"name": req.body.name,
// 		"email": req.body.email,
// 		"id": req.body.id,
// 	}
// 	res.send(fbdata);
// });

module.exports = router
