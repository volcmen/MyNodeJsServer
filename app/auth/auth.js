const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
// var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
// var BearerStrategy = require('passport-http-bearer').Strategy;

// var libs = process.cwd() + '/libs/';

// var config = require(libs + 'config');

const User = require('../models/user');
// var Client = require(libs + 'model/client');
// var AccessToken = require(libs + 'model/accessToken');
// var RefreshToken = require(libs + 'model/refreshToken');

passport.use(new BasicStrategy(
    function(username, password, done) {
        User.findOne({ email: username }, function(err, client) {
            if (err) {
                return done(err);
            }

            if (!user) {
                return done(null, false);
            }

            if (user.hashedPassword !== user.checkPassword(password)) {
                return done(null, false);
            }

            return done(null, client);
        });
    }
));