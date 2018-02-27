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

/**** Schemas ****/


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
		enrollment:{enrollments}
	});

	p.save();
	res.send("posted");
});

module.exports = router