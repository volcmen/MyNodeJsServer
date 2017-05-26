const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
// var mongoose = require('mongoose');
const User = require("../models/user");
// var Client = require("../models/client");
const utilities = require('../models/utilites');
const configAuth = require('./auth');

const errHandler = utilities.errHandler;



// Configuration and Settings
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
        User.findById(id, function (err, user) {
            if (err) {
                console.error('There was an error accessing the records of user with id: ' + id);
                return console.log(err.message);
            }
            return done(null, user);
        })
});

// Strategies



passport.use('local-signup', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        process.nextTick(function() {
            User.findOne({email: email.toLowerCase()}, function(err, user) {
                if(err) {
                    return errHandler(err);
                }
                if(user) {
                    console.log('user already exists');
                    return done(null, false, {errMsg: 'email already exists'});
                }
                else {
                    const newUser = new User();
                    // newUser.username = req.body.username;
                    newUser.email = email.toLowerCase();
                    newUser.password = newUser.encryptPassword(password);
                    newUser.token = newUser.generateJwt();
                    newUser.save(function(err) {
                        if(err) {
                            console.log(err);
                            if(err.message === 'User validation failed') {
                                console.log(err.message);
                                return done(null, false, {errMsg: 'Please fill all fields'});
                            }
                            return errHandler(err);
                        }
                        return done(null, newUser);
                    });
                }
            });
        });
    }));
//---------------------------local login----------------------------------------
passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        User.findOne({email: email.toLowerCase()}, function(err, user) {
            if(err) {
                return errHandler(err);
            }
            if(!user) {
                return done(null, false, {errMsg: 'User does not exist, please <a class="errMsg" href="/signup">signup</a>'});
            }
            if(!user.checkPassword(password)) {
                return done(null, false, {errMsg: 'Invalid password try again'});
            }
            user.token = user.generateJwt();
            user.save(function (err) {
                if (err) {
                    return errHandler(err);
                }
                console.log('User updated: ', user);
            });
            return done(null, user);
        });
}));



// GOOGLE ==================================================================
passport.use(new GoogleStrategy({
    clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
        process.nextTick(function () {
            User.findOrCreate({'google.id': profile.id}, function (err, user) {
                if (err) return errHandler(err);
                if (user) return done(null, user);
                else {
                    const newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = token;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.save(function (err) {
                        if (err) return errHandler(err);
                        return done(null, newUser);
                    });
                }
            });
        });
    }));


// FaceBook ==================================================================
passport.use(new FacebookStrategy({
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL
    },
    function(token, refreshToken, profile, done) {
        process.nextTick(function() {
        User.findOrCreate({ 'facebook.id': profile.id }, function (err, user) {
            if (err) return errHandler(err);
            if (user) return done(null, user);
            else {
                const newUser = new User();
                newUser.facebook.id    = profile.id;
                newUser.facebook.token = token;
                newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName;
                newUser.facebook.email = profile.emails[0].value;
                newUser.save(function (err) {
                    if (err) return errHandler(err);
                    return done(null, newUser);
                })
            }
        });
    })
}));


module.exports = passport;

// passport.use('local-signup', new LocalStrategy({
//         // by default, local strategy uses username and password, we will override with email
//         usernameField : 'email',
//         passwordField : 'password',
//         passReqToCallback : true // allows us to pass back the entire request to the callback
//     },
//     function(req, email, password, done) {
//
//         // find a user whose email is the same as the forms email
//         // we are checking to see if the user trying to login already exists
//         User.findOne({ email :  email }, function(err, user) {
//             // if there are any errors, return the error
//             if (err)
//                 return done(err);
//
//             // check to see if theres already a user with that email
//             if (user) {
//                 return done(err);
//                 // return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
//             } else {
//
//                 // if there is no user with that email
//                 // create the user
//                 var newUser = new User();
//
//                 // set the user's local credentials
//                 newUser.email = req.body.email;
//                 newUser.password = newUser.encryptPassword(password); // use the generateHash function in our user model
//
//                 // save the user
//                 newUser.save(function(err) {
//                     if (err)
//                         throw err;
//                     return done(null, newUser);
//                 });
//             }
//         });
//     }));
//
//
//
// passport.use(new LocalStrategy({
//         usernameField: 'email'
//     },
//     function(username, password, done) {
//         User.findOne({ email: email }, function (err, user) {
//             if (err) { return done(err); }
//             // Return if user not found in database
//             if (!user) {
//                 return done(null, false, {
//                     message: 'User not found'
//                 });
//             }
//             // Return if password is wrong
//             if (!user.checkPassword(password)) {
//                 return done(null, false, {
//                     message: 'Password is wrong'
//                 });
//             }
//             // If credentials are correct, return the user object
//             return done(null, user);
//         });
//     }
// ));