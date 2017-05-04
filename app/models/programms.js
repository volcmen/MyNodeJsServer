var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var progSchema = new Schema({
    programmID: String,
    status: String,
    user: String,
    client: String,
    programmName: String,
    exercises: [],
    programmType: String
});

module.exports = mongoose.model('Programms', progSchema);