var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    newsId: String,
    newsStatus: String,
    newsStatusIco: String,
    dateOfPubl: String,
    Title: String,
    Description: String,
    Photo: {type: String, default: null},
    Video: {type: String, default: null},
    Gym: String
});

module.exports = mongoose.model('NewsFeed', userSchema);