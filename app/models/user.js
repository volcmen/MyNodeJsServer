const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config/config.json').secret;



const userSchema = new Schema({
    //--------------Local----------------
    email: {type: String, unique: true, required: true},
    password: String,
    login: String,
    token: {type: String, unique: true},
    tokenExp: Date,
    created: {type: Date, default: Date.now},
    role: {type: String, default: 'User'},  //-------------Local End--------------

    profile: {
        name: String,
        sureName: String,
        id: String,
        segment: String,
        gender: String,
        phoneNum: String,
        birthDate: String,
        personalInfo: String,
        photo: String,
        gym: String
    },

    //Social Accounts
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    }

});


userSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha512', secret).update(password).digest('hex');
};


userSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.password;
};


// -------------------Tokens-------------------
userSchema.methods.generateJwt = function() {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        // name: this.name,
        exp: parseInt(expiry.getTime() / 1000)
    }, secret);
};

userSchema.methods.verifyJwt = function() {
    return jwt.verify(this.token, secret);
};


module.exports = mongoose.model('User', userSchema);