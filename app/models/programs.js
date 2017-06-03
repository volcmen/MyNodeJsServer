const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const progSchema = new Schema({
    programID: {type: String, unique: true, required: true},
    status: String,
    user: String,
    client: String,
    programName: String,
    exercises: Array,
    programType: String
});

module.exports = mongoose.model('Programs', progSchema);