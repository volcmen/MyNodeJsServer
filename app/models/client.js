var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config/config.json').secret;


var clientSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: String,
    login: String,
    token: {type: String, unique: true},
    tokenExp: Date,
    created: {type: Date, default: Date.now},
    role: {type: String, default: "Client"},

    profile: {
        name: String,
        sureName: String,
        id: String,
        gender: String,
        phoneNum: String,
        birthDate: String,
        segment: String,
        status: String,
        photo: {type: String, default: null},
        coach: String,
        programs: String,
        abonnement: {
            id: String,
            status: Boolean,
            issueDate: String,
            expDate: String
        }
    }
});

clientSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha512', secret).update(password).digest('hex');
};


clientSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.password;
};

clientSchema.methods.generateJwt = function() {
    var expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        exp: parseInt(expiry.getTime() / 1000)
    }, secret);
};

clientSchema.methods.verifyJwt = function() {
    return jwt.verify(this.token, secret);
};

module.exports = mongoose.model('Client', clientSchema);