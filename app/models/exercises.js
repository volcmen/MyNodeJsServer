const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exercisesSchema = new Schema({name: {type: String, unique: true, required: true}}, {strict: false});

module.exports = mongoose.model('Exercises', exercisesSchema);