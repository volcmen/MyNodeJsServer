var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
    email: {
        type: String,
        unique: true
    },
    password: String,
    nameNLName: String,
    role: String
}));