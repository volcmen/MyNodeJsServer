const express = require('express');
const nodemailer = require('nodemailer');
const async = require('async');
const User = require('../models/user');
const Client = require('../models/client');
const passport = require('../config/passport');
const utilities = require('../models/utilites');
const multer  = require('multer');
const storage = multer.diskStorage({
        destination: function (req, file, callback) {
        callback(null, './trash/images/users')
    }, filename: function (req, file, callback) {
            callback(null,req.user._id + '-' + Date.now()+'-'+file.originalname);
    }}),
    upload = multer({storage: storage}).single('changePhoto');



const router = express.Router();


// Module Variables
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    return res.redirect('/login');
}

const errHandler = utilities.errHandler;


// Middleware
router.use(passport.initialize());
router.use(passport.session());


router.get('/test', function (req, res) {
    return res.send('<marquee><h1>Welcome to the test page</h1></marquee>');
});

//---------------------------App routes-----------------------------------------
router.get('/', function (req, res) {
    return res.render('index.ejs', {title: 'Fitness Authentication'});
});

router.get('/isLoggedIn', function (req, res) {
    return res.send(req.isAuthenticated() ? req.user.toJSON() : '0')
});


// show the login form
router.route('/login')
    .get(function (req, res) {
        return res.render('login.ejs');
    })
    .post(function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                return next(err); // will generate a 500 error
            }
            if (!user) {
                return res.status(409).render('login.ejs', {errMsg: info.errMsg});
            }
            req.login(user, function(err){
                if(err){
                    console.error(err);
                    return next(err);
                }
                return res.redirect('/profile');
            });
        })(req, res, next);
    });

router.route('/signup')
    .get(function (req, res) {
        return res.render('signup');
    })
    .post(function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) {
                return next(err); // will generate a 500 error
            }
            if (!user) {
                return res.status(409).render('signup.ejs', {errMsg: info.errMsg});
            }
            req.login(user, function(err){
                if(err){
                    console.error(err);
                    return next(err);
                }
                return res.redirect('/profile');
            });
        })(req, res, next);
    });

router.get('/profile', isLoggedIn, function (req, res) {
    Client.find({}, function (err, client) {
        if (err) throw err;
        return res.render('profile', {
            title: 'Profile ' + req.user.profile.name,
            client: client,
            user: req.user
        });
    })
});

router.route('/profile/profileEdit')
    .get(isLoggedIn, function (req, res) {
        return res.render('profileEdit', {user: req.user})
    })
    .post(isLoggedIn, upload, function (req, res, next) {
        user= req.user;
        user.role = req.body.sel ? req.body.sel : user.role;
        user.login = req.body.changeLogin ? req.body.changeLogin : user.login;
        user.profile.id = req.body.changeID ? req.body.changeID : user.profile.id;
        user.profile.name = req.body.changeName ? req.body.changeName : user.profile.name;
        user.profile.sureName = req.body.changeSureName ? req.body.changeSureName : user.profile.sureName;
        user.profile.segment = req.body.changeSegment ? req.body.changeSegment : user.profile.segment;
        user.profile.gender = req.body.changeGender ? req.body.changeGender : user.profile.gender;
        user.profile.birthDate = req.body.changeBDay ? req.body.changeBDay : user.profile.birthDate;
        user.profile.phoneNum = req.body.changePNum ? req.body.changePNum : user.profile.phoneNum;
        user.profile.personalInfo = req.body.changePInfo ? req.body.changePInfo : user.profile.personalInfo;
        user.profile.gym = req.body.changeGym ? req.body.changeGym : user.profile.gym;

        if (req.file) user.profile.photo = req.file.filename ? req.file.filename : user.profile.photo;




        user.save(function (err) {
            if (err) return errHandler(err);
        });
        return res.redirect('/profile')
    });


router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    return res.redirect('/');
});

router.post('/forgot',function(req, res, next){
    async.waterfall([
        function(done) {
            const token = User.generateJwt;
        },
        function(token, done) {
            User.findOne({ email: req.body.email.toLowerCase()}, function(err, user) {
                if (!user) {
                    // req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }

                user.token = token;
                user.tokenExp = Date.now() + 3600000; // 1 hour

                user.save(function(err) {
                    done(err, token, user);
                });
            });
        },
        function(token, user, done) {
            const smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'Gmail',
                auth: {
                    user: 'user@gmail.com',
                    pass: 'pass'
                }
            });
            const mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                // req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return errHandler(err);
        res.redirect('/forgot');
    });
});

router.get('/reset/:token', function(req, res) {
    User.findOne({ token: req.params.token, tokenExp: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
            // req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {
            user: req.user
        });
    });
});


//------------Socials---------------
//Google
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect : '/profile',
    failureRedirect : '/'})
);

//FaceBook
router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

router.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
        successRedirect : '/profile',
        failureRedirect : '/'})
);


module.exports = router;




// // render the page and pass in any flash data if it exists
//     res.render('login.ejs');
// });

// process the login form
// app.post('/login', passport.authenticate('local-login', {
//     successRedirect : '/profile', // redirect to the secure profile section
//     failureRedirect : '/login', // redirect back to the signup page if there is an error
//     failureFlash : true // allow flash messages
// }));


    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    // app.get('/signup', function(req, res) {
    //
    //     // render the page and pass in any flash data if it exists
    //     res.render('signup.ejs'/*, { message: req.flash('signupMessage') }*/);
    // });
    //
    // // process the signup form
    // app.post('/signup', passport.authenticate('local-signup', {
    //     successRedirect : '/profile', // redirect to the secure profile section
    //     failureRedirect : '/signup' // redirect back to the signup page if there is an error
    //     // failureFlash : true // allow flash messages
    // }));



