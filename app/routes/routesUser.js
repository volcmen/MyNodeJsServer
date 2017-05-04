var express = require('express');
var routerUser = express.Router();
var user = require('../controller/controlUsers');

var multer  = require('multer');
var storage = multer.diskStorage({
        destination: function (req, file, callback) {
            callback(null, './trash/images/users')
        }, filename: function (req, file, callback) {
            callback(null,req.user._id + '-' + Date.now()+'-'+file.originalname);
        }}),
    upload = multer({storage: storage}).single('photo');




routerUser.get('/', function (req, res) {
    res.writeHead(200, {"Content-Type": "application/json"});
    res.end('Employee json are working..')
});


routerUser.post('/login', user.l0g1nUs3r);

routerUser.post('/register', upload, user.cr34t3Us3r);

routerUser.get('/employees' ,user.sh0wUs3rs);

routerUser.get('/search/id/:id', user.f1ndBy1D);

routerUser.get('/search/email/:email', user.f1ndBy3m41l);

routerUser.post('/update/:email',  upload, user.upd4t3us3r);

routerUser.delete('/delete/:email', user.d3l3t3);

routerUser.post('/logout', function(req, res) {
    req.logout();
    res.end('Logged out')
});

module.exports = routerUser;