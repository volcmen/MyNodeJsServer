var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var gymSchema = new Schema({
    id: {type: String, unique: true, required: true},
    address: String,
    photo: {type: String, default: null},
    users: [],
    gymsDiscription: String,
    workingTime: String,
    ourHistory: String,
    clients: []
});

gymSchema.methods.addUsers = function (users) {
    return this.users.push(users)
};

gymSchema.methods.addClients = function (clients) {
    return this.clients.push(clients)
};

module.exports = mongoose.model('Gym', gymSchema);