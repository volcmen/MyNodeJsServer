var express = require('express');
var favicon = require('serve-favicon');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var path = require('path');

var apiRoutes = express.Router();

var jwt = require('jsonwebtoken');  //Create, sign, and token
var config = require("./config.json");  //get config.json
var User = require('./app/model/user'); //get our mongoose model

var port = process.env.PORT || config.port ||  3000;    //connect or create port.
mongoose.connect(config.db); // connect to DataBase
app.set('superDuperMegaOpsilonLamdaSecret', config.secret); //our secret

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', function (req, res) {
    res.send('Hello! API is running at ' + config.db + ' : ' + 'port ' + port + '/api');
});

app.listen(port);
console.log('Magic happens at ' + config.db + ' : ' + 'port ' + port);


app.get('/newUser', function (req, res) {
    var newUserTest = new User({
        email: 'TestEmail',
        password: '123123',
        nameNLName: 'TestUser1',
        role: 'Admin'
    });

    newUserTest.save(function(err){
        if (err) throw err;
        console.log(newUserTest.nameNLName + "Saved successfully");
        res.json({success: true});
    })
});


// route middleware to verify a token
apiRoutes.use(function (req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token) {
        jwt.verify(token, app.get('superDuperMegaOpsilonLamdaSecret'), function (err, decoded) {
            if (err) return res.json({success: false, message: 'Failed to authenticate token'});
            else  {
                req.decoded = decoded;
                next();
            }
        })
    } else {
        return res.status(403).send({
            success: false,
            message: 'No token provided.'
        })
    }
});

apiRoutes.get('/', function (req, res) {
    res.json({message: 'Welcome to API'})
});

apiRoutes.get('/users', function (req, res) {
    User.find({}, function (err, users) {
        if (err) throw err;
        else res.json(users);
    });
});

apiRoutes.get('/removeAll', function (req, res) {
    User.remove({}, function (err, users) {
        if (err) throw err;
        else res.json({message: 'Users are deleted' + users});
    })
});

apiRoutes.post('/authenticate', function (req, res) {
    User.findOne({email: req.body.name}, function(err, user) {

        console.log(user);

        if (err) throw err;

        if (!user) res.json({ success: false, message: 'Authentication failed. User not found.' });
        else if (user) {

            // check if password matches
            if (user.password != req.body.password) res.json({ success: false, message: 'Authentication failed. Wrong password.' });
            else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superDuperMegaOpsilonLamdaSecret'), {
                    expiresIn: '24h' // expires in 24 hours
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });
});

app.use('/api', apiRoutes);

