const express = require('express');
const nodemailer = require('nodemailer');
const async = require('async');
const User = require('../models/user');
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
    return res.status(401);
}

const errHandler = utilities.errHandler;


// Middleware
router.use(passport.initialize());
router.use(passport.session());




//---------------------------App routes-----------------------------------------
router.get('/', function (req, res) {
    return res.status(200).send('Employee api');
});

router.get('/isLoggedIn', function (req, res) {
    return res.send(req.isAuthenticated() ? req.user.toJSON() : '0')
});


// show the login form
router.post('/login', function(req, res, next) {
        passport.authenticate('local-login', function(err, user, info) {
            if (err) {
                return next(err); // will generate a 500 error
            }
            if (!user) {
                return res.status(404).send(info.errMsg);
            }
            req.login(user, function(err){
                if(err){
                    console.error(err);
                    return next(err);
                }
                return res.status(202);
            });
            return res.status(202).json(user)
        })(req, res, next);
    });

router.post('/signup', function(req, res, next) {
        passport.authenticate('local-signup', function(err, user, info) {
            if (err) {
                return next(err); // will generate a 500 error
            }
            if (!user) {
                return res.status(404).send(info.errMsg);
            }
            req.login(user, function(err){
                if(err){
                    console.error(err);
                    return next(err);
                }
                return res.status(202);
            });
            return res.status(202).send('Finish sign-up')
        })
        (req, res, next);
    });

router.get('/profile', isLoggedIn, function (req, res) {
    if (req.user){
        return res.status(202).json(req.user);
    }
    return res.status(401);
});

router.post('/profile/profileEdit', isLoggedIn, upload, function (req, res, next) {
        User.findByIdAndUpdate(req.user._id, {$set: req.body}, {new: true}, (err, user)=>{
            if (err) throw err;
            if (!user) return res.status(409);
            res.status(201);
        })
    });



router.get('/logout', function (req, res) {
    req.logout();
    req.session.destroy();
    return res.status(200);
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



