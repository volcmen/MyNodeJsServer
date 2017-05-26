const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const exercisesSchema = new Schema({}, {strict: false});

module.exports = mongoose.model('Exercises', exercisesSchema);