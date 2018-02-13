const mongoose = require('mongoose')
const { Schema } = mongoose

const personSchema = new Schema({
    name: String,
    age: Number
})

mongoose.model('Person', personSchema)