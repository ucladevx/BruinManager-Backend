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

router.post('/user', function(req, res){

	var classes = req.body.classes;
	var classArr = [];
	var noteArr = [];

	for(var i = 0; i < classes.length; i++){
		var addC = new classSchema(classes[i]);
		classArr.push(addC);
	}

	var enrollments = new enrollmentSchema(req.body.enrollment);

	var p = new userSchema({
		name: req.body.name,
		classes: {classes},
		enrollment:{enrollments},
		notes: {noteArr}
	});

	p.save();
	res.send("posted");
});

router.post('/notes/:userName', (req,res) =>{
	addNote(req,res);
});

// router.post('/notes/:userName', (req,res) => {
// 	// var userName = req.body.userName;
// 	// console.log(req.params.userName);
// 	userSchema.findOne({ "name" : req.params.userName })
// 		.then((user) => {
// 			// console.log(noteData.notes);
// 			var notesArr = user.notes;

// 		})
// 		.catch((e) => {
// 			console.log(e);
// 		})

// 	res.send("Notes saved");
// })

function addNote(req, res){

	var note = req.body.note;
	var date = req.body.date;

	var newNote = new noteSchema({
		note: note,
		date: date
	});

	userSchema.findOneAndUpdate({name: req.body.userName}, {$push: {notes: newNote}});
	// res.send("note saved");
	res.send(newNote);
}

module.exports = router