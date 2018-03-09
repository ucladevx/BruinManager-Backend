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

/**** Schemas ****/

// post a user's data to save in database
//TODO: update user if they already exist, else make a new document
router.post('/user', function(req, res){

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
		enrollment:{enrollments},
		notes: []					// user has no notes to start with
	});

	p.save();
	res.send("posted");
});

// post a note to save to specified user's document
router.post('/notes/:userName', (req,res) =>{

	var note = req.body.note;
	var date = new Date();

	var newNote = new noteSchema({
		note: note,
		date: date
	});

	userSchema.findOne({ "name" : req.params.userName })
		.then((user) => {
			user.notes.push(newNote);
			console.log(user.notes);
			user.save();
			res.send(newNote);
		})
		.catch((e) => {
			console.log(e);
			res.send(e);
		})
});

// update given index in note array
router.post('/notes/update/:userName/:noteNumber', (req,res) => {

	var note = req.body.note;
	var date = new Date();

	var newNote = new noteSchema({
		note: note,
		date: date
	});

	userSchema.findOne({ "name" : req.params.userName })
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

module.exports = router