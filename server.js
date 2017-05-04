var express = require('express');
var session = require('express-session');
var favicon = require('serve-favicon');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
mongoose.Promise = Promise;
var path = require('path');
var ejs = require('ejs');
var passport = require('passport');


var router = require('./app/routes/routes');
var routerClients = require('./app/routes/routesClient');
var routerUser = require('./app/routes/routesUser');
var routerNews = require('./app/routes/routesNews');
var routerGyms = require('./app/routes/routesGym');

var http = require('http');
var fs = require('fs');


var config = require("./app/config/config.json");  //get config.json

var port = process.env.PORT || config.port ||  3000;


mongoose.connect(config.db);


app.set('views', path.join(__dirname + "/.", 'views'));
app.set('view engine', 'ejs');


app.use(express.static(__dirname + '/trash'));

app.use(favicon(path.join(__dirname, 'favicon.ico')));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(session({secret: config.secret, resave: false, saveUninitialized: true, cookie: {maxAge: 1000 * 60 * 15}, httpOnly: true, secure: false }));

app.use('/', router);
app.use('/client/', routerClients);
app.use('/employee/', routerUser);
app.use('/', routerNews);
app.use('/gym/', routerGyms);




var server = http.createServer(app).listen(port, function () {
    if ('development' === app.get('env')) {
        console.log('Express server listening on port ' + port);
    }
});



server.listen(port);
//app.listen();
console.log('Magic happens at ' + config.db + ' : ' + 'port ' + port);




// route middleware to verify a token
// apiRoutes.use(function (req, res, next) {
//
//     // check header or url parameters or post parameters for token
//     var token = req.body.token || req.query.token || req.headers['x-access-token'];
//
//     if(token) {
//         jwt.verify(token, app.get('superDuperMegaOpsilonLamdaSecret'), function (err, decoded) {
//             if (err) return res.json({success: false, message: 'Failed to authenticate token'});
//             else  {
//                 req.decoded = decoded;
//                 next();
//             }
//         })
//     } else {
//         return res.status(403).send({
//             success: false,
//             message: 'No token provided.'
//         })
//     }
// });


// apiRoutes.post('/authenticate', function (req, res) {
//     User.findOne({email: req.body.name}, function(err, user) {
//
//         console.log(user);
//
//         if (err) throw err;
//
//         if (!user) res.json({ success: false, message: 'Authentication failed. User not found.' });
//         else if (user) {
//
//             // check if password matches
//             if (user.password != req.body.password) res.json({ success: false, message: 'Authentication failed. Wrong password.' });
//             else {
//
//                 // if user is found and password is right
//                 // create a token
//                 var token = jwt.sign(user, app.get('superDuperMegaOpsilonLamdaSecret'), {
//                     expiresIn: '24h' // expires in 24 hours
//                 });
//
//                 // return the information including token as JSON
//                 res.json({
//                     success: true,
//                     message: 'Enjoy your token!',
//                     token: token
//                 });
//             }
//
//         }
//
//     });
// });