const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const gymSchema = new Schema({
    id: {type: String, unique: true, required: true},
    address: String,
    photo: {type: String, default: null},
    users: Array,
    gymsDiscription: String,
    workingTime: String,
    ourHistory: String,
    clients: Array,
});

gymSchema.methods.addUsers = function (users) {
    return this.users.push(users)
};

gymSchema.methods.addClients = function (clients) {
    return this.clients.push(clients)
};

module.exports = mongoose.model('Gym', gymSchema);